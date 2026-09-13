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

  // Build answer summary
  const byDim = {}
  ;(questions || []).forEach(q => {
    const selected = answers[q.id]
    if (selected === undefined || selected === null) return
    const opt = q.options && q.options[selected]
    if (!opt) return
    if (!byDim[q.dimension]) byDim[q.dimension] = []
    byDim[q.dimension].push({ chosen: opt.text.slice(0, 80), score: opt.score })
  })

  const dimBreakdown = Object.entries(dimScores || {}).map(([dim, ds]) => {
    const pct = ds.max > 0 ? Math.round(ds.score / ds.max * 100) : 0
    return dim + ':' + pct + '%'
  }).join(', ')

  const opqSummary = opqProfile
    ? Object.entries(opqProfile).map(([dim, d]) => dim + ':' + d.label).join(', ')
    : 'not available'

  const byDimStr = Object.entries(byDim).map(([dim, items]) =>
    dim + ':[' + items.map(i => 'score' + i.score).join(',') + ']'
  ).join(' ')

  const systemPrompt = 'You are an expert occupational psychologist. Return ONLY valid JSON objects, no explanation, no markdown.'

  // Call 1: Candidate-facing qualitative profile
  const candidatePrompt = 'Write a candidate leadership profile for ' + name + ' applying for ' + (role || 'leadership role') + '. SJT result: ' + fitLabel + ', ' + leadershipStyle + ' style, ' + leadershipPct + '%. OPQ: ' + opqSummary + '. SJT patterns: ' + byDimStr + '. Return JSON: {"headline":"2-4 word style label no scores","opening":"2-3 personalised sentences using their name and specific observations","strengths":"2-3 sentences on what they do well based on evidence","growthAreas":"2-3 sentences on development framed positively no scores","personalityInsight":"2 sentences connecting OPQ to SJT","closing":"1-2 sentences encouragement"} Return ONLY the JSON object.'

  // Call 2: Recruiter analytical report
  const recruiterPrompt = 'Write a recruiter leadership assessment for ' + name + ' applying for ' + (role || 'leadership role') + '. SJT: ' + fitLabel + ',' + leadershipStyle + ',' + leadershipPct + '%. Dimensions: ' + dimBreakdown + '. OPQ: ' + opqSummary + '. SJT patterns: ' + byDimStr + '. Return JSON: {"executiveSummary":"3-4 honest sentences","fitVerdict":"' + fitLabel + '","leadershipProfile":"2 paragraph analysis","dimensionInsights":{"conflict":"2 sentences","delegation":"2 sentences","motivation":"2 sentences","decision":"2 sentences","communication":"2 sentences"},"personalityAnalysis":"2 sentences","keyStrengths":["s1","s2","s3"],"developmentAreas":["a1","a2"],"leadershipRisks":"1-2 sentences","recruiterRecommendation":"3 sentences","interviewQuestions":["q1","q2","q3","q4"]} Return ONLY the JSON object.'

  const [candidateText, recruiterText] = await Promise.all([
    callClaude(systemPrompt, candidatePrompt, 1500),
    callClaude(systemPrompt, recruiterPrompt, 2500)
  ])

  const parseObj = (text) => {
    const s = text.indexOf('{'), e = text.lastIndexOf('}')
    if (s === -1 || e === -1) throw new Error('No JSON object in: ' + text.slice(0, 100))
    return JSON.parse(text.slice(s, e + 1))
  }

  const candidateReport = parseObj(candidateText)
  const recruiterReport = parseObj(recruiterText)
  console.log('AI analysis complete for', name)
  return { candidateReport, recruiterReport }
}

// ── Handler ───────────────────────────────────────────────────────────
// ── In-Tray Scoring ───────────────────────────────────────────────────
async function scoreInTray(fileBase64, mimeType, candidateIndex, totalCandidates) {
  const SCORING_PROMPT = `You are an expert assessment evaluator for ACI Group's ACI Next Wave Future Leadership Program. You are scoring a candidate's In-Tray Case Analysis answer booklet.

THE EXERCISE CONTEXT:
Candidates were told they are a new MTO at ACI Group's Corporate Supply Chain division. Their manager Mr. Kamrul Hassan was away for 2 hours. They had 9 documents to work through and 60 minutes to complete 6 questions.

THE 9 DOCUMENTS CANDIDATES SAW:
- Doc 1: Manager note - handle what you can, priorities marked with *
- Doc 2 (URGENT*): Supplier delay - Apex Packaging delayed 14 days, only 6 days stock left of SKU-112, two unqualified backup suppliers available, decision needed by 10am
- Doc 3 (URGENT*): Client complaint - Galaxy Retail reporting mislabelled products across 3 of 4 deliveries, threatening 30% order cut, Tk 2.8 crore account
- Doc 4: Finance circular - Q2 cost variance reports due 5pm today
- Doc 5: Colleague email - wants 30-min meeting on demand forecasting, suggests 3pm
- Doc 6 (URGENT*): HSE memo - 12 pallets blocking fire exit Warehouse Bay 3, Category A violation, must clear within 4 hours, inspector returns 2pm
- Doc 7: HR circular - nominate team member for Lean Six Sigma training, deadline Friday
- Doc 8: Manager handwritten note - prepare one-paragraph supplier performance summary for 3pm meeting
- Doc 9: Apex Packaging scorecard - On-Time: Q4:94% Q1:88% Q2:71% / Quality: Q4:99% Q1:97% Q2:93% / Response Time: Q4:2d Q1:3d Q2:6d / Cost Variance: Q4:+1% Q1:+3% Q2:+7% / Rating: Q4:Excellent Q1:Good Q2:Below Standard

MARKING CRITERIA:

Q1 - Prioritisation (15 marks):
Strong answer: Doc 6 HSE and Doc 2 supplier delay ranked 1 and 2. Doc 3 client complaint ranked 3. Doc 8/9 supplier summary ranked 4. Doc 4 finance report ranked 5. Docs 5 and 7 ranked lowest.
15-13: Correct order with clear specific reasoning for each item
12-9: Mostly correct, minor errors, reasonable justification
8-5: Gets 1-2 urgent items right but misses others
4-1: Incorrect prioritisation with poor reasoning
0: Not attempted or completely illogical

Q2 - Supplier Delay Response (25 marks):
Must contain all three: (a) recommends using backup supplier under emergency protocol - does not simply approve outright or refuse, (b) explicitly flags qualification risk with a condition or next step, (c) states what to prepare/escalate for manager's return.
25-22: All three elements, professional tone, clear and actionable
21-16: Two of three elements clearly present
15-9: Only one element clearly present or very vague
8-3: Misses core challenge or is inappropriate
2-0: Not attempted

Q3 - Client Complaint Response (20 marks):
Must have: empathetic opening, no admission of liability, specific realistic next step commitment, protects relationship without unkeepable promises.
20-18: All elements, professional tone, specific commitment
17-13: Most elements, tone appropriate, commitment slightly vague
12-8: Acknowledges issue but lacks specific next step
7-3: Generic or poorly structured
2-0: Not attempted or damaging

Q4 - Safety Issue Action Plan (15 marks):
Must show: contacts warehouse supervisor immediately, confirms action in writing, notifies HSE before 2pm, escalates to manager, treats as legal/safety matter with hard deadline.
15-13: All actions, appropriate urgency, clear ownership
12-9: Most actions, urgency understood, one step missing
8-5: Understands seriousness but plan is incomplete
4-1: Takes some action but misses urgency or 2pm deadline
0: Not attempted or dismisses issue

Q5 - Supplier Performance Summary (15 marks):
Must: note deteriorating trend across ALL four metrics, specifically flag Q2 as significantly below standard, recommend discussing supplier status without making the decision.
15-13: All metrics, trend identified clearly, appropriate recommendation
12-9: Most metrics, trend partially identified, reasonable conclusion
8-5: Some metrics, no clear trend analysis
4-1: Superficial summary
0: Not attempted

Q6 - Reflection (10 marks):
Must: identify 2-3 correct items NOT handled (finance report, training nomination, colleague meeting - these are low urgency or outside MTO authority) with sound reasoning showing understanding of scope and authority.
10-9: Correct items, reasoning shows clear understanding of scope
8-6: Most correct items with reasonable reasoning
5-3: Some correct items but reasoning weak
2-1: Misunderstands the concept
0: Not attempted

COMPETENCY CONVERSION:
After scoring Q1-Q6, convert to 1-5 competency scores:
- Drive & Initiative = Q1 + Q4 + Q6 (max 40 marks)
- Thinking Quality = Q2 + Q5 (max 40 marks)
- Communication = Q3 (max 20 marks)

Conversion scale (% of competency max):
85-100% = 5 (Exceptional)
70-84% = 4 (Strong)
50-69% = 3 (Developing)
30-49% = 2 (Emerging)
0-29% = 1 (Insufficient)

IMPORTANT: Respond ONLY with valid JSON. No text before or after. No markdown. Use this exact structure:
{
  "candidateName": "string",
  "candidateId": "string",
  "legibility": "Clear|Mostly clear|Some sections unclear",
  "legibilityNotes": "string or empty",
  "questions": {
    "q1": { "score": 0, "max": 15, "observation": "string" },
    "q2": { "score": 0, "max": 25, "observation": "string" },
    "q3": { "score": 0, "max": 20, "observation": "string" },
    "q4": { "score": 0, "max": 15, "observation": "string" },
    "q5": { "score": 0, "max": 15, "observation": "string" },
    "q6": { "score": 0, "max": 10, "observation": "string" }
  },
  "rawTotal": 0,
  "competencies": {
    "driveInitiative": { "raw": 0, "max": 40, "pct": 0, "score": 0, "level": "string" },
    "thinkingQuality": { "raw": 0, "max": 40, "pct": 0, "score": 0, "level": "string" },
    "communication": { "raw": 0, "max": 20, "pct": 0, "score": 0, "level": "string" }
  },
  "overallAssessment": "string (4-5 sentences)",
  "integrityFlag": false,
  "integrityNote": "string or empty"
}`

  // Build content array based on file type
  const isPDF = mimeType === 'application/pdf'
  const content = [
    {
      type: isPDF ? 'document' : 'image',
      source: {
        type: 'base64',
        media_type: mimeType,
        data: fileBase64
      }
    },
    {
      type: 'text',
      text: 'Please score this candidate answer booklet (' + candidateIndex + ' of ' + totalCandidates + ') according to the marking criteria. Return ONLY valid JSON.'
    }
  ]

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'pdfs-2024-09-25',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      system: SCORING_PROMPT,
      messages: [{ role: 'user', content }]
    })
  })

  if (!resp.ok) throw new Error('Anthropic API error: ' + resp.status)
  const data = await resp.json()
  const raw = data.content[0].text.replace(/```json|```/gi, '').trim()
  return JSON.parse(raw)
}

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

    if (action === 'score_intray') {
      const { fileBase64, mimeType, candidateIndex, totalCandidates } = body
      if (!fileBase64) return { statusCode: 400, headers, body: JSON.stringify({ error: 'fileBase64 required' }) }
      if (!mimeType) return { statusCode: 400, headers, body: JSON.stringify({ error: 'mimeType required' }) }
      const result = await scoreInTray(fileBase64, mimeType, candidateIndex || 1, totalCandidates || 1)
      return { statusCode: 200, headers, body: JSON.stringify({ result }) }
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Unknown action.' }) }

  } catch (err) {
    console.error('Function error:', err.message)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    }
  }
}
