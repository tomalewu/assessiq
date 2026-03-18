export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function makeLogicQuestions(n) {
  const all = [
    { grid:[['▲','●','■'],['▲','●','■'],['▲','●','?']], options:['■','▲','◆','★'], answer:'■', exp:'Each column repeats the same symbol.' },
    { grid:[['▲','■','●'],['■','●','▲'],['●','▲','?']], options:['■','▲','◆','●'], answer:'■', exp:'Latin square.' },
    { grid:[['○','□','△'],['□','△','○'],['△','○','?']], options:['△','□','○','▲'], answer:'□', exp:'Cyclic shift.' },
    { grid:[['◆','◆','○'],['◆','○','◆'],['○','◆','?']], options:['○','◆','▲','■'], answer:'◆', exp:'Two ◆ per row.' },
    { grid:[['★','★','●'],['★','●','★'],['●','★','?']], options:['●','★','▲','■'], answer:'★', exp:'Two ★ per row.' },
    { grid:[['■','○','▲'],['○','▲','■'],['▲','■','?']], options:['▲','○','■','◆'], answer:'○', exp:'Cyclic rotation.' },
    { grid:[['◆','△','◆'],['△','◆','△'],['◆','△','?']], options:['△','◆','▲','●'], answer:'◆', exp:'Alternating chequerboard.' },
    { grid:[['●','■','●'],['■','●','■'],['●','■','?']], options:['●','■','▲','◆'], answer:'●', exp:'Alternating rows.' },
    { grid:[['▲','◆','○'],['◆','○','▲'],['○','▲','?']], options:['▲','○','◆','■'], answer:'◆', exp:'Left rotation.' },
    { grid:[['★','○','★'],['○','★','○'],['★','○','?']], options:['★','○','▲','■'], answer:'★', exp:'Strict alternation.' },
    { grid:[['△','△','○'],['△','○','△'],['○','△','?']], options:['○','△','▲','◆'], answer:'△', exp:'Two △ per row.' },
    { grid:[['■','▲','■'],['▲','■','▲'],['■','▲','?']], options:['▲','■','○','◆'], answer:'■', exp:'Alternating throughout.' },
  ]
  return shuffle(all).slice(0, n).map((q, i) => ({ id: 'L' + i, type: 'logic', ...q }))
}

export function makeNumQuestions(n) {
  const all = [
    { question:'A store sells 240 items in 8 days. How many at this rate in 15 days?', tableHtml:null, options:['400','420','450','480'], answer:'450', exp:'30/day x 15 = 450.' },
    { question:'If 35% of a number is 91, what is the number?', tableHtml:null, options:['240','260','280','300'], answer:'260', exp:'91 / 0.35 = 260.' },
    { question:'Revenue grew from $80,000 to $104,000. Percentage increase?', tableHtml:null, options:['25%','28%','30%','32%'], answer:'30%', exp:'24000/80000 x 100 = 30%.' },
    { question:'Next number in: 3, 6, 12, 24, 48?', tableHtml:null, options:['64','72','96','108'], answer:'96', exp:'48 x 2 = 96.' },
    { question:'What is the consistent price per unit?', tableHtml:'<table class="ntbl"><tr><th>Quarter</th><th>Units</th><th>Revenue</th></tr><tr><td>Q1</td><td>500</td><td>$25,000</td></tr><tr><td>Q2</td><td>650</td><td>$32,500</td></tr><tr><td>Q3</td><td>800</td><td>$40,000</td></tr></table>', options:['$40','$45','$50','$55'], answer:'$50', exp:'25000/500 = $50.' },
    { question:'A can finish a job in 12 days, B in 8 days. How long together?', tableHtml:null, options:['4.2 days','4.6 days','4.8 days','5.0 days'], answer:'4.8 days', exp:'1/12+1/8=5/24; 24/5=4.8.' },
    { question:'A train travels 360km in 4h. How long for 540km at same speed?', tableHtml:null, options:['5h','5.5h','6h','6.5h'], answer:'6h', exp:'90km/h; 540/90=6h.' },
    { question:'40% alcohol mixture. Add 10L water to 40L. New alcohol %?', tableHtml:null, options:['28%','30%','32%','34%'], answer:'32%', exp:'16L/50L = 32%.' },
    { question:'10th term of: 5, 11, 17, 23?', tableHtml:null, options:['53','57','59','61'], answer:'59', exp:'5 + 9x6 = 59.' },
    { question:'Laptop $1,200. After 15% discount, final price?', tableHtml:null, options:['$960','$1,000','$1,020','$1,050'], answer:'$1,020', exp:'1200 x 0.85 = $1,020.' },
    { question:'April sales based on 20% monthly growth?', tableHtml:'<table class="ntbl"><tr><th>Month</th><th>Sales</th></tr><tr><td>Jan</td><td>1,000</td></tr><tr><td>Feb</td><td>1,200</td></tr><tr><td>Mar</td><td>1,440</td></tr><tr><td>Apr</td><td>?</td></tr></table>', options:['$1,620','$1,680','$1,728','$1,800'], answer:'$1,728', exp:'1440 x 1.20 = 1728.' },
    { question:'3 machines: 270 widgets/hr. 7 machines in 5 hours?', tableHtml:null, options:['2,800','3,000','3,150','3,500'], answer:'3,150', exp:'90 x 7 x 5 = 3150.' },
  ]
  return shuffle(all).slice(0, n).map((q, i) => ({ id: 'N' + i, type: 'numerical', ...q }))
}

async function generateWithGemini(apiKey) {
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey
  const prompt = 'Generate 10 logical reasoning (3x3 grid with symbols triangle circle square diamond star, last cell ?) and 10 numerical reasoning questions. Return ONLY a JSON array. Logic: {"id":"L1","type":"logic","grid":[["▲","●","■"],["◆","★","○"],["□","△","?"]],"options":["▲","■","●","◆"],"answer":"▲","exp":"reason"} Numerical: {"id":"N1","type":"numerical","question":"text","tableHtml":null,"options":["a","b","c","d"],"answer":"a","exp":"reason"}'
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.8, maxOutputTokens: 5000 } })
  })
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

async function generateWithAnthropic(apiKey) {
  const prompt = 'Generate 10 logical reasoning (3x3 grid with symbols ▲ ● ■ ◆ ★ ○ □ △, last cell ?) and 10 numerical reasoning questions. Return ONLY a JSON array. Logic: {"id":"L1","type":"logic","grid":[["▲","●","■"],["◆","★","○"],["□","△","?"]],"options":["▲","■","●","◆"],"answer":"▲","exp":"reason"} Numerical: {"id":"N1","type":"numerical","question":"text","tableHtml":null,"options":["a","b","c","d"],"answer":"a","exp":"reason"}'
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 5000, messages: [{ role: 'user', content: prompt }] })
  })
  const data = await res.json()
  return data.content?.[0]?.text || ''
}

function parseQuestions(text) {
  const bt = String.fromCharCode(96)
  const cleaned = text.replace(new RegExp(bt+bt+bt+'json', 'g'), '').replace(new RegExp(bt+bt+bt, 'g'), '').trim()
  const parsed = JSON.parse(cleaned)
  if (!Array.isArray(parsed) || parsed.length < 18) throw new Error('not enough questions')
  const logic = shuffle(parsed.filter(q => q.type === 'logic')).slice(0, 10)
  const num   = shuffle(parsed.filter(q => q.type === 'numerical')).slice(0, 10)
  return shuffle([...logic, ...num])
}

export async function loadQuestions(settings) {
  const s = settings || {}
  if (s.geminiKey) {
    try { return parseQuestions(await generateWithGemini(s.geminiKey)) } catch(e) { console.warn('Gemini failed:', e.message) }
  }
  if (s.anthropicKey) {
    try { return parseQuestions(await generateWithAnthropic(s.anthropicKey)) } catch(e) { console.warn('Anthropic failed:', e.message) }
  }
  return shuffle([...makeLogicQuestions(10), ...makeNumQuestions(10)])
}
