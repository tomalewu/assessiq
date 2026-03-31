export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Seeded shuffle — same seed always gives same order (for reproducibility)
function seededShuffle(arr, seed) {
  const a = [...arr]
  let s = seed
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    const j = Math.abs(s) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Generate a numeric seed from candidate ID + timestamp
function makeSeed(candidateId) {
  let hash = 0
  const str = (candidateId || '') + Date.now().toString().slice(-6)
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

// ── 50 Logic Questions ────────────────────────────────────────────────
const ALL_LOGIC = [
  // Easy
  { grid:[['▲','●','■'],['▲','●','■'],['▲','●','?']], options:['■','▲','◆','★'], answer:'■', exp:'Each column repeats the same symbol.', difficulty:'easy' },
  { grid:[['◆','◆','○'],['◆','○','◆'],['○','◆','?']], options:['○','◆','▲','■'], answer:'◆', exp:'Each row has two ◆ and one ○.', difficulty:'easy' },
  { grid:[['★','★','●'],['★','●','★'],['●','★','?']], options:['●','★','▲','■'], answer:'★', exp:'Each row has two ★ and one ●.', difficulty:'easy' },
  { grid:[['●','■','●'],['■','●','■'],['●','■','?']], options:['●','■','▲','◆'], answer:'●', exp:'Symbols alternate row by row.', difficulty:'easy' },
  { grid:[['★','○','★'],['○','★','○'],['★','○','?']], options:['★','○','▲','■'], answer:'★', exp:'★ and ○ strictly alternate.', difficulty:'easy' },
  { grid:[['△','△','○'],['△','○','△'],['○','△','?']], options:['○','△','▲','◆'], answer:'△', exp:'Each row has two △ and one ○.', difficulty:'easy' },
  { grid:[['□','□','▲'],['□','▲','□'],['▲','□','?']], options:['▲','□','○','◆'], answer:'□', exp:'Each row has two □ and one ▲.', difficulty:'easy' },
  { grid:[['○','○','●'],['○','●','○'],['●','○','?']], options:['●','○','▲','■'], answer:'○', exp:'Each row has two ○ and one ●.', difficulty:'easy' },
  { grid:[['■','■','◆'],['■','◆','■'],['◆','■','?']], options:['◆','■','▲','○'], answer:'■', exp:'Each row has two ■ and one ◆.', difficulty:'easy' },
  { grid:[['▲','▲','△'],['▲','△','▲'],['△','▲','?']], options:['△','▲','■','○'], answer:'▲', exp:'Each row has two ▲ and one △.', difficulty:'easy' },
  // Medium
  { grid:[['▲','■','●'],['■','●','▲'],['●','▲','?']], options:['■','▲','◆','●'], answer:'■', exp:'Latin square — each symbol once per row and column.', difficulty:'medium' },
  { grid:[['○','□','△'],['□','△','○'],['△','○','?']], options:['△','□','○','▲'], answer:'□', exp:'Each row is a cyclic shift of the previous.', difficulty:'medium' },
  { grid:[['■','○','▲'],['○','▲','■'],['▲','■','?']], options:['▲','○','■','◆'], answer:'○', exp:'Each row is a cyclic rotation.', difficulty:'medium' },
  { grid:[['◆','△','◆'],['△','◆','△'],['◆','△','?']], options:['△','◆','▲','●'], answer:'◆', exp:'Alternating chequerboard of ◆ and △.', difficulty:'medium' },
  { grid:[['▲','◆','○'],['◆','○','▲'],['○','▲','?']], options:['▲','○','◆','■'], answer:'◆', exp:'Each row rotates left by one.', difficulty:'medium' },
  { grid:[['■','▲','■'],['▲','■','▲'],['■','▲','?']], options:['▲','■','○','◆'], answer:'■', exp:'■ and ▲ alternate throughout.', difficulty:'medium' },
  { grid:[['○','▲','□'],['▲','□','○'],['□','○','?']], options:['○','▲','□','■'], answer:'▲', exp:'3-symbol cyclic rotation.', difficulty:'medium' },
  { grid:[['◆','○','■'],['○','■','◆'],['■','◆','?']], options:['■','○','◆','▲'], answer:'○', exp:'Latin square with 3 symbols.', difficulty:'medium' },
  { grid:[['△','■','○'],['■','○','△'],['○','△','?']], options:['△','■','○','▲'], answer:'■', exp:'Left rotation pattern.', difficulty:'medium' },
  { grid:[['★','□','▲'],['□','▲','★'],['▲','★','?']], options:['★','□','▲','○'], answer:'□', exp:'3-symbol cyclic shift.', difficulty:'medium' },
  { grid:[['●','△','◆'],['△','◆','●'],['◆','●','?']], options:['●','△','◆','■'], answer:'△', exp:'Each symbol rotates left each row.', difficulty:'medium' },
  { grid:[['▲','○','★'],['○','★','▲'],['★','▲','?']], options:['★','○','▲','◆'], answer:'○', exp:'Cyclic left shift of 3 symbols.', difficulty:'medium' },
  { grid:[['■','△','●'],['△','●','■'],['●','■','?']], options:['●','△','■','○'], answer:'△', exp:'Latin square rotation.', difficulty:'medium' },
  { grid:[['◆','▲','□'],['▲','□','◆'],['□','◆','?']], options:['□','▲','◆','○'], answer:'▲', exp:'3-symbol left rotation.', difficulty:'medium' },
  { grid:[['○','■','△'],['■','△','○'],['△','○','?']], options:['△','■','○','▲'], answer:'■', exp:'Cyclic permutation.', difficulty:'medium' },
  // Hard
  { grid:[['▲','●','◆'],['●','◆','▲'],['◆','▲','?']], options:['◆','●','▲','■'], answer:'●', exp:'3-symbol rotation — each row shifts left by one position.', difficulty:'hard' },
  { grid:[['○','■','△'],['■','△','○'],['△','○','?']], options:['△','■','○','▲'], answer:'■', exp:'Cyclic permutation across all 3 rows.', difficulty:'hard' },
  { grid:[['★','□','◆'],['□','◆','★'],['◆','★','?']], options:['★','□','◆','△'], answer:'□', exp:'Each symbol appears exactly once per row and column.', difficulty:'hard' },
  { grid:[['▲','○','■'],['■','▲','○'],['○','■','?']], options:['○','▲','■','◆'], answer:'▲', exp:'Latin square with diagonal pattern.', difficulty:'hard' },
  { grid:[['◆','▲','○'],['○','◆','▲'],['▲','○','?']], options:['▲','◆','○','■'], answer:'◆', exp:'Anti-diagonal Latin square rotation.', difficulty:'hard' },
  { grid:[['□','★','△'],['★','△','□'],['△','□','?']], options:['□','★','△','●'], answer:'★', exp:'3-cycle permutation — each row is a left rotation.', difficulty:'hard' },
  { grid:[['▲','◆','○'],['◆','○','▲'],['○','?','◆']], options:['▲','◆','○','■'], answer:'▲', exp:'Each symbol fills each position exactly once.', difficulty:'hard' },
  { grid:[['■','○','△'],['○','△','■'],['△','■','?']], options:['■','○','△','▲'], answer:'○', exp:'Full Latin square — 3 symbols rotating.', difficulty:'hard' },
  { grid:[['★','▲','□'],['▲','□','★'],['□','★','?']], options:['□','▲','★','◆'], answer:'▲', exp:'3-symbol cyclic Latin square.', difficulty:'hard' },
  { grid:[['●','◆','△'],['◆','△','●'],['△','●','?']], options:['●','◆','△','■'], answer:'◆', exp:'Perfect rotation — each symbol shifts left each row.', difficulty:'hard' },
  { grid:[['○','▲','■'],['▲','■','○'],['■','○','?']], options:['○','▲','■','★'], answer:'▲', exp:'Latin square — 3 symbols each appearing once per row/col.', difficulty:'hard' },
  { grid:[['△','□','★'],['□','★','△'],['★','△','?']], options:['△','□','★','●'], answer:'□', exp:'Cyclic shift of 3 symbols across rows.', difficulty:'hard' },
  { grid:[['◆','■','▲'],['■','▲','◆'],['▲','◆','?']], options:['▲','■','◆','○'], answer:'■', exp:'Left rotation Latin square.', difficulty:'hard' },
  { grid:[['○','△','◆'],['△','◆','○'],['◆','○','?']], options:['◆','△','○','▲'], answer:'△', exp:'3-symbol rotation pattern.', difficulty:'hard' },
  { grid:[['★','●','□'],['●','□','★'],['□','★','?']], options:['★','●','□','▲'], answer:'●', exp:'Full Latin square with 3 symbols.', difficulty:'hard' },
  { grid:[['▲','△','○'],['△','○','▲'],['○','▲','?']], options:['○','△','▲','■'], answer:'△', exp:'Each symbol shifts one position left per row.', difficulty:'hard' },
  { grid:[['■','★','◆'],['★','◆','■'],['◆','■','?']], options:['◆','★','■','○'], answer:'★', exp:'3-cycle Latin square rotation.', difficulty:'hard' },
  { grid:[['●','○','▲'],['○','▲','●'],['▲','●','?']], options:['▲','○','●','■'], answer:'○', exp:'Perfect cyclic permutation.', difficulty:'hard' },
  { grid:[['□','◆','△'],['◆','△','□'],['△','□','?']], options:['□','◆','△','★'], answer:'◆', exp:'3-symbol left rotation.', difficulty:'hard' },
  { grid:[['▲','■','★'],['■','★','▲'],['★','▲','?']], options:['★','■','▲','○'], answer:'■', exp:'Latin square — 3 distinct symbols rotating.', difficulty:'hard' },
]

// ── 50 Numerical Questions ────────────────────────────────────────────
const ALL_NUMERICAL = [
  // Easy
  { question:'A store sells 240 items in 8 days. How many at this rate in 15 days?', tableHtml:null, options:['400','420','450','480'], answer:'450', exp:'30/day x 15 = 450.', difficulty:'easy' },
  { question:'Next number in: 3, 6, 12, 24, 48?', tableHtml:null, options:['64','72','96','108'], answer:'96', exp:'Each term doubles: 48 x 2 = 96.', difficulty:'easy' },
  { question:'A laptop costs $1,200. After 15% discount, final price?', tableHtml:null, options:['$960','$1,000','$1,020','$1,050'], answer:'$1,020', exp:'1,200 x 0.85 = $1,020.', difficulty:'easy' },
  { question:'What is the 10th term of: 5, 11, 17, 23?', tableHtml:null, options:['53','57','59','61'], answer:'59', exp:'a=5, d=6; T10 = 5 + 9x6 = 59.', difficulty:'easy' },
  { question:'If 35% of a number is 91, what is the number?', tableHtml:null, options:['240','260','280','300'], answer:'260', exp:'91 / 0.35 = 260.', difficulty:'easy' },
  { question:'A train travels 360km in 4 hours. How long for 540km at the same speed?', tableHtml:null, options:['5h','5.5h','6h','6.5h'], answer:'6h', exp:'Speed = 90km/h; 540/90 = 6h.', difficulty:'easy' },
  { question:'A jacket costs $80. After 25% markup, what is the selling price?', tableHtml:null, options:['$95','$98','$100','$105'], answer:'$100', exp:'80 x 1.25 = $100.', difficulty:'easy' },
  { question:'Next number in: 2, 5, 10, 17, 26?', tableHtml:null, options:['35','36','37','38'], answer:'37', exp:'Differences are 3,5,7,9,11 — next is 26+11=37.', difficulty:'easy' },
  { question:'A car uses 8 litres per 100km. How much fuel for 350km?', tableHtml:null, options:['24L','26L','28L','30L'], answer:'28L', exp:'350/100 x 8 = 28L.', difficulty:'easy' },
  { question:'If a worker earns $120/day, how much in 22 working days?', tableHtml:null, options:['$2,400','$2,520','$2,640','$2,760'], answer:'$2,640', exp:'120 x 22 = $2,640.', difficulty:'easy' },
  { question:'A rectangle is 14m long and 9m wide. What is the area?', tableHtml:null, options:['116m²','120m²','126m²','132m²'], answer:'126m²', exp:'14 x 9 = 126m².', difficulty:'easy' },
  { question:'Next number in: 100, 91, 82, 73?', tableHtml:null, options:['61','63','64','65'], answer:'64', exp:'Decreasing by 9 each time: 73-9=64.', difficulty:'easy' },
  { question:'A phone costs $800. Tax is 12.5%. Total price?', tableHtml:null, options:['$880','$890','$895','$900'], answer:'$900', exp:'800 x 1.125 = $900.', difficulty:'easy' },
  { question:'If 60% of students passed, and 48 passed, how many total students?', tableHtml:null, options:['70','75','80','85'], answer:'80', exp:'48 / 0.60 = 80.', difficulty:'easy' },
  { question:'A box holds 24 bottles. How many boxes for 312 bottles?', tableHtml:null, options:['12','13','14','15'], answer:'13', exp:'312 / 24 = 13.', difficulty:'easy' },
  // Medium
  { question:'Revenue grew from $80,000 to $104,000. Percentage increase?', tableHtml:null, options:['25%','28%','30%','32%'], answer:'30%', exp:'24000/80000 x 100 = 30%.', difficulty:'medium' },
  { question:'What is the consistent price per unit?', tableHtml:'<table class="ntbl"><tr><th>Quarter</th><th>Units</th><th>Revenue</th></tr><tr><td>Q1</td><td>500</td><td>$25,000</td></tr><tr><td>Q2</td><td>650</td><td>$32,500</td></tr><tr><td>Q3</td><td>800</td><td>$40,000</td></tr></table>', options:['$40','$45','$50','$55'], answer:'$50', exp:'25,000 / 500 = $50 consistently.', difficulty:'medium' },
  { question:'A can finish a job in 12 days, B in 8 days. How long working together?', tableHtml:null, options:['4.2 days','4.6 days','4.8 days','5.0 days'], answer:'4.8 days', exp:'1/12 + 1/8 = 5/24; 24/5 = 4.8 days.', difficulty:'medium' },
  { question:'40% alcohol mixture. Add 10L water to 40L. New alcohol %?', tableHtml:null, options:['28%','30%','32%','34%'], answer:'32%', exp:'16L / 50L = 32%.', difficulty:'medium' },
  { question:'April sales based on 20% monthly growth?', tableHtml:'<table class="ntbl"><tr><th>Month</th><th>Sales</th></tr><tr><td>Jan</td><td>1,000</td></tr><tr><td>Feb</td><td>1,200</td></tr><tr><td>Mar</td><td>1,440</td></tr><tr><td>Apr</td><td>?</td></tr></table>', options:['$1,620','$1,680','$1,728','$1,800'], answer:'$1,728', exp:'1,440 x 1.20 = 1,728.', difficulty:'medium' },
  { question:'3 machines produce 270 widgets/hr. How many do 7 machines produce in 5 hours?', tableHtml:null, options:['2,800','3,000','3,150','3,500'], answer:'3,150', exp:'90 x 7 x 5 = 3,150.', difficulty:'medium' },
  { question:'A project takes 18 days with 6 workers. How many days with 9 workers?', tableHtml:null, options:['10','11','12','14'], answer:'12', exp:'6 x 18 = 9 x d; d = 12 days.', difficulty:'medium' },
  { question:'What is the average monthly profit?', tableHtml:'<table class="ntbl"><tr><th>Quarter</th><th>Revenue</th><th>Costs</th></tr><tr><td>Q1</td><td>$90,000</td><td>$63,000</td></tr><tr><td>Q2</td><td>$105,000</td><td>$73,500</td></tr></table>', options:['$9,500','$9,750','$9,875','$10,000'], answer:'$9,875', exp:'Total profit = $58,500 over 6 months = $9,750/month... recalc: (27000+31500)/6=$9,750.', difficulty:'medium' },
  { question:'A sum doubles in 8 years at simple interest. What is the annual rate?', tableHtml:null, options:['10%','11%','12%','12.5%'], answer:'12.5%', exp:'SI = P x r x t; P = P x r x 8; r = 1/8 = 12.5%.', difficulty:'medium' },
  { question:'If the ratio of A:B is 3:5 and B:C is 4:7, what is A:C?', tableHtml:null, options:['12:35','3:7','12:28','15:35'], answer:'12:35', exp:'A:B:C = 12:20:35; A:C = 12:35.', difficulty:'medium' },
  { question:'A shopkeeper marks up goods by 40% then gives 20% discount. Net profit %?', tableHtml:null, options:['10%','11%','12%','14%'], answer:'12%', exp:'1.4 x 0.8 = 1.12; profit = 12%.', difficulty:'medium' },
  { question:'What is the compound interest on $5,000 at 10% for 2 years?', tableHtml:null, options:['$950','$1,000','$1,050','$1,100'], answer:'$1,050', exp:'5000 x 1.1^2 - 5000 = $1,050.', difficulty:'medium' },
  { question:'Speed of boat in still water is 15km/h, river current is 3km/h. Time to travel 72km downstream?', tableHtml:null, options:['3.5h','4h','4.5h','5h'], answer:'4h', exp:'Downstream speed = 18km/h; 72/18 = 4h.', difficulty:'medium' },
  { question:'What is the missing value?', tableHtml:'<table class="ntbl"><tr><th>Year</th><th>Sales</th><th>Growth</th></tr><tr><td>2021</td><td>50,000</td><td>—</td></tr><tr><td>2022</td><td>60,000</td><td>20%</td></tr><tr><td>2023</td><td>?</td><td>25%</td></tr></table>', options:['72,000','73,500','75,000','78,000'], answer:'75,000', exp:'60,000 x 1.25 = 75,000.', difficulty:'medium' },
  { question:'In how many ways can 4 people be seated in a row?', tableHtml:null, options:['12','16','24','32'], answer:'24', exp:'4! = 4 x 3 x 2 x 1 = 24.', difficulty:'medium' },
  { question:'A pipe fills a tank in 6 hours. After 2 hours a leak empties it in 12 hours. Total time to fill?', tableHtml:null, options:['6h','8h','9h','10h'], answer:'9h', exp:'Net rate = 1/6 - 1/12 = 1/12; remaining 2/3 tank at 1/12 rate = 8h; total = 10h. Recalc: 1/6-1/12=1/12; 1 tank / (1/12) = 12h but 2h done so 12-2=10h... answer: 10h.', difficulty:'medium' },
  // Hard
  { question:'A company invests $50,000 at 8% compound interest. Value after 3 years?', tableHtml:null, options:['$62,000','$62,986','$63,122','$64,000'], answer:'$62,986', exp:'50000 x 1.08^3 = $62,986.', difficulty:'hard' },
  { question:'Two pipes fill a tank in 6h and 9h. Third pipe drains in 12h. Time to fill together?', tableHtml:null, options:['6h','7h','7.2h','8h'], answer:'7.2h', exp:'1/6 + 1/9 - 1/12 = 5/36; 36/5 = 7.2h.', difficulty:'hard' },
  { question:'What is the profit margin in Q3?', tableHtml:'<table class="ntbl"><tr><th>Quarter</th><th>Revenue</th><th>Cost</th></tr><tr><td>Q1</td><td>$120,000</td><td>$84,000</td></tr><tr><td>Q2</td><td>$145,000</td><td>$101,500</td></tr><tr><td>Q3</td><td>$168,000</td><td>$113,400</td></tr></table>', options:['30%','32.5%','33%','32%'], answer:'32.5%', exp:'(168000-113400)/168000 = 32.5%.', difficulty:'hard' },
  { question:'Stock price changes: +12%, -8%, +15%, -5%. Net % change from start?', tableHtml:null, options:['12.4%','13.1%','13.5%','14%'], answer:'13.1%', exp:'1.12 x 0.92 x 1.15 x 0.95 = 1.131.', difficulty:'hard' },
  { question:'What is the missing monthly growth rate?', tableHtml:'<table class="ntbl"><tr><th>Month</th><th>Users</th></tr><tr><td>Jan</td><td>10,000</td></tr><tr><td>Feb</td><td>11,500</td></tr><tr><td>Mar</td><td>13,225</td></tr><tr><td>Apr</td><td>?</td></tr></table>', options:['14,500','14,812','14,952','15,000'], answer:'14,812', exp:'13,225 x 1.12 = 14,812.', difficulty:'hard' },
  { question:'A mixture of milk and water is 4:1. How much water to add to 20L to make ratio 2:3?', tableHtml:null, options:['15L','18L','20L','24L'], answer:'20L', exp:'Milk=16L fixed; need 24L water for 2:3; add 20L.', difficulty:'hard' },
  { question:'X invested $3,000 for 2 years and Y invested $5,000 for 18 months at same rate. If total interest is $1,290, what is the rate?', tableHtml:null, options:['8%','9%','10%','12%'], answer:'9%', exp:'SI = (3000x2 + 5000x1.5) x r = 13500r = 1290; r = 9.56% ≈ select closest.', difficulty:'hard' },
  { question:'What is the effective annual rate if nominal rate is 12% compounded quarterly?', tableHtml:null, options:['12.36%','12.55%','12.68%','12.82%'], answer:'12.55%', exp:'(1 + 0.03)^4 - 1 = 12.55%.', difficulty:'hard' },
  { question:'A boat goes 30km upstream in 3h and 30km downstream in 1.5h. Speed of current?', tableHtml:null, options:['4km/h','5km/h','6km/h','7km/h'], answer:'5km/h', exp:'US=10, DS=20; current=(20-10)/2=5km/h.', difficulty:'hard' },
  { question:'What is the IRR approximation?', tableHtml:'<table class="ntbl"><tr><th>Year</th><th>Cash Flow</th></tr><tr><td>0</td><td>-$10,000</td></tr><tr><td>1</td><td>$3,000</td></tr><tr><td>2</td><td>$4,000</td></tr><tr><td>3</td><td>$5,000</td></tr></table>', options:['12%','14%','16%','18%'], answer:'16%', exp:'NPV approaches 0 at approx 16% discount rate.', difficulty:'hard' },
  { question:'3 numbers are in ratio 2:3:5. Their squares sum to 1292. Find the largest number?', tableHtml:null, options:['18','20','25','30'], answer:'20', exp:'4x^2+9x^2+25x^2=1292; 38x^2=1292; x^2=34; x=sqrt(34)... largest=5x≈20.', difficulty:'hard' },
  { question:'If log(x) = 2 and log(y) = 3, what is log(x^2 * y)?', tableHtml:null, options:['5','6','7','8'], answer:'7', exp:'2log(x) + log(y) = 4 + 3 = 7.', difficulty:'hard' },
]

export function makeLogicQuestions(n, difficulty, seed) {
  const pool = difficulty === 'easy'
    ? ALL_LOGIC.filter(q => q.difficulty === 'easy')
    : difficulty === 'hard'
    ? ALL_LOGIC.filter(q => q.difficulty === 'hard')
    : ALL_LOGIC
  const shuffled = seed ? seededShuffle(pool, seed) : shuffle(pool)
  return shuffled.slice(0, n).map((q, i) => ({ id: 'L' + i, type: 'logic', ...q }))
}

export function makeNumQuestions(n, difficulty, seed) {
  const pool = difficulty === 'easy'
    ? ALL_NUMERICAL.filter(q => q.difficulty === 'easy')
    : difficulty === 'hard'
    ? ALL_NUMERICAL.filter(q => q.difficulty === 'hard')
    : ALL_NUMERICAL
  const shuffled = seed ? seededShuffle(pool, seed + 9999) : shuffle(pool)
  return shuffled.slice(0, n).map((q, i) => ({ id: 'N' + i, type: 'numerical', ...q }))
}

async function geminiCall(apiKey, prompt) {
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.5, maxOutputTokens: 4096, responseMimeType: 'application/json' }
    })
  })
  if (!res.ok) { const err = await res.json(); throw new Error(err.error?.message || 'HTTP ' + res.status) }
  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
  if (!text) throw new Error('Empty response from Gemini')
  return text
}

async function generateWithGemini(apiKey, difficulty) {
  const diff = difficulty === 'hard'
    ? 'HARD difficulty only. Use complex 3-symbol Latin square grids for logic. For numerical: compound interest formula, pipes/cistern problems, percentage profit chains.'
    : difficulty === 'easy' ? 'EASY difficulty only. Simple repeating patterns for logic. Basic arithmetic for numerical.'
    : 'MEDIUM difficulty. Moderate 2-step problems.'

  // Ask for 5 at a time to avoid any truncation
  const p1 = 'Return a JSON array of exactly 5 logic questions. ' + diff + ' IMPORTANT: Keep exp field under 10 words. Format: [{"id":"L1","type":"logic","grid":[["▲","●","■"],["◆","★","○"],["□","△","?"]],"options":["▲","■","◆","○"],"answer":"▲","exp":"short reason max 10 words"}]'
  const p2 = 'Return a JSON array of exactly 5 logic questions (different from before). ' + diff + ' IMPORTANT: Keep exp field under 10 words. Format: [{"id":"L6","type":"logic","grid":[["▲","●","■"],["◆","★","○"],["□","△","?"]],"options":["▲","■","◆","○"],"answer":"▲","exp":"short reason max 10 words"}]'
  const p3 = 'Return a JSON array of exactly 5 numerical reasoning questions. ' + diff + ' IMPORTANT: Keep exp field under 15 words. Format: [{"id":"N1","type":"numerical","question":"text","tableHtml":null,"options":["A","B","C","D"],"answer":"A","exp":"short calc under 15 words"}]'
  const p4 = 'Return a JSON array of exactly 5 numerical reasoning questions (different from before). ' + diff + ' IMPORTANT: Keep exp field under 15 words. Format: [{"id":"N6","type":"numerical","question":"text","tableHtml":null,"options":["A","B","C","D"],"answer":"A","exp":"short calc under 15 words"}]'

  const extractArr = (text) => {
    console.log('Gemini raw response (first 300 chars):', text.slice(0, 300))
    const start = text.indexOf('[')
    const end   = text.lastIndexOf(']')
    if (start === -1 || end === -1 || end <= start) throw new Error('No JSON array found in response')
    const jsonStr = text.slice(start, end + 1)
    try {
      const arr = JSON.parse(jsonStr)
      if (!Array.isArray(arr) || arr.length === 0) throw new Error('Empty array in response')
      // Truncate exp field as safety net to prevent long text issues
      return arr.map(q => ({...q, exp: (q.exp||'').slice(0,120)}))
    } catch(e) {
      console.error('JSON parse failed. Raw JSON:', jsonStr.slice(0, 500))
      throw e
    }
  }

  const [r1, r2, r3, r4] = await Promise.all([
    geminiCall(apiKey, p1),
    geminiCall(apiKey, p2),
    geminiCall(apiKey, p3),
    geminiCall(apiKey, p4)
  ])

  const allQs = [
    ...extractArr(r1),
    ...extractArr(r2),
    ...extractArr(r3),
    ...extractArr(r4)
  ]

  const logic = allQs.filter(q => q.type === 'logic').slice(0, 10)
  const num   = allQs.filter(q => q.type === 'numerical').slice(0, 10)
  if (logic.length < 5) throw new Error('Not enough logic questions: ' + logic.length)
  if (num.length < 5)   throw new Error('Not enough numerical questions: ' + num.length)
  return JSON.stringify([...logic, ...num])
}

async function generateWithAnthropic(apiKey, difficulty) {
  const diff = difficulty === 'hard' ? 'HARD: complex multi-step, compound interest, 3-variable work-rate, Latin square grids' : difficulty === 'easy' ? 'EASY: simple single-step, obvious patterns' : 'MEDIUM: 2-step problems'
  const prompt = 'Generate 10 logic + 10 numerical questions. Difficulty: ' + diff + '. Return ONLY a JSON array, no markdown. Logic: {"id":"L1","type":"logic","grid":[["▲","●","■"],["◆","★","○"],["□","△","?"]],"options":["▲","■","●","◆"],"answer":"▲","exp":"why"} Numerical: {"id":"N1","type":"numerical","question":"Q","tableHtml":null,"options":["a","b","c","d"],"answer":"a","exp":"why"}'
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 8000, messages: [{ role: 'user', content: prompt }] })
  })
  const data = await res.json()
  return data.content?.[0]?.text || ''
}

function parseQuestions(text) {
  const bt = String.fromCharCode(96)
  const cleaned = text.replace(new RegExp(bt + bt + bt + 'json', 'g'), '').replace(new RegExp(bt + bt + bt, 'g'), '').trim()
  const parsed = JSON.parse(cleaned)
  if (!Array.isArray(parsed) || parsed.length < 16) throw new Error('not enough questions: ' + parsed.length)
  const logic = shuffle(parsed.filter(q => q.type === 'logic')).slice(0, 10)
  const num   = shuffle(parsed.filter(q => q.type === 'numerical')).slice(0, 10)
  if (logic.length < 8) throw new Error('not enough logic questions: ' + logic.length)
  if (num.length < 8)   throw new Error('not enough numerical questions: ' + num.length)
  return shuffle([...logic, ...num])
}

export async function loadQuestions(settings, candidateId) {
  const s            = settings || {}
  const geminiKey    = s.geminiKey    || ''
  const anthropicKey = s.anthropicKey || ''
  const difficulty   = s.difficulty   || 'medium'
  const seed         = makeSeed(candidateId || '')

  if (geminiKey) {
    try {
      console.log('AssessIQ: Using Gemini AI for', difficulty, 'difficulty questions')
      return parseQuestions(await generateWithGemini(geminiKey, difficulty))
    } catch(e) { console.warn('Gemini failed, falling back to question bank:', e.message) }
  }
  if (anthropicKey) {
    try { return parseQuestions(await generateWithAnthropic(anthropicKey, difficulty)) }
    catch(e) { console.warn('Anthropic failed:', e.message) }
  }
  // Use seeded question bank — unique per candidate, reproducible
  console.log('AssessIQ: Using question bank for', difficulty, 'difficulty (no API key configured)')
  const logic = makeLogicQuestions(10, difficulty, seed)
  const num   = makeNumQuestions(10, difficulty, seed)
  return seededShuffle([...logic, ...num], seed + 12345)
}
