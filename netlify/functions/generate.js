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
    const err = await res.json()
    throw new Error(err.error?.message || 'Claude API error: ' + res.status)
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

  const logicPrompt = 'Generate 10 unique logic matrix questions. Difficulty: ' + diffDesc + '\n\nReturn a JSON array of exactly 10 objects. Each object must have these exact fields:\n{\n  "id": "L0",\n  "type": "logic",\n  "grid": [["3","6","2"],["5","10","4"],["7","14","?"]],\n  "options": ["5","6","7","8"],\n  "answer": "6",\n  "exp": "Col2 = Col1 x 2. Col3 = Col1 - 1. Row 3: 7-1 = 6."\n}\n\nRules:\n- grid is always 3x3 strings\n- last cell is always "?"\n- options has exactly 4 strings, one matching answer\n- answer must be correct based on the pattern\n- exp explains the rule clearly\n- IDs are L0 through L9\n- All values are strings even if numbers\n- Make each question use a DIFFERENT rule\n\nReturn ONLY the JSON array, nothing else.'

  const numPrompt = 'Generate 10 unique numerical reasoning questions. Difficulty: ' + diffDesc + '\n\nReturn a JSON array of exactly 10 objects. Each object must have these exact fields:\n{\n  "id": "N0",\n  "type": "numerical",\n  "question": "A company invests $50,000 at 8% compound interest. Value after 3 years?",\n  "tableHtml": null,\n  "options": ["$62,000","$62,986","$63,122","$64,000"],\n  "answer": "$62,986",\n  "exp": "50000 x 1.08^3 = $62,986."\n}\n\nRules:\n- tableHtml is null unless you want a table (then valid HTML string)\n- options has exactly 4 strings, one matching answer\n- answer must be mathematically correct\n- Make each question test a DIFFERENT concept\n- IDs are N0 through N9\n\nReturn ONLY the JSON array, nothing else.'

  const [logicText, numText] = await Promise.all([
    callClaude(systemPrompt, logicPrompt, 2000),
    callClaude(systemPrompt, numPrompt, 2000)
  ])

  const parseArr = (text) => {
    const s = text.indexOf('['), e = text.lastIndexOf(']')
    if (s === -1 || e === -1) throw new Error('No JSON array in response')
    return JSON.parse(text.slice(s, e + 1))
  }

  const logic = parseArr(logicText)
  const num   = parseArr(numText)

  if (logic.length < 8) throw new Error('Not enough logic questions: ' + logic.length)
  if (num.length < 8)   throw new Error('Not enough numerical questions: ' + num.length)

  return [...logic.slice(0, 10), ...num.slice(0, 10)]
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
    console.error('Function error:', err.message)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    }
  }
}
