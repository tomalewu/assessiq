export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ── Logic questions by difficulty ─────────────────────────────────────
const LOGIC_EASY = [
  { grid:[['▲','●','■'],['▲','●','■'],['▲','●','?']], options:['■','▲','◆','★'], answer:'■', exp:'Each column repeats the same symbol.' },
  { grid:[['◆','◆','○'],['◆','○','◆'],['○','◆','?']], options:['○','◆','▲','■'], answer:'◆', exp:'Each row has two ◆ and one ○.' },
  { grid:[['★','★','●'],['★','●','★'],['●','★','?']], options:['●','★','▲','■'], answer:'★', exp:'Each row has two ★ and one ●.' },
  { grid:[['●','■','●'],['■','●','■'],['●','■','?']], options:['●','■','▲','◆'], answer:'●', exp:'Symbols alternate row by row.' },
  { grid:[['★','○','★'],['○','★','○'],['★','○','?']], options:['★','○','▲','■'], answer:'★', exp:'★ and ○ strictly alternate.' },
  { grid:[['△','△','○'],['△','○','△'],['○','△','?']], options:['○','△','▲','◆'], answer:'△', exp:'Each row has two △ and one ○.' },
]

const LOGIC_MEDIUM = [
  { grid:[['▲','■','●'],['■','●','▲'],['●','▲','?']], options:['■','▲','◆','●'], answer:'■', exp:'Latin square — each symbol once per row and column.' },
  { grid:[['○','□','△'],['□','△','○'],['△','○','?']], options:['△','□','○','▲'], answer:'□', exp:'Each row is a cyclic shift of the previous.' },
  { grid:[['■','○','▲'],['○','▲','■'],['▲','■','?']], options:['▲','○','■','◆'], answer:'○', exp:'Each row is a cyclic rotation.' },
  { grid:[['◆','△','◆'],['△','◆','△'],['◆','△','?']], options:['△','◆','▲','●'], answer:'◆', exp:'Alternating chequerboard of ◆ and △.' },
  { grid:[['▲','◆','○'],['◆','○','▲'],['○','▲','?']], options:['▲','○','◆','■'], answer:'◆', exp:'Each row rotates left by one.' },
  { grid:[['■','▲','■'],['▲','■','▲'],['■','▲','?']], options:['▲','■','○','◆'], answer:'■', exp:'■ and ▲ alternate throughout.' },
]

const LOGIC_HARD = [
  { grid:[['▲','●','◆'],['●','◆','▲'],['◆','▲','?']], options:['◆','●','▲','■'], answer:'●', exp:'3-symbol rotation: each row shifts left by one position.' },
  { grid:[['○','■','△'],['■','△','○'],['△','○','?']], options:['△','■','○','▲'], answer:'■', exp:'Cyclic permutation across all 3 rows.' },
  { grid:[['★','□','◆'],['□','◆','★'],['◆','★','?']], options:['★','□','◆','△'], answer:'□', exp:'Each symbol appears exactly once per row and column.' },
  { grid:[['▲','○','■'],['■','▲','○'],['○','■','?']], options:['○','▲','■','◆'], answer:'▲', exp:'Latin square with 3 symbols — diagonal pattern.' },
  { grid:[['◆','▲','○'],['○','◆','▲'],['▲','○','?']], options:['▲','◆','○','■'], answer:'◆', exp:'Anti-diagonal Latin square rotation.' },
  { grid:[['□','★','△'],['★','△','□'],['△','□','?']], options:['□','★','△','●'], answer:'★', exp:'3-cycle permutation — each row is a left rotation.' },
]

// ── Numerical questions by difficulty ─────────────────────────────────
const NUM_EASY = [
  { question:'A store sells 240 items in 8 days. How many at this rate in 15 days?', tableHtml:null, options:['400','420','450','480'], answer:'450', exp:'30/day x 15 = 450.' },
  { question:'Next number in: 3, 6, 12, 24, 48?', tableHtml:null, options:['64','72','96','108'], answer:'96', exp:'Each term doubles: 48 x 2 = 96.' },
  { question:'A laptop costs $1,200. After 15% discount, final price?', tableHtml:null, options:['$960','$1,000','$1,020','$1,050'], answer:'$1,020', exp:'1,200 x 0.85 = $1,020.' },
  { question:'What is the 10th term of: 5, 11, 17, 23?', tableHtml:null, options:['53','57','59','61'], answer:'59', exp:'a=5, d=6; T10=5+9x6=59.' },
  { question:'If 35% of a number is 91, what is the number?', tableHtml:null, options:['240','260','280','300'], answer:'260', exp:'91/0.35 = 260.' },
  { question:'A train travels 360km in 4 hours. How long for 540km at the same speed?', tableHtml:null, options:['5h','5.5h','6h','6.5h'], answer:'6h', exp:'Speed=90km/h; 540/90=6h.' },
]

const NUM_MEDIUM = [
  { question:'Revenue grew from $80,000 to $104,000. Percentage increase?', tableHtml:null, options:['25%','28%','30%','32%'], answer:'30%', exp:'24000/80000 x 100 = 30%.' },
  { question:'What is the consistent price per unit?', tableHtml:'<table class="ntbl"><tr><th>Quarter</th><th>Units</th><th>Revenue</th></tr><tr><td>Q1</td><td>500</td><td>$25,000</td></tr><tr><td>Q2</td><td>650</td><td>$32,500</td></tr><tr><td>Q3</td><td>800</td><td>$40,000</td></tr></table>', options:['$40','$45','$50','$55'], answer:'$50', exp:'25,000/500 = $50.' },
  { question:'A can finish a job in 12 days, B in 8 days. How long together?', tableHtml:null, options:['4.2 days','4.6 days','4.8 days','5.0 days'], answer:'4.8 days', exp:'1/12+1/8=5/24; 24/5=4.8.' },
  { question:'40% alcohol mixture. Add 10L water to 40L. New alcohol %?', tableHtml:null, options:['28%','30%','32%','34%'], answer:'32%', exp:'16L/50L = 32%.' },
  { question:'April sales based on 20% monthly growth?', tableHtml:'<table class="ntbl"><tr><th>Month</th><th>Sales</th></tr><tr><td>Jan</td><td>1,000</td></tr><tr><td>Feb</td><td>1,200</td></tr><tr><td>Mar</td><td>1,440</td></tr><tr><td>Apr</td><td>?</td></tr></table>', options:['$1,620','$1,680','$1,728','$1,800'], answer:'$1,728', exp:'1,440 x 1.20 = 1,728.' },
  { question:'3 machines: 270 widgets/hr. 7 machines in 5 hours?', tableHtml:null, options:['2,800','3,000','3,150','3,500'], answer:'3,150', exp:'90 x 7 x 5 = 3,150.' },
]

const NUM_HARD = [
  { question:'A company invests $50,000 at 8% compound interest. Value after 3 years?', tableHtml:null, options:['$62,000','$62,986','$63,122','$64,000'], answer:'$62,986', exp:'50000 x 1.08^3 = $62,986.' },
  { question:'Two pipes fill a tank in 6h and 9h. Third pipe drains in 12h. Time to fill together?', tableHtml:null, options:['6h','7h','7.2h','8h'], answer:'7.2h', exp:'1/6+1/9-1/12=5/36; 36/5=7.2h.' },
  { question:'What is the profit margin in Q3?', tableHtml:'<table class="ntbl"><tr><th>Quarter</th><th>Revenue</th><th>Cost</th></tr><tr><td>Q1</td><td>$120,000</td><td>$84,000</td></tr><tr><td>Q2</td><td>$145,000</td><td>$101,500</td></tr><tr><td>Q3</td><td>$168,000</td><td>$113,400</td></tr></table>', options:['30%','32.5%','33%','32%'], answer:'32.5%', exp:'(168000-113400)/168000 = 32.5%.' },
  { question:'A population grows at 5% annually. Starting at 2 million, when does it exceed 2.5 million?', tableHtml:null, options:['4 years','5 years','6 years','7 years'], answer:'5 years', exp:'2M x 1.05^5 = 2.55M > 2.5M.' },
  { question:'Stock price changes: +12%, -8%, +15%, -5%. Net % change from start?', tableHtml:null, options:['12.4%','13.1%','13.5%','14%'], answer:'13.1%', exp:'1.12 x 0.92 x 1.15 x 0.95 = 1.131.' },
  { question:'What is the missing monthly growth rate?', tableHtml:'<table class="ntbl"><tr><th>Month</th><th>Users</th><th>Growth</th></tr><tr><td>Jan</td><td>10,000</td><td>—</td></tr><tr><td>Feb</td><td>11,500</td><td>15%</td></tr><tr><td>Mar</td><td>13,225</td><td>15%</td></tr><tr><td>Apr</td><td>?</td><td>12%</td></tr></table>', options:['14,500','14,812','14,952','15,000'], answer:'14,812', exp:'13,225 x 1.12 = 14,812.' },
]

export function makeLogicQuestions(n, difficulty) {
  const pool = difficulty === 'easy' ? LOGIC_EASY : difficulty === 'hard' ? LOGIC_HARD : LOGIC_MEDIUM
  const all  = difficulty === 'medium' ? [...LOGIC_EASY, ...LOGIC_MEDIUM] : pool
  return shuffle(all).slice(0, n).map((q, i) => ({ id: 'L' + i, type: 'logic', ...q }))
}

export function makeNumQuestions(n, difficulty) {
  const pool = difficulty === 'easy' ? NUM_EASY : difficulty === 'hard' ? NUM_HARD : NUM_MEDIUM
  const all  = difficulty === 'medium' ? [...NUM_EASY, ...NUM_MEDIUM] : pool
  return shuffle(all).slice(0, n).map((q, i) => ({ id: 'N' + i, type: 'numerical', ...q }))
}

async function generateWithGemini(apiKey, difficulty) {
  const diffNote = difficulty === 'easy' ? 'Make questions simple and straightforward.' : difficulty === 'hard' ? 'Make questions complex, multi-step, requiring deeper reasoning.' : 'Make questions moderate difficulty.'
  const prompt = 'Generate 10 logical reasoning (3x3 grid with symbols ▲ ● ■ ◆ ★ ○ □ △, last cell ?) and 10 numerical reasoning questions. ' + diffNote + ' Return ONLY a JSON array. Logic: {"id":"L1","type":"logic","grid":[["▲","●","■"],["◆","★","○"],["□","△","?"]],"options":["▲","■","●","◆"],"answer":"▲","exp":"reason"} Numerical: {"id":"N1","type":"numerical","question":"text","tableHtml":null,"options":["a","b","c","d"],"answer":"a","exp":"reason"}'
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.8, maxOutputTokens: 5000 } })
  })
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

async function generateWithAnthropic(apiKey, difficulty) {
  const diffNote = difficulty === 'easy' ? 'Simple, straightforward questions.' : difficulty === 'hard' ? 'Complex, multi-step questions requiring deeper reasoning.' : 'Moderate difficulty questions.'
  const prompt = 'Generate 10 logical reasoning (3x3 grid with symbols ▲ ● ■ ◆ ★ ○ □ △, last cell ?) and 10 numerical reasoning questions. ' + diffNote + ' Return ONLY a JSON array. Logic: {"id":"L1","type":"logic","grid":[["▲","●","■"],["◆","★","○"],["□","△","?"]],"options":["▲","■","●","◆"],"answer":"▲","exp":"reason"} Numerical: {"id":"N1","type":"numerical","question":"text","tableHtml":null,"options":["a","b","c","d"],"answer":"a","exp":"reason"}'
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
  const s          = settings || {}
  const geminiKey  = s.geminiKey    || ''
  const anthropicKey = s.anthropicKey || ''
  const difficulty = s.difficulty   || 'medium'

  if (geminiKey) {
    try { return parseQuestions(await generateWithGemini(geminiKey, difficulty)) }
    catch(e) { console.warn('Gemini failed:', e.message) }
  }
  if (anthropicKey) {
    try { return parseQuestions(await generateWithAnthropic(anthropicKey, difficulty)) }
    catch(e) { console.warn('Anthropic failed:', e.message) }
  }
  return shuffle([...makeLogicQuestions(10, difficulty), ...makeNumQuestions(10, difficulty)])
}
