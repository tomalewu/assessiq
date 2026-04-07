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
  const jsonSchema = '{"name":"Full name","email":"email@example.com","phone":"phone number","dob":"YYYY-MM-DD or null","currentRole":"Job title or null","currentCompany":"Company or null","totalExperience":5,"education":[{"degree":"BSc","institution":"University","year":"2018"}],"experience":[{"title":"Manager","company":"Company","duration":"2020-2023","summary":"One sentence."}],"skills":["Excel"],"languages":["English"]}'
  const userPrompt = 'Parse this CV and return a JSON object matching this schema. Use null for missing strings, 0 for missing numbers, [] for missing arrays. Return ONLY the JSON.\n\nSchema: ' + jsonSchema

  const isPDF = !mimeType || mimeType === 'application/pdf' || mimeType.includes('pdf')

  let messages
  if (isPDF) {
    // PDF: send as document — Claude reads it natively
    messages = [{
      role: 'user',
      content: [
        { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: cvBase64 } },
        { type: 'text', text: userPrompt }
      ]
    }]
  } else {
    // Word/DOCX: extract readable ASCII text from binary and send as text prompt
    const rawText = Buffer.from(cvBase64, 'base64').toString('utf8')
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\xFF]/g, ' ')
      .replace(/\s+/g, ' ')
      .slice(0, 4000)
    messages = [{
      role: 'user',
      content: 'Parse this CV text and return JSON matching this schema: ' + jsonSchema + '\n\nCV text:\n' + rawText + '\n\nReturn ONLY the JSON object.'
    }]
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 1500, system: systemPrompt, messages })
  })

  if (!res.ok) {
    const errBody = await res.text()
    console.error('CV parse error:', res.status, errBody.slice(0, 200))
    throw new Error('Claude API ' + res.status)
  }

  const data = await res.json()
  const text = data.content?.[0]?.text || ''
  const s = text.indexOf('{'), e = text.lastIndexOf('}')
  if (s === -1 || e === -1) throw new Error('No JSON in CV parse response')
  return JSON.parse(text.slice(s, e + 1))
}


// ── AI Leadership SJT Question Generation ────────────────────────────
async function generateLeadershipSJT(roleTitle, department) {
  const systemPrompt = 'You are a leadership assessment designer. Return ONLY valid JSON arrays, no explanation, no markdown.'

  const dims = [
    { id: 'conflict',      label: 'Conflict Resolution' },
    { id: 'delegation',    label: 'Delegation & Empowerment' },
    { id: 'motivation',    label: 'Team Motivation' },
    { id: 'decision',      label: 'Decision Making' },
    { id: 'communication', label: 'Communication' },
  ]

  // Generate 2 questions per dimension in parallel (5 calls x 2 questions = 10 total)
  const results = await Promise.all(dims.map(dim => {
    const prompt = `Generate 2 leadership SJT questions for a ${roleTitle} in ${department || 'Corporate'} department, testing ${dim.label}.

Return JSON array of exactly 2 objects:
[{"id":"${dim.id.toUpperCase()}1","dimension":"${dim.id}","scenario":"As the ${roleTitle}, you face a specific ${dim.label.toLowerCase()} situation with real context...","options":[{"text":"Plausible option A","score":1},{"text":"Best option B","score":3},{"text":"Reasonable option C","score":2},{"text":"Defensive option D","score":0}]}]

Rules: All 4 options must be professionally defensible. Only one scores 3. Include specific numbers/timelines in scenario.
Return ONLY the JSON array.`

    return callClaude(systemPrompt, prompt, 1200)
      .then(text => {
        try { return parseArr(text) } catch(e) { console.warn(dim.id, 'parse failed:', e.message); return [] }
      })
      .catch(e => { console.warn(dim.id, 'call failed:', e.message); return [] })
  }))

  const questions = results.flat().filter(q => q && q.dimension && q.options && q.scenario)
  console.log('SJT generated:', questions.length, 'questions across', dims.length, 'dimensions')
  if (questions.length < 5) throw new Error('Not enough SJT questions: ' + questions.length)
  return questions
}

// ── Leadership AI Analysis ───────────────────────────────────────────
async function analyseLeadership(candidateData) {
  const { name, answers, dimScores, fitLabel, leadershipStyle, leadershipPct, questions, role } = candidateData

  // Build answer summary for Claude — what the candidate actually chose
  const answerSummary = questions.map(q => {
    const selected = answers[q.id]
    if (selected === undefined || selected === null) return null
    const chosenOption = q.options[selected]
    return {
      dimension: q.dimension,
      scenario: q.scenario,
      chosen: chosenOption.text,
      score: chosenOption.score,
      maxScore: 3
    }
  }).filter(Boolean)

  // Build dimension breakdown
  const dimBreakdown = Object.entries(dimScores).map(([dim, ds]) => {
    const pct = ds.max > 0 ? Math.round(ds.score / ds.max * 100) : 0
    return dim + ': ' + ds.score + '/' + ds.max + ' (' + pct + '%)'
  }).join(', ')

  // Group answers by dimension for pattern analysis
  const byDim = {}
  answerSummary.forEach(a => {
    if (!byDim[a.dimension]) byDim[a.dimension] = []
    byDim[a.dimension].push({ scenario: a.scenario.slice(0, 120) + '...', chosen: a.chosen, score: a.score })
  })

  const systemPrompt = `You are an expert leadership psychologist and organisational consultant writing professional candidate assessment reports. Your analysis must be:
- Specific to this candidate's actual responses, not generic
- Evidence-based — reference what they actually chose in specific scenarios
- Balanced — acknowledge both strengths and development areas honestly
- Professional but human — not robotic or formulaic
- Actionable — give recruiters something useful
Write in third person about the candidate. Use ${name} by name.`

  // Include OPQ profile if available
  const opqSection = candidateData.opqProfile
    ? `\n\nPERSONALITY PROFILE (OPQ-style):\n` + Object.entries(candidateData.opqProfile).map(([dim, data]) => dim + ': ' + data.label + ' (' + data.pct + '%)').join(', ')
    : ''

  const userPrompt = `Analyse this leadership assessment for ${name} applying for ${role || 'a leadership role'}.

OVERALL RESULT: ${fitLabel} | ${leadershipStyle} style | ${leadershipPct}% overall
DIMENSION SCORES: ${dimBreakdown}${opqSection}

ACTUAL RESPONSES BY DIMENSION:
${JSON.stringify(byDim, null, 2)}

Write a comprehensive professional leadership assessment report in JSON format:
{
  "executiveSummary": "3-4 sentence executive summary of this specific candidate's leadership profile. Reference their actual response patterns. Mention their name.",
  
  "leadershipProfile": "2-3 paragraph detailed leadership profile. Describe their natural leadership orientation based on what they actually chose. Be specific about HOW they approach leadership situations — not just that they scored X%.",
  
  "dimensionInsights": {
    "conflict": "2-3 sentences specific to their conflict resolution responses. What patterns did you notice? What does this reveal?",
    "delegation": "2-3 sentences specific to their delegation responses.",
    "motivation": "2-3 sentences specific to their motivation responses.",
    "decision": "2-3 sentences specific to their decision making responses.",
    "communication": "2-3 sentences specific to their communication responses."
  },
  
  "keyStrengths": ["Specific strength 1 based on their responses", "Specific strength 2", "Specific strength 3"],
  
  "developmentAreas": ["Specific development area 1 with evidence from responses", "Specific development area 2"],
  
  "leadershipRisks": "1-2 sentences on the specific leadership derailer risks this candidate shows based on their response pattern. Be honest.",
  
  "recruiterRecommendation": "2-3 sentence recommendation to the hiring manager. Should they proceed? Under what conditions? What to probe in interview?",
  
  "interviewQuestions": [
    "Behavioural question targeting their weakest dimension with specific context",
    "Behavioural question probing a pattern you noticed in their responses",
    "Situational question that tests whether their assessment responses match real behaviour",
    "Question probing their leadership risk area"
  ]
}

Return ONLY the JSON object. Be specific, evidence-based, and genuinely useful to a recruiter making a hiring decision.`

  const text = await callClaude(systemPrompt, userPrompt, 3000)
  const s = text.indexOf('{'), e = text.lastIndexOf('}')
  if (s === -1 || e === -1) throw new Error('No JSON in analysis response')
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

    if (action === 'generate_leadership_sjt') {
      const { roleTitle, department } = body
      if (!roleTitle) return { statusCode: 400, headers, body: JSON.stringify({ error: 'roleTitle required' }) }
      const questions = await generateLeadershipSJT(roleTitle, department)
      return { statusCode: 200, headers, body: JSON.stringify({ questions }) }
    }

    if (action === 'analyse_leadership') {
      const { candidateData } = body
      if (!candidateData) return { statusCode: 400, headers, body: JSON.stringify({ error: 'candidateData required' }) }
      const analysis = await analyseLeadership(candidateData)
      return { statusCode: 200, headers, body: JSON.stringify({ analysis }) }
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
