// ── AssessIQ Netlify Serverless Function ──────────────────────────────
// Handles: AI question generation + CV parsing
// Called by: questions.js (generate) and Assessment.jsx (parse)
// API: Anthropic Claude Haiku (fast, cheap, accurate)

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

async function callClaude(systemPrompt, userPrompt, maxTokens) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    })
  })
  if (!res.ok) {
    const errBody = await res.text()
    console.error('Claude API error:', res.status, errBody)
    throw new Error('Claude API ' + res.status + ': ' + errBody.slice(0, 200))
  }
  const data = await res.json()
  return data.content?.[0]?.text || ''
}

// ── Question Generation ───────────────────────────────────────────────
async function generateQuestions(difficulty) {
  const diffDesc = difficulty === 'hard'
    ? 'HARD: multi-step problems, compound rules, non-obvious patterns. Logic: number matrices where row AND column rules apply simultaneously (e.g. col3 = col1 * col2, while col2 = col1 + row_index). Numerical: compound interest, CAGR, weighted averages, break-even, NPV, multi-variable work-rate.'
    : 'MEDIUM: moderate 2-step problems. Logic: number grids where each row follows one arithmetic rule. Numerical: percentage changes, ratio problems, mixture problems, simple work-rate.'

  const systemPrompt = 'You are an expert psychometric assessment designer. Return ONLY valid JSON, no explanation, no markdown, no backticks.'

  const logicPrompt = 'Generate 5 logic number matrix questions. Difficulty: ' + diffDesc + '. Return JSON array of 5 objects: [{"id":"L0","type":"logic","grid":[["2","4","6"],["3","6","9"],["4","8","?"]],"options":["10","11","12","14"],"answer":"12","exp":"Col3=Col1x3. Row3: 4x3=12."},...]. Rules: grid=3x3 strings last cell=?, options=4 strings, all numbers as strings. Return ONLY the JSON array.'

  const numPrompt = 'Generate 5 numerical reasoning questions. Difficulty: ' + diffDesc + '. Return JSON array of 5 objects: [{"id":"N0","type":"numerical","question":"If 35% of X is 91 what is X?","tableHtml":null,"options":["240","260","280","300"],"answer":"260","exp":"91/0.35=260."},...]. Rules: options=4 strings, answer correct, tableHtml=null. Return ONLY the JSON array.'

  const [logicText, numText] = await Promise.all([
    callClaude(systemPrompt, logicPrompt, 3000),
    callClaude(systemPrompt, numPrompt, 3000)
  ])

  const parseArr = (text) => {
    console.log('Parsing response of length:', text.length, 'Preview:', text.slice(0, 200))
    // Strip markdown code blocks if present
    let clean = text.replace(/```json/gi, '').replace(/```/g, '').trim()
    // Find the JSON array
    const s = clean.indexOf('[')
    const e = clean.lastIndexOf(']')
    if (s === -1 || e === -1) throw new Error('No JSON array found in: ' + clean.slice(0, 100))
    const jsonStr = clean.slice(s, e + 1)
    try {
      return JSON.parse(jsonStr)
    } catch(parseErr) {
      // Try to recover partial JSON by finding complete objects
      console.error('JSON parse error, attempting recovery. Text length:', jsonStr.length)
      const objects = []
      let depth = 0, start = -1
      for (let i = 0; i < jsonStr.length; i++) {
        if (jsonStr[i] === '{') { if (depth === 0) start = i; depth++ }
        else if (jsonStr[i] === '}') {
          depth--
          if (depth === 0 && start !== -1) {
            try { objects.push(JSON.parse(jsonStr.slice(start, i + 1))) } catch(e) {}
          }
        }
      }
      if (objects.length >= 5) {
        console.log('Recovered', objects.length, 'objects from partial JSON')
        return objects
      }
      throw new Error('JSON parse failed and recovery insufficient: ' + parseErr.message)
    }
  }

  const logic = parseArr(logicText)
  const num   = parseArr(numText)

  if (logic.length < 4) throw new Error('Not enough logic questions: ' + logic.length)
  if (num.length < 4)   throw new Error('Not enough numerical questions: ' + num.length)

  // Pad with bank questions if AI returned fewer than 10
  // Return 5 AI logic + 5 AI numerical (remaining 10 filled by bank in questions.js)
  const combined = [...logic.slice(0, 5), ...num.slice(0, 5)]
  console.log('Returning', combined.length, 'questions. Logic:', logic.length, 'Num:', num.length)
  return combined
}

// ── CV Parsing ────────────────────────────────────────────────────────
async function parseCV(cvBase64, mimeType) {
  const systemPrompt = 'You are a CV parser. Extract structured data from CVs. Return ONLY valid JSON, no explanation, no markdown.'

  const userPrompt = 'Parse this CV and extract the following information. Return a JSON object with exactly these fields:\n{\n  "name": "Full name of the candidate",\n  "email": "Email address",\n  "phone": "Phone number",\n  "dob": "Date of birth in YYYY-MM-DD format if found, else null",\n  "currentRole": "Current or most recent job title",\n  "currentCompany": "Current or most recent employer",\n  "totalExperience": "Estimated total years of experience as a number",\n  "education": [\n    {\n      "degree": "Degree name",\n      "institution": "University or school name",\n      "year": "Graduation year"\n    }\n  ],\n  "experience": [\n    {\n      "title": "Job title",\n      "company": "Company name",\n      "duration": "e.g. 2019-2022",\n      "summary": "Brief 1-sentence summary of responsibilities"\n    }\n  ],\n  "skills": ["skill1", "skill2"],\n  "languages": ["English", "Bengali"]\n}\n\nIf a field is not found, use null for strings and [] for arrays.\nReturn ONLY the JSON object.'

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: mimeType || 'application/pdf',
              data: cvBase64
            }
          },
          { type: 'text', text: userPrompt }
        ]
      }]
    })
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error?.message || 'Claude API error: ' + res.status)
  }

  const data = await res.json()
  const text = data.content?.[0]?.text || ''
  const s = text.indexOf('{'), e = text.lastIndexOf('}')
  if (s === -1 || e === -1) throw new Error('No JSON object in CV parse response')
  return JSON.parse(text.slice(s, e + 1))
}

// ── Handler ───────────────────────────────────────────────────────────
exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (!ANTHROPIC_API_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured in Netlify environment variables.' })
    }
  }

  try {
    const body = JSON.parse(event.body || '{}')
    const { action } = body

    if (action === 'generate') {
      const { difficulty } = body
      if (!difficulty) return { statusCode: 400, headers, body: JSON.stringify({ error: 'difficulty required' }) }
      const questions = await generateQuestions(difficulty)
      return { statusCode: 200, headers, body: JSON.stringify({ questions }) }
    }

    if (action === 'parse_cv') {
      const { cvBase64, mimeType } = body
      if (!cvBase64) return { statusCode: 400, headers, body: JSON.stringify({ error: 'cvBase64 required' }) }
      const parsed = await parseCV(cvBase64, mimeType)
      return { statusCode: 200, headers, body: JSON.stringify({ parsed }) }
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Unknown action. Use generate or parse_cv.' }) }

  } catch (err) {
    console.error('Function error:', err.message, err.stack)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message, stack: err.stack })
    }
  }
}
