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
  const { name, answers, dimScores, fitLabel, leadershipStyle, leadershipPct, questions, role, opqProfile } = candidateData

  // Build SJT answer summary
  const answerSummary = (questions || []).map(q => {
    const selected = answers[q.id]
    if (selected === undefined || selected === null) return null
    const chosenOption = q.options[selected]
    if (!chosenOption) return null
    return { dimension: q.dimension, scenario: (q.scenario || '').slice(0, 100), chosen: chosenOption.text, score: chosenOption.score }
  }).filter(Boolean)

  // Build dimension breakdown
  const dimBreakdown = Object.entries(dimScores || {}).map(([dim, ds]) => {
    const pct = ds.max > 0 ? Math.round(ds.score / ds.max * 100) : 0
    return dim + ': ' + pct + '%'
  }).join(', ')

  // Build OPQ summary
  const opqSummary = opqProfile ? Object.entries(opqProfile).map(([dim, data]) => dim + ': ' + data.label + ' (' + data.pct + '%)').join(', ') : 'Not available'

  // Group SJT answers by dimension
  const byDim = {}
  answerSummary.forEach(a => {
    if (!byDim[a.dimension]) byDim[a.dimension] = []
    byDim[a.dimension].push({ chosen: a.chosen, score: a.score })
  })

  const systemPrompt = `You are an expert occupational psychologist writing professional leadership assessment reports. You generate two outputs from the same assessment data:
1. A candidate-facing qualitative profile — warm, developmental, no scores or labels
2. A recruiter-facing analytical report — evidence-based, honest, includes recommendation

Always write in a professional but human tone. Reference the candidate by name.`

  const userPrompt = `Generate a dual leadership assessment report for ${name} applying for ${role || 'a leadership role'}.

ASSESSMENT DATA:
- SJT Overall: ${fitLabel} | ${leadershipStyle} style | ${leadershipPct}%
- SJT Dimensions: ${dimBreakdown}
- OPQ Personality: ${opqSummary}
- SJT Response patterns: ${JSON.stringify(byDim)}

Generate a JSON object with TWO sections:

{
  "candidateReport": {
    "headline": "2-4 word leadership style label (e.g. 'Empowering Collaborative Leader') — no fit labels, no scores",
    "opening": "2-3 sentence personalised opening that describes their natural leadership orientation based on BOTH SJT and OPQ data. Warm and specific. Use their name.",
    "strengths": "2-3 sentence paragraph describing what they do well as a leader. Reference specific patterns from their responses. Positive but evidence-based.",
    "growthAreas": "2-3 sentence paragraph describing 1-2 areas for leadership development. Framed as opportunity, not failure. Never mention scores.",
    "personalityInsight": "2 sentences connecting their OPQ personality profile to their leadership style. E.g. high empathy + strong conflict scores = natural mediator.",
    "closing": "1-2 sentences of genuine encouragement and forward-looking development framing. Professional and warm."
  },

  "recruiterReport": {
    "executiveSummary": "3-4 sentences specific to this candidate. Include honest assessment of fit. Reference both SJT and OPQ data.",
    "fitVerdict": "${fitLabel}",
    "leadershipProfile": "2-3 paragraph deep analysis of this candidate's leadership capability. Specific, evidence-based, references actual response patterns.",
    "dimensionInsights": {
      "conflict": "2-3 sentences on their conflict resolution approach based on their actual SJT choices",
      "delegation": "2-3 sentences on their delegation approach",
      "motivation": "2-3 sentences on their motivation approach",
      "decision": "2-3 sentences on their decision making approach",
      "communication": "2-3 sentences on their communication approach"
    },
    "personalityAnalysis": "2-3 sentences on what their OPQ profile reveals about their personality and how it interacts with their SJT performance",
    "keyStrengths": ["Specific strength 1 with evidence", "Specific strength 2", "Specific strength 3"],
    "developmentAreas": ["Specific development area 1 with evidence", "Specific development area 2"],
    "leadershipRisks": "1-2 sentences on specific derailer risks based on their pattern",
    "recruiterRecommendation": "3 sentences: overall recommendation, what to probe in interview, any conditions",
    "interviewQuestions": [
      "Behavioural question targeting their weakest SJT dimension",
      "Question probing a pattern in their OPQ profile",
      "Situational question testing whether responses match real behaviour",
      "Question probing their specific leadership risk area"
    ]
  }
}

Be specific. Reference actual response patterns. The candidate report must never mention scores, percentages, or fit labels.
Return ONLY the JSON object.`

  // Split into two parallel calls to stay within token limits
  const candidatePrompt = `Generate a candidate-facing qualitative leadership profile for ${name} (${role || 'leadership role'}).

Based on: SJT ${fitLabel} | ${leadershipStyle} style | OPQ: ${opqSummary}
SJT patterns: ${JSON.stringify(byDim)}

Return JSON: {"headline":"2-4 word style label","opening":"2-3 personalised sentences using their name","strengths":"2-3 sentences on what they do well","growthAreas":"2-3 sentences on development areas framed positively","personalityInsight":"2 sentences connecting OPQ to SJT","closing":"1-2 sentences of encouragement"}
No scores, no fit labels. Return ONLY the JSON object.`

  const recruiterPrompt = `Generate a recruiter assessment report for ${name} applying for ${role || 'a leadership role'}.
SJT: ${fitLabel} | ${leadershipStyle} | ${leadershipPct}% | Dimensions: ${dimBreakdown}
OPQ: ${opqSummary}
SJT patterns: ${JSON.stringify(byDim)}

Return JSON: {"executiveSummary":"3-4 honest sentences","fitVerdict":"${fitLabel}","leadershipProfile":"2 paragraph analysis","dimensionInsights":{"conflict":"2 sentences","delegation":"2 sentences","motivation":"2 sentences","decision":"2 sentences","communication":"2 sentences"},"personalityAnalysis":"2 sentences on OPQ","keyStrengths":["strength1","strength2","strength3"],"developmentAreas":["area1","area2"],"leadershipRisks":"1-2 sentences","recruiterRecommendation":"3 sentences","interviewQuestions":["q1","q2","q3","q4"]}
Return ONLY the JSON object.`

  const [candidateText, recruiterText] = await Promise.all([
    callClaude(systemPrompt, candidatePrompt, 1500),
    callClaude(systemPrompt, recruiterPrompt, 2500)
  ])

  const parseObj = (text) => {
    const s = text.indexOf('{'), e = text.lastIndexOf('}')
    if (s === -1 || e === -1) throw new Error('No JSON object in response')
    return JSON.parse(text.slice(s, e + 1))
  }

  return {
    candidateReport: parseObj(candidateText),
    recruiterReport: parseObj(recruiterText)
  }
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
    console.error('Function error:', err.message)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    }
  }
}
