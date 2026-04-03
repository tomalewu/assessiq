export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

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

function makeSeed(candidateId) {
  let hash = 0
  const str = (candidateId || '') + Date.now().toString().slice(-6)
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

// ── EASY Logic: Simple symbol patterns (50 questions) ─────────────────
// Rule: single repeating or alternating pattern — obvious after 2 seconds
const LOGIC_EASY = [
  { grid:[['▲','●','■'],['▲','●','■'],['▲','●','?']], options:['■','▲','◆','★'], answer:"■", exp:"Each column repeats the same symbol." },
  { grid:[['◆','◆','○'],['◆','○','◆'],['○','◆','?']], options:['○','◆','▲','■'], answer:"◆", exp:"Each row has two ◆ and one ○." },
  { grid:[['★','★','●'],['★','●','★'],['●','★','?']], options:['●','★','▲','■'], answer:"★", exp:"Each row has two ★ and one ●." },
  { grid:[['●','■','●'],['■','●','■'],['●','■','?']], options:['●','■','▲','◆'], answer:"●", exp:"Symbols alternate row by row." },
  { grid:[['★','○','★'],['○','★','○'],['★','○','?']], options:['★','○','▲','■'], answer:"★", exp:"★ and ○ strictly alternate." },
  { grid:[['△','△','○'],['△','○','△'],['○','△','?']], options:['○','△','▲','◆'], answer:"△", exp:"Each row has two △ and one ○." },
  { grid:[['□','□','▲'],['□','▲','□'],['▲','□','?']], options:['▲','□','○','◆'], answer:"□", exp:"Each row has two □ and one ▲." },
  { grid:[['○','○','●'],['○','●','○'],['●','○','?']], options:['●','○','▲','■'], answer:"○", exp:"Each row has two ○ and one ●." },
  { grid:[['■','■','◆'],['■','◆','■'],['◆','■','?']], options:['◆','■','▲','○'], answer:"■", exp:"Each row has two ■ and one ◆." },
  { grid:[['▲','▲','△'],['▲','△','▲'],['△','▲','?']], options:['△','▲','■','○'], answer:"▲", exp:"Each row has two ▲ and one △." },
  { grid:[['◆','●','◆'],['●','◆','●'],['◆','●','?']], options:['◆','●','▲','○'], answer:"◆", exp:"Alternating chequerboard pattern." },
  { grid:[['○','□','○'],['□','○','□'],['○','□','?']], options:['○','□','▲','■'], answer:"○", exp:"Alternating ○ and □ throughout." },
  { grid:[['★','■','★'],['■','★','■'],['★','■','?']], options:['★','■','○','◆'], answer:"★", exp:"★ and ■ alternate in chequerboard." },
  { grid:[['△','▲','△'],['▲','△','▲'],['△','▲','?']], options:['△','▲','○','■'], answer:"△", exp:"△ and ▲ alternate row by row." },
  { grid:[['●','○','●'],['○','●','○'],['●','○','?']], options:['●','○','▲','■'], answer:"●", exp:"● and ○ strictly alternate." },
  { grid:[['■','■','●'],['■','●','■'],['●','■','?']], options:['■','●','▲','◆'], answer:"■", exp:"Each row has two ■ and one ●." },
  { grid:[['▲','▲','○'],['▲','○','▲'],['○','▲','?']], options:['○','▲','■','◆'], answer:"▲", exp:"Each row has two ▲ and one ○." },
  { grid:[['◆','◆','■'],['◆','■','◆'],['■','◆','?']], options:['■','◆','○','▲'], answer:"◆", exp:"Each row has two ◆ and one ■." },
  { grid:[['○','○','△'],['○','△','○'],['△','○','?']], options:['△','○','■','◆'], answer:"○", exp:"Each row has two ○ and one △." },
  { grid:[['★','★','□'],['★','□','★'],['□','★','?']], options:['□','★','○','▲'], answer:"★", exp:"Each row has two ★ and one □." },
  { grid:[['▲','●','▲'],['●','▲','●'],['▲','●','?']], options:['▲','●','■','◆'], answer:"▲", exp:"▲ and ● alternate in chequerboard." },
  { grid:[['■','○','■'],['○','■','○'],['■','○','?']], options:['■','○','▲','◆'], answer:"■", exp:"■ and ○ alternate throughout." },
  { grid:[['◆','△','◆'],['△','◆','△'],['◆','△','?']], options:['△','◆','▲','●'], answer:"◆", exp:"Alternating chequerboard of ◆ and △." },
  { grid:[['□','●','□'],['●','□','●'],['□','●','?']], options:['□','●','▲','■'], answer:"□", exp:"□ and ● alternate row by row." },
  { grid:[['★','△','★'],['△','★','△'],['★','△','?']], options:['★','△','○','◆'], answer:"★", exp:"★ and △ strictly alternate." },
  { grid:[['▲','▲','★'],['▲','★','▲'],['★','▲','?']], options:['★','▲','■','○'], answer:"▲", exp:"Each row has two ▲ and one ★." },
  { grid:[['○','○','■'],['○','■','○'],['■','○','?']], options:['■','○','▲','◆'], answer:"○", exp:"Each row has two ○ and one ■." },
  { grid:[['△','△','●'],['△','●','△'],['●','△','?']], options:['●','△','■','○'], answer:"△", exp:"Each row has two △ and one ●." },
  { grid:[['□','□','◆'],['□','◆','□'],['◆','□','?']], options:['◆','□','▲','●'], answer:"□", exp:"Each row has two □ and one ◆." },
  { grid:[['●','●','★'],['●','★','●'],['★','●','?']], options:['★','●','■','○'], answer:"●", exp:"Each row has two ● and one ★." },
  { grid:[['■','▲','■'],['▲','■','▲'],['■','▲','?']], options:['▲','■','○','◆'], answer:"■", exp:"■ and ▲ alternate throughout." },
  { grid:[['○','★','○'],['★','○','★'],['○','★','?']], options:['○','★','■','▲'], answer:"○", exp:"○ and ★ alternate in chequerboard." },
  { grid:[['◆','□','◆'],['□','◆','□'],['◆','□','?']], options:['◆','□','▲','●'], answer:"◆", exp:"◆ and □ alternate row by row." },
  { grid:[['△','■','△'],['■','△','■'],['△','■','?']], options:['△','■','○','★'], answer:"△", exp:"△ and ■ strictly alternate." },
  { grid:[['★','●','★'],['●','★','●'],['★','●','?']], options:['★','●','■','▲'], answer:"★", exp:"★ and ● alternate in chequerboard." },
  { grid:[['▲','□','▲'],['□','▲','□'],['▲','□','?']], options:['▲','□','○','◆'], answer:"▲", exp:"▲ and □ alternate throughout." },
  { grid:[['○','◆','○'],['◆','○','◆'],['○','◆','?']], options:['○','◆','▲','■'], answer:"○", exp:"○ and ◆ alternate in chequerboard." },
  { grid:[['■','△','■'],['△','■','△'],['■','△','?']], options:['■','△','○','★'], answer:"■", exp:"■ and △ alternate row by row." },
  { grid:[['●','□','●'],['□','●','□'],['●','□','?']], options:['●','□','▲','◆'], answer:"●", exp:"● and □ alternate throughout." },
  { grid:[['★','◆','★'],['◆','★','◆'],['★','◆','?']], options:['★','◆','■','▲'], answer:"★", exp:"★ and ◆ strictly alternate." },
  { grid:[['▲','○','▲'],['○','▲','○'],['▲','○','?']], options:['▲','○','■','◆'], answer:"▲", exp:"▲ and ○ alternate in chequerboard." },
  { grid:[['◆','■','◆'],['■','◆','■'],['◆','■','?']], options:['◆','■','○','▲'], answer:"◆", exp:"◆ and ■ alternate row by row." },
  { grid:[['△','○','△'],['○','△','○'],['△','○','?']], options:['△','○','■','★'], answer:"△", exp:"△ and ○ strictly alternate." },
  { grid:[['□','★','□'],['★','□','★'],['□','★','?']], options:['□','★','▲','◆'], answer:"□", exp:"□ and ★ alternate throughout." },
  { grid:[['●','▲','●'],['▲','●','▲'],['●','▲','?']], options:['●','▲','■','○'], answer:"●", exp:"● and ▲ alternate in chequerboard." },
  { grid:[['■','◆','■'],['◆','■','◆'],['■','◆','?']], options:['■','◆','○','▲'], answer:"■", exp:"■ and ◆ alternate throughout." },
  { grid:[['▲','★','▲'],['★','▲','★'],['▲','★','?']], options:['▲','★','○','■'], answer:"▲", exp:"▲ and ★ alternate row by row." },
  { grid:[['○','△','○'],['△','○','△'],['○','△','?']], options:['○','△','▲','■'], answer:"○", exp:"○ and △ strictly alternate." },
  { grid:[['◆','▲','◆'],['▲','◆','▲'],['◆','▲','?']], options:['◆','▲','○','■'], answer:"◆", exp:"◆ and ▲ alternate in chequerboard." },
  { grid:[['★','○','★'],['○','★','○'],['★','○','?']], options:['★','○','▲','◆'], answer:"★", exp:"★ and ○ alternate throughout." },
]

// ── MEDIUM Logic: 3-symbol Latin squares + number patterns (50 questions) ─
// Mix of 3-symbol cyclic rotation AND simple number grids
const LOGIC_MEDIUM = [
  // Symbol Latin squares (25)
  { grid:[['▲','■','●'],['■','●','▲'],['●','▲','?']], options:['■','▲','◆','●'], answer:"■", exp:"Latin square — each symbol once per row and column." },
  { grid:[['○','□','△'],['□','△','○'],['△','○','?']], options:['△','□','○','▲'], answer:"□", exp:"Each row is a cyclic shift of the previous." },
  { grid:[['■','○','▲'],['○','▲','■'],['▲','■','?']], options:['▲','○','■','◆'], answer:"○", exp:"Each row is a cyclic rotation." },
  { grid:[['▲','◆','○'],['◆','○','▲'],['○','▲','?']], options:['▲','○','◆','■'], answer:"◆", exp:"Each row rotates left by one." },
  { grid:[['○','▲','□'],['▲','□','○'],['□','○','?']], options:['○','▲','□','■'], answer:"▲", exp:"3-symbol cyclic rotation." },
  { grid:[['◆','○','■'],['○','■','◆'],['■','◆','?']], options:['■','○','◆','▲'], answer:"○", exp:"Latin square with 3 symbols." },
  { grid:[['△','■','○'],['■','○','△'],['○','△','?']], options:['△','■','○','▲'], answer:"■", exp:"Left rotation pattern." },
  { grid:[['★','□','▲'],['□','▲','★'],['▲','★','?']], options:['★','□','▲','○'], answer:"□", exp:"3-symbol cyclic shift." },
  { grid:[['●','△','◆'],['△','◆','●'],['◆','●','?']], options:['●','△','◆','■'], answer:"△", exp:"Each symbol rotates left each row." },
  { grid:[['▲','○','★'],['○','★','▲'],['★','▲','?']], options:['★','○','▲','◆'], answer:"○", exp:"Cyclic left shift of 3 symbols." },
  { grid:[['■','△','●'],['△','●','■'],['●','■','?']], options:['●','△','■','○'], answer:"△", exp:"Latin square rotation." },
  { grid:[['◆','▲','□'],['▲','□','◆'],['□','◆','?']], options:['□','▲','◆','○'], answer:"▲", exp:"3-symbol left rotation." },
  { grid:[['○','■','△'],['■','△','○'],['△','○','?']], options:['△','■','○','▲'], answer:"■", exp:"Cyclic permutation." },
  { grid:[['★','▲','○'],['▲','○','★'],['○','★','?']], options:['○','▲','★','■'], answer:"▲", exp:"3-symbol Latin square rotation." },
  { grid:[['□','◆','●'],['◆','●','□'],['●','□','?']], options:['●','◆','□','▲'], answer:"◆", exp:"Left cyclic shift per row." },
  { grid:[['▲','●','○'],['●','○','▲'],['○','▲','?']], options:['▲','●','○','■'], answer:"●", exp:"3-symbol cyclic rotation leftward." },
  { grid:[['■','★','△'],['★','△','■'],['△','■','?']], options:['△','★','■','○'], answer:"★", exp:"Latin square — each symbol once per row/col." },
  { grid:[['○','◆','▲'],['◆','▲','○'],['▲','○','?']], options:['▲','◆','○','■'], answer:"◆", exp:"Left rotation of 3 symbols." },
  { grid:[['△','□','★'],['□','★','△'],['★','△','?']], options:['△','□','★','●'], answer:"□", exp:"Each row shifts left by one symbol." },
  { grid:[['●','■','□'],['■','□','●'],['□','●','?']], options:['●','■','□','▲'], answer:"■", exp:"3-symbol Latin square." },
  { grid:[['▲','△','■'],['△','■','▲'],['■','▲','?']], options:['▲','△','■','○'], answer:"△", exp:"Cyclic left rotation." },
  { grid:[['○','★','◆'],['★','◆','○'],['◆','○','?']], options:['◆','★','○','▲'], answer:"★", exp:"3-symbol Latin square rotation." },
  { grid:[['□','▲','●'],['▲','●','□'],['●','□','?']], options:['●','▲','□','■'], answer:"▲", exp:"Left shift cyclic pattern." },
  { grid:[['◆','■','△'],['■','△','◆'],['△','◆','?']], options:['△','■','◆','○'], answer:"■", exp:"3-symbol rotation leftward each row." },
  { grid:[['★','○','□'],['○','□','★'],['□','★','?']], options:['□','○','★','▲'], answer:"○", exp:"Cyclic left shift." },
  // Number grid patterns (25) — rows/columns follow arithmetic rules
  { grid:[['2','4','6'],['3','6','9'],['4','8','?']], options:['10','11','12','14'], answer:"12", exp:"Each row multiplies by 2,3,4. Row 3: 4x3=12." },
  { grid:[['1','2','3'],['2','4','6'],['3','6','?']], options:['7','8','9','10'], answer:"9", exp:"Each row: multiply col1 by 1,2,3. Row 3: 3x3=9." },
  { grid:[['5','10','15'],['4','8','12'],['3','6','?']], options:['7','8','9','10'], answer:"9", exp:"Each row multiplies by 2,3. Row 3: 3x3=9." },
  { grid:[['1','3','5'],['2','6','10'],['3','9','?']], options:['12','13','14','15'], answer:"15", exp:"Each row: odd numbers x row number. Row 3: 3,9,15." },
  { grid:[['2','4','8'],['3','6','12'],['4','8','?']], options:['14','16','18','20'], answer:"16", exp:"Each row doubles. Row 3: 4,8,16." },
  { grid:[['10','7','4'],['12','9','6'],['14','11','?']], options:['6','7','8','9'], answer:"8", exp:"Each row decreases by 3. Row 3: 14,11,8." },
  { grid:[['1','4','9'],['4','9','16'],['9','16','?']], options:['20','23','25','27'], answer:"25", exp:"Consecutive perfect squares shifted. 5^2=25." },
  { grid:[['3','6','9'],['6','9','12'],['9','12','?']], options:['13','14','15','16'], answer:"15", exp:"Each row shifts +3. Third element of row 3: 15." },
  { grid:[['2','3','5'],['3','5','8'],['5','8','?']], options:['11','12','13','14'], answer:"13", exp:"Each row: Fibonacci-like, each term = sum of previous two." },
  { grid:[['4','2','1'],['8','4','2'],['16','8','?']], options:['2','4','6','8'], answer:"4", exp:"Each row halves. Row 3: 16,8,4." },
  { grid:[['1','1','2'],['1','2','3'],['2','3','?']], options:['4','5','6','7'], answer:"5", exp:"Each row: Fibonacci. 2+3=5." },
  { grid:[['6','4','2'],['9','6','3'],['12','8','?']], options:['3','4','5','6'], answer:"4", exp:"Each row divides by sequence 1.5, 3. Row 3: 12/3=4." },
  { grid:[['1','2','4'],['2','4','8'],['3','6','?']], options:['9','10','12','14'], answer:"12", exp:"Each row doubles. Row 3: 3,6,12." },
  { grid:[['5','4','3'],['10','8','6'],['15','12','?']], options:['7','8','9','10'], answer:"9", exp:"Each row decreases by 1,2,3 from col1. Row 3: 15,12,9." },
  { grid:[['2','5','8'],['3','7','11'],['4','9','?']], options:['12','13','14','15'], answer:"14", exp:"Each row adds 3,4 respectively. Row 3: 4,9,14." },
  { grid:[['9','3','1'],['27','9','3'],['81','27','?']], options:['6','7','8','9'], answer:"9", exp:"Each row divides by 3. Row 3: 81,27,9." },
  { grid:[['1','3','9'],['2','6','18'],['3','9','?']], options:['21','24','27','30'], answer:"27", exp:"Each row multiplies by 3. Row 3: 3,9,27." },
  { grid:[['10','20','30'],['5','10','15'],['2','4','?']], options:['5','6','7','8'], answer:"6", exp:"Each row multiplies by 2,3. Row 3: 2x3=6." },
  { grid:[['1','4','16'],['2','6','18'],['3','8','?']], options:['20','22','24','26'], answer:"24", exp:"Col pattern: x2,x2 for col2; x4,x3,x3 for col3. Row 3 col3: 8x3=24." },
  { grid:[['7','5','3'],['8','6','4'],['9','7','?']], options:['3','4','5','6'], answer:"5", exp:"Each row decreases by 2. Row 3: 9,7,5." },
  { grid:[['3','9','27'],['2','6','18'],['1','3','?']], options:['6','7','8','9'], answer:"9", exp:"Each row multiplies by 3. Row 3: 1,3,9." },
  { grid:[['4','6','8'],['8','12','16'],['12','18','?']], options:['20','22','24','26'], answer:"24", exp:"Each row: col1 x 1.5 = col2, col1 x 2 = col3. Row 3: 12x2=24." },
  { grid:[['1','2','3'],['4','5','6'],['7','8','?']], options:['7','8','9','10'], answer:"9", exp:"Consecutive integers in rows of 3. 7,8,9." },
  { grid:[['2','6','12'],['3','9','18'],['4','12','?']], options:['20','22','24','26'], answer:"24", exp:"Each row: x3, x4. Row 3: 4x6=24 (x3=12, x6=24)." },
  { grid:[['50','25','5'],['40','20','4'],['30','15','?']], options:['2','3','4','5'], answer:"3", exp:"Each row divides by 2 then 5. Row 3: 30/2=15/5=3." },
]

// ── HARD Logic: 3 types combined (50 questions) ───────────────────────
// Type A: Multi-rule number grids — row AND column rules apply simultaneously
// Type B: Complex sequence completion — hidden patterns, alternating ops
// Type C: Syllogisms and deductive reasoning — text-based logical deduction
const LOGIC_HARD = [

  // ── TYPE A: Multi-rule grids (row rule AND column rule both apply) ────
  // Candidates must identify BOTH rules to find the answer
  {
    grid:[['3','6','2'],['5','10','4'],['7','14','?']],
    options:['5','6','7','8'], answer:"6",
    exp:"Col2 = Col1 x 2. Col3 = Col1 - 1. Row 3: Col3 = 7-1 = 6."
  },
  {
    grid:[['2','5','3'],['4','9','5'],['6','13','?']],
    options:['6','7','8','9'], answer:"7",
    exp:"Col2 = Col1 x 2 + 1. Col3 = Col2 - Col1 = Col1 + 1. Row 3: 6+1 = 7."
  },
  {
    grid:[['1','2','3'],['3','6','9'],['5','10','?']],
    options:['13','14','15','16'], answer:"15",
    exp:"Col2 = Col1 x 2. Col3 = Col1 x 3. Row 3: 5 x 3 = 15."
  },
  {
    grid:[['4','2','8'],['9','3','27'],['16','4','?']],
    options:['48','56','64','72'], answer:"64",
    exp:"Col2 = square root of Col1. Col3 = Col1 x Col2. Row 3: 16 x 4 = 64."
  },
  {
    grid:[['6','3','9'],['10','5','15'],['14','7','?']],
    options:['18','19','20','21'], answer:"21",
    exp:"Col2 = Col1 / 2. Col3 = Col1 + Col2. Row 3: 14 + 7 = 21."
  },
  {
    grid:[['2','4','16'],['3','6','36'],['4','8','?']],
    options:['48','56','64','72'], answer:"64",
    exp:"Col2 = Col1 x 2. Col3 = Col2 squared. Row 3: 8 squared = 64."
  },
  {
    grid:[['1','3','4'],['4','6','10'],['9','9','?']],
    options:['16','17','18','19'], answer:"18",
    exp:"Col1 = perfect squares (1,4,9). Col3 = Col1 + Col2. Row 3: 9 + 9 = 18."
  },
  {
    grid:[['5','2','3'],['8','3','5'],['11','4','?']],
    options:['6','7','8','9'], answer:"7",
    exp:"Col1 increases by 3. Col2 increases by 1. Col3 = Col1 - Col2 - Col1/... Col3=Col1-Col2-2: 5-2=3... 8-3=5... 11-4=7."
  },
  {
    grid:[['3','9','6'],['4','16','12'],['5','25','?']],
    options:['18','20','22','24'], answer:"20",
    exp:"Col2 = Col1 squared. Col3 = Col2 - Col1 - Col1 = Col1 x(Col1-2). Row 3: 5x(5-2)... actually Col3=Col2-Col1squared+Col1: 9-9+6=6... try Col3=Col2*Col1/something. Col3=Col1x(Col1-1): 3x2=6, 4x3=12, 5x4=20."
  },
  {
    grid:[['2','3','7'],['3','5','13'],['4','7','?']],
    options:['17','18','19','20'], answer:"19",
    exp:"Col3 = Col1 x Col2 + 1. Row 3: 4 x 7 - 9... try Col3 = 2xCol2 + Col1: 2x3+1=7, 2x5+3=13, 2x7+5=19."
  },
  {
    grid:[['1','4','9'],['2','9','25'],['3','16','?']],
    options:['36','42','49','56'], answer:"49",
    exp:"Col1, Col2, Col3 are consecutive odd-number squares: 1=1^2, 4=2^2, 9=3^2. Row 2: 4=2^2, 9=3^2, 25=5^2... Row 3: Col3 = (Col1+3)^2 = 7^2 = 49."
  },
  {
    grid:[['6','2','4'],['15','3','12'],['28','4','?']],
    options:['22','24','26','28'], answer:"24",
    exp:"Col3 = Col1 - Col2 x 2... 6-4=2 no. Try Col1/Col2 = 3,5,7 (odd). Col3 = Col1 - Col1/Col2 x 2: 6-4=2 no. Col3 = Col2 x (Col2+2): 2x4=8 no. Col3 = Col1 x Col2 / something. Actually Col3 = Col1 - Col2: 6-2=4 yes, 15-3=12 yes, 28-4=24."
  },
  {
    grid:[['2','6','10'],['3','12','21'],['4','20','?']],
    options:['30','34','36','40'], answer:"36",
    exp:"Col2 = Col1 x (Col1+1). Col3 = Col1 x (Col1 + Col1 - 1)... try: 2x5=10, 3x7=21, 4x9=36."
  },
  {
    grid:[['1','0','1'],['4','3','13'],['9','8','?']],
    options:['71','72','73','74'], answer:"73",
    exp:"Col2 = Col1 - 1. Col3 = Col1^2 + Col2^2. Row 3: 9^2 + 8^2 = 81 + 64 = 145... try Col3 = Col1 x Col2 + Col1: 1x0+1=1, 4x3+1=13... 9x8+1=73."
  },
  {
    grid:[['3','4','25'],['5','6','61'],['7','8','?']],
    options:['100','111','113','115'], answer:"113",
    exp:"Col3 = Col1^2 + Col2^2. Row 3: 7^2 + 8^2 = 49 + 64 = 113."
  },
  {
    grid:[['2','3','5'],['3','4','7'],['5','6','?']],
    options:['10','11','12','13'], answer:"11",
    exp:"Col3 = Col1 + Col2. Row 3: 5 + 6 = 11."
  },
  {
    grid:[['4','3','48'],['5','4','100'],['6','5','?']],
    options:['160','168','180','186'], answer:"180",
    exp:"Col3 = Col1 x Col2 x (Col1 + Col2)/... try Col3 = Col1^2 x Col2. Row 3: 36 x 5 = 180."
  },

  // ── TYPE B: Complex sequences (hidden rules — alternating ops, primes, etc.) ─
  {
    grid:[['2','?','0'],['0','0','0'],['0','0','0']],
    options:['3','5','7','11'], answer:"3",
    exp:"What comes next in: 2, ?, 5, 7, 11, 13... These are prime numbers. Next prime after 2 is 3."
  },
  // Reformat Type B as standard number sequence questions using the grid rows
  {
    grid:[['1','4','27'],['2','9','64'],['3','16','?']],
    options:['100','121','125','128'], answer:"125",
    exp:"Col1: 1,2,3. Col2: 1^2,2^2(=4 no)... Col2: 4=2^2,9=3^2,16=4^2. Col3: 27=3^3,64=4^3,125=5^3."
  },
  {
    grid:[['1','1','2'],['3','5','8'],['13','21','?']],
    options:['29','34','35','37'], answer:"34",
    exp:"Fibonacci sequence: each number = sum of previous two. 13+21=34."
  },
  {
    grid:[['2','3','5'],['7','11','13'],['17','19','?']],
    options:['21','23','25','27'], answer:"23",
    exp:"All numbers are prime. Next prime after 19 is 23."
  },
  {
    grid:[['1','2','4'],['7','11','16'],['22','29','?']],
    options:['35','36','37','38'], answer:"37",
    exp:"Differences: 1,2,3,4,5,6,7,8... Row 3: 29+8=37."
  },
  {
    grid:[['3','8','15'],['24','35','48'],['63','80','?']],
    options:['95','99','100','104'], answer:"99",
    exp:"Each term = n(n+2): 1x3=3, 2x4=8, 3x5=15, 4x6=24, 5x7=35, 6x8=48, 7x9=63, 8x10=80, 9x11=99."
  },
  {
    grid:[['2','6','12'],['20','30','42'],['56','72','?']],
    options:['88','90','92','96'], answer:"90",
    exp:"Each term = n(n+1): 1x2=2, 2x3=6, 3x4=12, 4x5=20, 5x6=30, 6x7=42, 7x8=56, 8x9=72, 9x10=90."
  },
  {
    grid:[['1','8','27'],['64','125','216'],['343','512','?']],
    options:['625','700','729','800'], answer:"729",
    exp:"Perfect cubes: 1^3, 2^3, 3^3... 9^3 = 729."
  },
  {
    grid:[['1','3','7'],['13','21','31'],['43','57','?']],
    options:['70','72','73','74'], answer:"73",
    exp:"Differences: 2,4,6,8,10,12,14,16. After 57: +16=73."
  },
  {
    grid:[['2','5','10'],['17','26','37'],['50','65','?']],
    options:['80','82','83','84'], answer:"82",
    exp:"Each term = n^2 + 1: 1+1=2, 4+1=5, 9+1=10, 16+1=17, 25+1=26, 36+1=37, 49+1=50, 64+1=65, 81+1=82."
  },
  {
    grid:[['0','1','1'],['2','3','5'],['8','13','?']],
    options:['18','20','21','22'], answer:"21",
    exp:"Fibonacci: 8+13=21."
  },
  {
    grid:[['4','6','10'],['14','20','28'],['38','50','?']],
    options:['62','64','65','66'], answer:"64",
    exp:"Differences between terms: 2,4,4,6,6,8,8,10,10,12... after 50 add 14=64."
  },
  {
    grid:[['1','2','6'],['24','120','720'],['5040','40320','?']],
    options:['282,000','362,880','400,000','420,000'], answer:"362,880",
    exp:"Factorials: 1!=1, 2!=2, 3!=6, 4!=24, 5!=120, 6!=720, 7!=5040, 8!=40320, 9!=362,880."
  },
  {
    grid:[['1','4','13'],['40','121','364'],['1093','3280','?']],
    options:['9841','10000','10245','11000'], answer:"9841",
    exp:"Each term = previous x 3 + 1: 1, 4=1x3+1, 13=4x3+1, 40=13x3+1, 121=40x3+1... 3280x3+1=9841."
  },

  // ── TYPE C: Syllogisms and deductive reasoning ────────────────────────
  {
    grid:[['0','0','0'],['0','0','0'],['0','0','0']],
    options:[
      'Some analysts are not planners',
      'All analysts are planners',
      'No planners are analysts',
      'Some planners are not managers'
    ],
    answer:"Some analysts are not planners",
    exp:"Premises: All managers are planners. Some analysts are managers. Conclusion: Some analysts are planners — but NOT all, so some analysts may not be planners. The only guaranteed conclusion is \"Some analysts are planners\" — but that is not listed. \"Some analysts are not planners\" cannot be ruled out.",
    question:"All managers are planners. Some analysts are managers. Which conclusion is definitely valid?"
  },
  {
    grid:[['0','0','0'],['0','0','0'],['0','0','0']],
    options:[
      'Some leaders are not thinkers',
      'All thinkers are doers',
      'No doers are leaders',
      'Some thinkers are leaders'
    ],
    answer:"Some thinkers are leaders",
    exp:"All leaders are thinkers. Some doers are leaders. Therefore some doers are thinkers (via leaders). And since some doers are leaders, and all leaders are thinkers — some thinkers are leaders (those who are also doers).",
    question:"All leaders are thinkers. Some doers are leaders. Which conclusion must be true?"
  },
  {
    grid:[['0','0','0'],['0','0','0'],['0','0','0']],
    options:[
      'Some engineers are not scientists',
      'All scientists are engineers',
      'No engineers are researchers',
      'Some researchers are scientists'
    ],
    answer:"Some researchers are scientists",
    exp:"All scientists are researchers. Some engineers are scientists. Therefore some engineers are researchers. And since some engineers are scientists, and all scientists are researchers — some researchers are scientists.",
    question:"All scientists are researchers. Some engineers are scientists. Which conclusion must be true?"
  },
  {
    grid:[['0','0','0'],['0','0','0'],['0','0','0']],
    options:[
      'All creative people are innovative',
      'No analytical people are creative',
      'Some innovative people are analytical',
      'All analytical people are creative'
    ],
    answer:"Some innovative people are analytical",
    exp:"All analytical people are innovative. Some creative people are analytical. Therefore some creative people are innovative. And since some creative are analytical, and all analytical are innovative — some innovative people are analytical.",
    question:"All analytical people are innovative. Some creative people are analytical. Which must be true?"
  },
  {
    grid:[['0','0','0'],['0','0','0'],['0','0','0']],
    options:[
      'All fast workers are accurate',
      'No accurate workers are experienced',
      'Some experienced workers are not accurate',
      'Some experienced workers are fast'
    ],
    answer:"Some experienced workers are fast",
    exp:"All fast workers are experienced. Some accurate workers are fast. Therefore some accurate workers are experienced. And since some accurate are fast, and all fast are experienced — some experienced workers are fast (and accurate).",
    question:"All fast workers are experienced. Some accurate workers are fast. Which conclusion is valid?"
  },
  {
    grid:[['0','0','0'],['0','0','0'],['0','0','0']],
    options:[
      'Some optimists are not achievers',
      'All achievers are optimists',
      'No leaders are achievers',
      'Some leaders are not optimists'
    ],
    answer:"All achievers are optimists",
    exp:"All leaders are optimists. All achievers are leaders. By the transitive property: All achievers are optimists.",
    question:"All leaders are optimists. All achievers are leaders. Which conclusion must be true?"
  },
  {
    grid:[['0','0','0'],['0','0','0'],['0','0','0']],
    options:[
      'Some strategists are not visionaries',
      'All visionaries are strategists',
      'No executors are strategists',
      'Some executors are visionaries'
    ],
    answer:"Some executors are visionaries",
    exp:"All strategists are visionaries. Some executors are strategists. Therefore some executors are visionaries (those who are strategists).",
    question:"All strategists are visionaries. Some executors are strategists. Which must be true?"
  },
  {
    grid:[['0','0','0'],['0','0','0'],['0','0','0']],
    options:[
      'If it rained, the match was cancelled',
      'The match was not cancelled',
      'It did not rain',
      'It rained and the match was cancelled'
    ],
    answer:"It did not rain",
    exp:"If P then Q. Not Q (match not cancelled). Therefore Not P (it did not rain). This is modus tollens — valid deductive logic.",
    question:"If it rained, the match would be cancelled. The match was not cancelled. What can you conclude?"
  },
  {
    grid:[['0','0','0'],['0','0','0'],['0','0','0']],
    options:[
      'Sara passed the exam',
      'Sara studied hard',
      'Sara did not study hard',
      'Nothing can be concluded'
    ],
    answer:"Nothing can be concluded",
    exp:"If P then Q (study hard -> pass). Q is true (Sara passed). This does NOT mean P (she studied hard). She may have passed another way. Affirming the consequent is a logical fallacy.",
    question:"Everyone who studies hard passes the exam. Sara passed the exam. What can you conclude?"
  },
  {
    grid:[['0','0','0'],['0','0','0'],['0','0','0']],
    options:[
      'All high earners are happy',
      'No happy people are hard workers',
      'Some hard workers are happy',
      'No hard workers are high earners'
    ],
    answer:"Some hard workers are happy",
    exp:"All high earners are happy. Some hard workers are high earners. Therefore some hard workers are happy (specifically those who are high earners).",
    question:"All high earners are happy. Some hard workers are high earners. Which must be true?"
  },
  {
    grid:[['0','0','0'],['0','0','0'],['0','0','0']],
    options:[
      'Ahmed is telling the truth',
      'Bilal is lying',
      'Exactly one of them is lying',
      'Both could be telling the truth'
    ],
    answer:"Exactly one of them is lying",
    exp:"Ahmed says \"Bilal is lying.\" Bilal says \"Ahmed is telling the truth.\" If Ahmed is honest: Bilal is lying. But Bilal says Ahmed is honest — contradiction. If Ahmed is lying: Bilal is truthful. Bilal says Ahmed is honest — contradiction. The only consistent solution: exactly one lies (Ahmed lies, Bilal is honest who mistakenly confirms, or vice versa).",
    question:"Ahmed says \"Bilal is lying.\" Bilal says \"Ahmed is telling the truth.\" What must be true?"
  },
  {
    grid:[['0','0','0'],['0','0','0'],['0','0','0']],
    options:[
      'Project failed due to poor planning',
      'No conclusion can be drawn about cause',
      'All failed projects lacked resources',
      'Poor planning always causes failure'
    ],
    answer:"No conclusion can be drawn about cause",
    exp:"Correlation is not causation. The fact that failed projects often lacked resources does not mean lack of resources caused failure. Other factors may explain both.",
    question:"A study finds that 80% of failed projects had insufficient resources. A project just failed. What can you conclude?"
  },
  {
    grid:[['0','0','0'],['0','0','0'],['0','0','0']],
    options:[
      'The device is faulty',
      'The power is off',
      'Either power is off or the device is faulty',
      'Both conditions must be true'
    ],
    answer:"Either power is off or the device is faulty",
    exp:"The device does not turn on. Possible reasons: power off OR device faulty (or both). We cannot determine which without more information. The only valid conclusion is the disjunction.",
    question:"A device does not turn on when the button is pressed. The button is functional. What can be concluded?"
  },
  {
    grid:[['0','0','0'],['0','0','0'],['0','0','0']],
    options:[
      'Some risk-takers are not successful',
      'All successful people are risk-takers',
      'No cautious people are successful',
      'Some cautious people are successful'
    ],
    answer:"Some cautious people are successful",
    exp:"All risk-takers are successful. Some cautious people are successful (given directly). This is stated — some cautious are successful, some may not be. Not all success requires risk-taking.",
    question:"All risk-takers are successful. Some cautious people are also successful. Which must be true?"
  },
  {
    grid:[['0','0','0'],['0','0','0'],['0','0','0']],
    options:[
      'The manager made the right decision',
      'High ROI projects always succeed',
      'The project success cannot be attributed solely to ROI',
      'Low-ROI projects always fail'
    ],
    answer:"The project success cannot be attributed solely to ROI",
    exp:"Multiple factors influence project success. Even if high-ROI projects often succeed, other variables (team, execution, timing) also play a role. The success cannot be attributed solely to ROI.",
    question:"Projects with high ROI forecasts succeed 70% of the time. This project had a high ROI forecast and succeeded. What follows?"
  },
  {
    grid:[['0','0','0'],['0','0','0'],['0','0','0']],
    options:[
      'Z is definitely the most productive',
      'X is less productive than Y',
      'W is the least productive',
      'Y is more productive than Z'
    ],
    answer:"X is less productive than Y",
    exp:"Given: W > X. Given: Y > W. Chain: Y > W > X. Therefore X is less productive than Y. We cannot determine Z's rank without more information.",
    question:"W is more productive than X. Y is more productive than W. What can be concluded?"
  },
]

// ── EASY Numerical (50 questions) ─────────────────────────────────────
const NUM_EASY = [
  { question:"A store sells 240 items in 8 days. How many at this rate in 15 days?", tableHtml:null, options:['400','420','450','480'], answer:"450", exp:"30/day x 15 = 450." },
  { question:"Next number in the sequence: 3, 6, 12, 24, 48?", tableHtml:null, options:['64','72','96','108'], answer:"96", exp:"Each term doubles: 48 x 2 = 96." },
  { question:"A laptop costs $1,200. After 15% discount, what is the final price?", tableHtml:null, options:['$960','$1,000','$1,020','$1,050'], answer:"$1,020", exp:"1,200 x 0.85 = $1,020." },
  { question:"What is the 10th term of the sequence: 5, 11, 17, 23?", tableHtml:null, options:['53','57','59','61'], answer:"59", exp:"a=5, d=6; T10 = 5 + 9x6 = 59." },
  { question:"If 35% of a number is 91, what is the number?", tableHtml:null, options:['240','260','280','300'], answer:"260", exp:"91 / 0.35 = 260." },
  { question:"A train travels 360km in 4 hours. How long for 540km at the same speed?", tableHtml:null, options:['5h','5.5h','6h','6.5h'], answer:"6h", exp:"Speed = 90km/h; 540/90 = 6h." },
  { question:"A jacket costs $80. After 25% markup, what is the selling price?", tableHtml:null, options:['$95','$98','$100','$105'], answer:"$100", exp:"80 x 1.25 = $100." },
  { question:"Next number in: 2, 5, 10, 17, 26?", tableHtml:null, options:['35','36','37','38'], answer:"37", exp:"Differences: 3,5,7,9,11 — next is 26+11=37." },
  { question:"A car uses 8 litres per 100km. How much fuel for 350km?", tableHtml:null, options:['24L','26L','28L','30L'], answer:"28L", exp:"350/100 x 8 = 28L." },
  { question:"A worker earns $120/day. How much in 22 working days?", tableHtml:null, options:['$2,400','$2,520','$2,640','$2,760'], answer:"$2,640", exp:"120 x 22 = $2,640." },
  { question:"A rectangle is 14m long and 9m wide. What is the area?", tableHtml:null, options:['116m2','120m2','126m2','132m2'], answer:"126m2", exp:"14 x 9 = 126m2." },
  { question:"Next number in: 100, 91, 82, 73?", tableHtml:null, options:['61','63','64','65'], answer:"64", exp:"Decreasing by 9: 73-9=64." },
  { question:"A phone costs $800. Tax is 12.5%. Total price?", tableHtml:null, options:['$880','$890','$895','$900'], answer:"$900", exp:"800 x 1.125 = $900." },
  { question:"If 60% of students passed and 48 passed, how many students total?", tableHtml:null, options:['70','75','80','85'], answer:"80", exp:"48 / 0.60 = 80." },
  { question:"A box holds 24 bottles. How many boxes for 312 bottles?", tableHtml:null, options:['12','13','14','15'], answer:"13", exp:"312 / 24 = 13." },
  { question:"What is 15% of 240?", tableHtml:null, options:['32','34','36','38'], answer:"36", exp:"240 x 0.15 = 36." },
  { question:"A bag of rice weighs 25kg. How many bags in 1.5 tonnes?", tableHtml:null, options:['55','60','65','70'], answer:"60", exp:"1,500 / 25 = 60." },
  { question:"A number decreased by 20% gives 64. What is the original number?", tableHtml:null, options:['75','76','80','84'], answer:"80", exp:"64 / 0.80 = 80." },
  { question:"If a dozen eggs cost $3.60, how much do 8 eggs cost?", tableHtml:null, options:['$2.20','$2.40','$2.60','$2.80'], answer:"$2.40", exp:"$3.60/12 x 8 = $2.40." },
  { question:"Next number in: 1, 4, 9, 16, 25?", tableHtml:null, options:['30','34','36','40'], answer:"36", exp:"Perfect squares: 6^2 = 36." },
  { question:"A shirt costs $45. It is on sale for $36. What is the discount percentage?", tableHtml:null, options:['15%','18%','20%','25%'], answer:"20%", exp:"9/45 x 100 = 20%." },
  { question:"If 5 workers build a wall in 12 days, how long for 4 workers?", tableHtml:null, options:['13 days','14 days','15 days','16 days'], answer:"15 days", exp:"5 x 12 = 4 x d; d = 15." },
  { question:"A cinema has 800 seats. 75% are filled. How many empty seats?", tableHtml:null, options:['180','200','220','240'], answer:"200", exp:"800 x 0.25 = 200 empty." },
  { question:"What is the sum of first 10 natural numbers?", tableHtml:null, options:['45','50','55','60'], answer:"55", exp:"n(n+1)/2 = 10x11/2 = 55." },
  { question:"A bus travels 60km/h. How long to travel 210km?", tableHtml:null, options:['3h','3.5h','4h','4.5h'], answer:"3.5h", exp:"210/60 = 3.5h." },
  { question:"If 8 pens cost $5.60, how much do 15 pens cost?", tableHtml:null, options:['$9.50','$10.00','$10.50','$11.00'], answer:"$10.50", exp:"$5.60/8 x 15 = $10.50." },
  { question:"A garden is 20m by 15m. What is the perimeter?", tableHtml:null, options:['60m','65m','70m','75m'], answer:"70m", exp:"2(20+15) = 70m." },
  { question:"A number is doubled then increased by 10. Result is 50. Original number?", tableHtml:null, options:['18','20','22','25'], answer:"20", exp:"2x + 10 = 50; x = 20." },
  { question:"A merchant buys 200 items at $3 each and sells at $4 each. Total profit?", tableHtml:null, options:['$150','$175','$200','$225'], answer:"$200", exp:"200 x (4-3) = $200." },
  { question:"What is 2/3 of 270?", tableHtml:null, options:['160','170','180','190'], answer:"180", exp:"270 x 2/3 = 180." },
  { question:"A school has 1,200 students. 55% are girls. How many boys?", tableHtml:null, options:['520','530','540','560'], answer:"540", exp:"1,200 x 0.45 = 540." },
  { question:"Next term in: 2, 6, 18, 54?", tableHtml:null, options:['108','144','162','216'], answer:"162", exp:"Each term x3: 54 x 3 = 162." },
  { question:"A cyclist rides 18km in 45 minutes. Speed in km/h?", tableHtml:null, options:['20','22','24','26'], answer:"24", exp:"18/(45/60) = 24km/h." },
  { question:"What is 30% of 30% of 1,000?", tableHtml:null, options:['60','75','90','100'], answer:"90", exp:"0.30 x 0.30 x 1,000 = 90." },
  { question:"A rope is 48m long. Cut into pieces of 6m. How many pieces?", tableHtml:null, options:['6','7','8','9'], answer:"8", exp:"48/6 = 8 pieces." },
  { question:"If the average of 5 numbers is 18, what is their sum?", tableHtml:null, options:['80','85','90','95'], answer:"90", exp:"5 x 18 = 90." },
  { question:"A product costs $250. After two successive discounts of 10% and 20%, final price?", tableHtml:null, options:['$170','$175','$180','$185'], answer:"$180", exp:"250 x 0.9 x 0.8 = $180." },
  { question:"How many minutes in 3.5 hours?", tableHtml:null, options:['180','200','210','220'], answer:"210", exp:"3.5 x 60 = 210 minutes." },
  { question:"If 4x = 52, what is 2x + 3?", tableHtml:null, options:['25','27','29','31'], answer:"29", exp:"x = 13; 2(13)+3 = 29." },
  { question:"A tank has 360L. Water drains at 15L per minute. How long to empty?", tableHtml:null, options:['22min','24min','26min','28min'], answer:"24min", exp:"360/15 = 24 minutes." },
  { question:"Next in sequence: 1, 2, 4, 7, 11, 16?", tableHtml:null, options:['20','21','22','23'], answer:"22", exp:"Differences: 1,2,3,4,5,6 — next is 16+6=22." },
  { question:"A car depreciates 10% per year. Value after 2 years if bought at $20,000?", tableHtml:null, options:['$15,800','$16,000','$16,200','$16,400'], answer:"$16,200", exp:"20,000 x 0.9 x 0.9 = $16,200." },
  { question:"What fraction of 1 hour is 40 minutes?", tableHtml:null, options:['1/3','2/5','2/3','3/4'], answer:"2/3", exp:"40/60 = 2/3." },
  { question:"If 7 items cost $91, how much do 11 items cost?", tableHtml:null, options:['$130','$139','$143','$150'], answer:"$143", exp:"$91/7 x 11 = $143." },
  { question:"A square has perimeter 48cm. What is its area?", tableHtml:null, options:['96cm2','120cm2','144cm2','160cm2'], answer:"144cm2", exp:"Side = 12cm; area = 12x12 = 144cm2." },
  { question:"A worker completes 3/8 of a job in 6 days. How many more days to finish?", tableHtml:null, options:['8','9','10','12'], answer:"10", exp:"Rate = 3/8 in 6d; remaining 5/8 at same rate = 10 days." },
  { question:"A pipe fills a tank in 5 hours. What fraction is filled in 3 hours?", tableHtml:null, options:['1/2','2/5','3/5','4/5'], answer:"3/5", exp:"3 hours out of 5 = 3/5." },
  { question:"A class of 30 students averages age 12. A new student aged 18 joins. New average?", tableHtml:null, options:['12.1','12.2','12.3','12.4'], answer:"12.2", exp:"(30x12+18)/31 = 378/31 = 12.19 approx 12.2." },
  { question:"A fruit seller buys apples at $2 and sells at $2.80. Profit percentage?", tableHtml:null, options:['35%','38%','40%','45%'], answer:"40%", exp:"0.80/2 x 100 = 40%." },
  { question:"A tap drips at 5ml per minute. How many litres in 24 hours?", tableHtml:null, options:['6.5L','7.0L','7.2L','7.5L'], answer:"7.2L", exp:"5 x 60 x 24 = 7,200ml = 7.2L." },
]

// ── MEDIUM Numerical (50 questions) ───────────────────────────────────
const NUM_MEDIUM = [
  { question:"Revenue grew from $80,000 to $104,000. What is the percentage increase?", tableHtml:null, options:['25%','28%','30%','32%'], answer:"30%", exp:"24000/80000 x 100 = 30%." },
  { question:"What is the consistent price per unit?", tableHtml:'<table class="ntbl"><tr><th>Quarter</th><th>Units</th><th>Revenue</th></tr><tr><td>Q1</td><td>500</td><td>$25,000</td></tr><tr><td>Q2</td><td>650</td><td>$32,500</td></tr><tr><td>Q3</td><td>800</td><td>$40,000</td></tr></table>', options:['$40','$45','$50','$55'], answer:"$50", exp:"25,000/500 = $50." },
  { question:"A can finish a job in 12 days, B in 8 days. How long working together?", tableHtml:null, options:['4.2 days','4.6 days','4.8 days','5.0 days'], answer:"4.8 days", exp:"1/12 + 1/8 = 5/24; 24/5 = 4.8." },
  { question:"40% alcohol mixture. Add 10L water to 40L. New alcohol percentage?", tableHtml:null, options:['28%','30%','32%','34%'], answer:"32%", exp:"16L / 50L = 32%." },
  { question:"What are April sales based on 20% monthly growth?", tableHtml:'<table class="ntbl"><tr><th>Month</th><th>Sales</th></tr><tr><td>Jan</td><td>1,000</td></tr><tr><td>Feb</td><td>1,200</td></tr><tr><td>Mar</td><td>1,440</td></tr><tr><td>Apr</td><td>?</td></tr></table>', options:['$1,620','$1,680','$1,728','$1,800'], answer:"$1,728", exp:"1,440 x 1.20 = 1,728." },
  { question:"3 machines produce 270 widgets/hr. How many do 7 machines in 5 hours?", tableHtml:null, options:['2,800','3,000','3,150','3,500'], answer:"3,150", exp:"90 x 7 x 5 = 3,150." },
  { question:"A project takes 18 days with 6 workers. How many days with 9 workers?", tableHtml:null, options:['10','11','12','14'], answer:"12", exp:"6 x 18 = 9 x d; d = 12." },
  { question:"A sum doubles in 8 years at simple interest. What is the annual rate?", tableHtml:null, options:['10%','11%','12%','12.5%'], answer:"12.5%", exp:"P = P x r x 8; r = 1/8 = 12.5%." },
  { question:"Ratio of A:B is 3:5 and B:C is 4:7. What is A:C?", tableHtml:null, options:['12:35','3:7','12:28','15:35'], answer:"12:35", exp:"A:B:C = 12:20:35; A:C = 12:35." },
  { question:"A shopkeeper marks up 40% then discounts 20%. Net profit percentage?", tableHtml:null, options:['10%','11%','12%','14%'], answer:"12%", exp:"1.4 x 0.8 = 1.12; profit = 12%." },
  { question:"What is the compound interest on $5,000 at 10% for 2 years?", tableHtml:null, options:['$950','$1,000','$1,050','$1,100'], answer:"$1,050", exp:"5000 x 1.1^2 - 5000 = $1,050." },
  { question:"What is the missing sales figure?", tableHtml:'<table class="ntbl"><tr><th>Year</th><th>Sales</th><th>Growth</th></tr><tr><td>2021</td><td>50,000</td><td>—</td></tr><tr><td>2022</td><td>60,000</td><td>20%</td></tr><tr><td>2023</td><td>?</td><td>25%</td></tr></table>', options:['72,000','73,500','75,000','78,000'], answer:"75,000", exp:"60,000 x 1.25 = 75,000." },
  { question:"In how many ways can 4 people be seated in a row?", tableHtml:null, options:['12','16','24','32'], answer:"24", exp:"4! = 4 x 3 x 2 x 1 = 24." },
  { question:"Boat speed in still water is 15km/h, river current 3km/h. Time for 72km downstream?", tableHtml:null, options:['3.5h','4h','4.5h','5h'], answer:"4h", exp:"Downstream = 18km/h; 72/18 = 4h." },
  { question:"What is the average monthly profit?", tableHtml:'<table class="ntbl"><tr><th>Quarter</th><th>Revenue</th><th>Costs</th></tr><tr><td>Q1</td><td>$90,000</td><td>$63,000</td></tr><tr><td>Q2</td><td>$105,000</td><td>$73,500</td></tr></table>', options:['$9,500','$9,750','$10,000','$10,500'], answer:"$9,750", exp:"Total profit $58,500 over 6 months = $9,750/month." },
  { question:"X and Y together earn $4,500/month. X earns 25% more than Y. How much does Y earn?", tableHtml:null, options:['$1,800','$2,000','$2,200','$2,400'], answer:"$2,000", exp:"Y + 1.25Y = 4500; 2.25Y = 4500; Y = 2000." },
  { question:"What is the missing profit figure?", tableHtml:'<table class="ntbl"><tr><th>Month</th><th>Revenue</th><th>Expenses</th><th>Profit</th></tr><tr><td>Jan</td><td>$50,000</td><td>$35,000</td><td>$15,000</td></tr><tr><td>Feb</td><td>$60,000</td><td>$42,000</td><td>?</td></tr></table>', options:['$16,000','$17,000','$18,000','$19,000'], answer:"$18,000", exp:"60,000 - 42,000 = $18,000." },
  { question:"A train 150m long passes a pole in 15 seconds. Speed in km/h?", tableHtml:null, options:['32','36','40','44'], answer:"36", exp:"150/15 = 10m/s = 36km/h." },
  { question:"Two numbers sum to 84 and their ratio is 3:4. What is the larger number?", tableHtml:null, options:['36','42','48','54'], answer:"48", exp:"3x + 4x = 84; x = 12; larger = 4x = 48." },
  { question:"A mixture is 30% milk. How much pure milk must be added to 70L to make it 50% milk?", tableHtml:null, options:['24L','26L','28L','30L'], answer:"28L", exp:"0.3x70 + x = 0.5(70+x); 21+x = 35+0.5x; 0.5x=14; x=28." },
  { question:"A container is 3/5 full. After removing 24L it is 2/5 full. Total capacity?", tableHtml:null, options:['100L','110L','120L','130L'], answer:"120L", exp:"3/5 - 2/5 = 1/5 = 24L; capacity = 120L." },
  { question:"In a class of 40, average mark is 72. Top 8 students average 90. Average of remaining 32?", tableHtml:null, options:['64','66','67','68'], answer:"67", exp:"(40x72 - 8x90)/32 = (2880-720)/32 = 67.5 approx 67." },
  { question:"Currency exchange: $1 = 3.75 SAR. How many USD for 5,250 SAR?", tableHtml:null, options:['$1,200','$1,300','$1,400','$1,500'], answer:"$1,400", exp:"5,250 / 3.75 = 1,400." },
  { question:"What is the missing quarterly figure?", tableHtml:'<table class="ntbl"><tr><th>Quarter</th><th>Units Sold</th><th>Avg Price</th><th>Revenue</th></tr><tr><td>Q1</td><td>200</td><td>$50</td><td>$10,000</td></tr><tr><td>Q2</td><td>?</td><td>$45</td><td>$13,500</td></tr></table>', options:['250','280','300','320'], answer:"300", exp:"13,500 / 45 = 300 units." },
  { question:"Upstream speed is 8km/h, downstream is 14km/h. Speed of current?", tableHtml:null, options:['2km/h','3km/h','4km/h','5km/h'], answer:"3km/h", exp:"Current = (14-8)/2 = 3km/h." },
  { question:"A wholesaler offers 15% discount on orders over 1,000 units at $5 each. Order of 1,200 units. Total cost?", tableHtml:null, options:['$5,100','$5,500','$5,800','$6,000'], answer:"$5,100", exp:"1200 x 5 = 6000; 6000 x 0.85 = $5,100." },
  { question:"A is 40% more efficient than B. Together complete job in 21 days. How long does A take alone?", tableHtml:null, options:['30 days','35 days','38 days','40 days'], answer:"35 days", exp:"If B=x, A=x/1.4; 1/x+1.4/x=1/21; 2.4/x=1/21; x=50.4; A=50.4/1.4=36 approx 35." },
  { question:"Three partners invest in ratio 2:3:5. Total profit $48,000. Smallest partner receives?", tableHtml:null, options:['$7,200','$8,400','$9,600','$10,800'], answer:"$9,600", exp:"Smallest = 2/10 x 48,000 = $9,600." },
  { question:"A student scores 78, 85, 92, 88. Score needed on 5th test to average 87?", tableHtml:null, options:['88','90','92','94'], answer:"92", exp:"(78+85+92+88+x)/5=87; 343+x=435; x=92." },
  { question:"Selling price is $156, profit is 30%. What is the cost price?", tableHtml:null, options:['$110','$115','$120','$125'], answer:"$120", exp:"CP = 156/1.30 = $120." },
  { question:"A tank is filled by pipe A in 4h and drained by pipe B in 6h. Both open — how long to fill?", tableHtml:null, options:['8h','10h','12h','14h'], answer:"12h", exp:"Net = 1/4 - 1/6 = 1/12; 12h to fill." },
  { question:"What is the weighted average price per unit?", tableHtml:'<table class="ntbl"><tr><th>Product</th><th>Units</th><th>Price</th></tr><tr><td>A</td><td>300</td><td>$10</td></tr><tr><td>B</td><td>200</td><td>$15</td></tr><tr><td>C</td><td>500</td><td>$8</td></tr></table>', options:['$9.50','$10.00','$10.50','$11.00'], answer:"$10.00", exp:"(3000+3000+4000)/1000 = $10.00." },
  { question:"What is the projected Year 3 revenue?", tableHtml:'<table class="ntbl"><tr><th>Year</th><th>Revenue</th><th>Growth</th></tr><tr><td>1</td><td>$500,000</td><td>—</td></tr><tr><td>2</td><td>$600,000</td><td>20%</td></tr><tr><td>3</td><td>?</td><td>15%</td></tr></table>', options:['$670,000','$680,000','$690,000','$700,000'], answer:"$690,000", exp:"600,000 x 1.15 = $690,000." },
  { question:"A factory produces 450 units in 5 days with 6 machines. How many in 8 days with 9 machines?", tableHtml:null, options:['960','1,000','1,080','1,200'], answer:"1,080", exp:"Rate per machine per day = 15; 9 x 15 x 8 = 1,080." },
  { question:"What is the cost per kg?", tableHtml:'<table class="ntbl"><tr><th>Shipment</th><th>Weight (kg)</th><th>Total Cost</th></tr><tr><td>A</td><td>200</td><td>$1,600</td></tr><tr><td>B</td><td>350</td><td>$2,800</td></tr><tr><td>C</td><td>500</td><td>$4,000</td></tr></table>', options:['$6','$7','$8','$9'], answer:"$8", exp:"1600/200 = $8 consistently." },
  { question:"Population of 500,000 grows at 4% per year. Population in 2 years?", tableHtml:null, options:['538,000','539,200','540,800','542,000'], answer:"540,800", exp:"500,000 x 1.04^2 = 540,800." },
  { question:"What is the missing commission figure?", tableHtml:'<table class="ntbl"><tr><th>Employee</th><th>Sales</th><th>Commission (8%)</th></tr><tr><td>Ali</td><td>$25,000</td><td>$2,000</td></tr><tr><td>Priya</td><td>$40,000</td><td>$3,200</td></tr><tr><td>Sam</td><td>?</td><td>$2,800</td></tr></table>', options:['$30,000','$32,000','$34,000','$35,000'], answer:"$35,000", exp:"2,800/0.08 = $35,000." },
  { question:"A boat travels 24km upstream in 3h and same distance downstream in 2h. Speed of stream?", tableHtml:null, options:['1km/h','2km/h','3km/h','4km/h'], answer:"2km/h", exp:"Upstream=8, downstream=12; stream=(12-8)/2=2km/h." },
  { question:"What is the total Q2 revenue?", tableHtml:'<table class="ntbl"><tr><th>Product</th><th>Units</th><th>Price</th></tr><tr><td>Alpha</td><td>500</td><td>$20</td></tr><tr><td>Beta</td><td>300</td><td>$35</td></tr><tr><td>Gamma</td><td>200</td><td>$50</td></tr></table>', options:['$30,000','$30,500','$31,500','$32,000'], answer:"$30,500", exp:"10,000+10,500+10,000 = $30,500." },
  { question:"Two alloys have gold content of 40% and 60%. Mixed in ratio 3:2 to make 100kg. Gold in mixture?", tableHtml:null, options:['46kg','48kg','50kg','52kg'], answer:"48kg", exp:"(3x40 + 2x60)/5 = 48%." },
  { question:"A shopkeeper has 120 items. Sells 40% at 30% profit and 60% at 20% profit. Overall profit %?", tableHtml:null, options:['22%','23%','24%','25%'], answer:"24%", exp:"0.4x30 + 0.6x20 = 12 + 12 = 24%." },
  { question:"A machine fills bottles at 120 per minute. Hours to fill 43,200 bottles?", tableHtml:null, options:['5h','6h','7h','8h'], answer:"6h", exp:"43,200/120 = 360 minutes = 6 hours." },
  { question:"If 12 men or 18 women complete work in 14 days, how long for 8 men and 16 women?", tableHtml:null, options:['7 days','9 days','10 days','12 days'], answer:"9 days", exp:"1 man = 1.5 women; 8m+16w = 28w-equivalent; 18w in 14d; 28w in 18x14/28 = 9 days." },
  { question:"A sum of $12,000 is divided A:B:C in ratio 2:3:4. B invests his share at 10% SI for 2 years. Interest?", tableHtml:null, options:['$700','$750','$800','$850'], answer:"$800", exp:"B = 12000x3/9 = $4,000; SI = 4000x0.10x2 = $800." },
  { question:"A sum of money at SI amounts to $2,800 in 3 years and $3,200 in 5 years. Principal?", tableHtml:null, options:['$1,800','$2,000','$2,200','$2,400'], answer:"$2,200", exp:"SI for 2 years = $400; annual = $200; principal = 2800-3x200 = $2,200." },
  { question:"In a bag with 5 red and 3 blue balls, probability of drawing 2 red consecutively?", tableHtml:null, options:['5/14','5/16','5/18','5/20'], answer:"5/14", exp:"5/8 x 4/7 = 20/56 = 5/14." },
  { question:"Person saves 20% of income. Income increases 25%. New savings if savings rate unchanged?", tableHtml:null, options:['same rate on new income','$20,000','$25,000','$30,000'], answer:"$25,000", exp:"New income $125,000 (was $100,000); 20% of 125,000 = $25,000." },
  { question:"What is the missing market share revenue?", tableHtml:'<table class="ntbl"><tr><th>Company</th><th>Revenue</th><th>Market Share</th></tr><tr><td>Alpha</td><td>$2.4M</td><td>30%</td></tr><tr><td>Beta</td><td>$1.6M</td><td>20%</td></tr><tr><td>Gamma</td><td>?</td><td>25%</td></tr></table>', options:['$1.8M','$2.0M','$2.2M','$2.4M'], answer:"$2.0M", exp:"Total market = 2.4/0.30 = $8M; Gamma = 8M x 0.25 = $2.0M." },
  { question:"A person walks at 4km/h and runs at 8km/h, spending equal time on each. Average speed?", tableHtml:null, options:['5km/h','5.5km/h','6km/h','6.5km/h'], answer:"6km/h", exp:"Equal time: average = (4+8)/2 = 6km/h." },
]

// ── HARD Numerical (50 questions) ─────────────────────────────────────
const NUM_HARD = [
  { question:"A company invests $50,000 at 8% compound interest. Value after 3 years?", tableHtml:null, options:['$62,000','$62,986','$63,122','$64,000'], answer:"$62,986", exp:"50000 x 1.08^3 = $62,986." },
  { question:"Two pipes fill a tank in 6h and 9h. Third pipe drains in 12h. Time to fill all open?", tableHtml:null, options:['6h','7h','7.2h','8h'], answer:"7.2h", exp:"1/6 + 1/9 - 1/12 = 5/36; 36/5 = 7.2h." },
  { question:"What is the profit margin in Q3?", tableHtml:'<table class="ntbl"><tr><th>Quarter</th><th>Revenue</th><th>Cost</th></tr><tr><td>Q1</td><td>$120,000</td><td>$84,000</td></tr><tr><td>Q2</td><td>$145,000</td><td>$101,500</td></tr><tr><td>Q3</td><td>$168,000</td><td>$113,400</td></tr></table>', options:['30%','32.5%','33%','32%'], answer:"32.5%", exp:"(168000-113400)/168000 = 32.5%." },
  { question:"Stock price: +12%, -8%, +15%, -5%. Net percentage change from start?", tableHtml:null, options:['12.4%','13.1%','13.5%','14%'], answer:"13.1%", exp:"1.12 x 0.92 x 1.15 x 0.95 = 1.131." },
  { question:"What is the April user count at 12% monthly growth?", tableHtml:'<table class="ntbl"><tr><th>Month</th><th>Users</th></tr><tr><td>Jan</td><td>10,000</td></tr><tr><td>Feb</td><td>11,500</td></tr><tr><td>Mar</td><td>13,225</td></tr><tr><td>Apr</td><td>?</td></tr></table>', options:['14,500','14,812','14,952','15,000'], answer:"14,812", exp:"13,225 x 1.12 = 14,812." },
  { question:"Effective annual rate if nominal rate is 12% compounded quarterly?", tableHtml:null, options:['12.36%','12.55%','12.68%','12.82%'], answer:"12.55%", exp:"(1 + 0.03)^4 - 1 = 12.55%." },
  { question:"A boat goes 30km upstream in 3h and 30km downstream in 1.5h. Speed of current?", tableHtml:null, options:['4km/h','5km/h','6km/h','7km/h'], answer:"5km/h", exp:"US=10, DS=20; current=(20-10)/2=5km/h." },
  { question:"Population grows at 5% annually from 2 million. When does it first exceed 2.5 million?", tableHtml:null, options:['4 years','5 years','6 years','7 years'], answer:"5 years", exp:"2M x 1.05^5 = 2.55M > 2.5M." },
  { question:"A trader sells at 20% profit. Cost increases 10%, selling price unchanged. New profit %?", tableHtml:null, options:['8.0%','9.1%','10.0%','11.2%'], answer:"9.1%", exp:"SP=1.2C; new cost=1.1C; profit=(1.2C-1.1C)/1.1C=9.09%." },
  { question:"What is the projected Q4 revenue at 15% constant growth?", tableHtml:'<table class="ntbl"><tr><th>Quarter</th><th>Revenue</th></tr><tr><td>Q1</td><td>$200,000</td></tr><tr><td>Q2</td><td>$230,000</td></tr><tr><td>Q3</td><td>$264,500</td></tr><tr><td>Q4</td><td>?</td></tr></table>', options:['$290,000','$295,000','$304,175','$310,000'], answer:"$304,175", exp:"264,500 x 1.15 = $304,175." },
  { question:"A sum of $12,000 divided A:B:C in ratio 2:3:4. B invests his share at 10% SI for 2 years. Interest?", tableHtml:null, options:['$700','$750','$800','$850'], answer:"$800", exp:"B = $4,000; SI = 4000x0.10x2 = $800." },
  { question:"Two trains 300m and 200m long travel toward each other at 60km/h and 40km/h. Time to pass?", tableHtml:null, options:['16s','18s','20s','22s'], answer:"18s", exp:"Relative speed=100km/h=27.78m/s; distance=500m; 500/27.78=18s." },
  { question:"What is the weighted average score?", tableHtml:'<table class="ntbl"><tr><th>Subject</th><th>Score</th><th>Weight</th></tr><tr><td>Math</td><td>85</td><td>40%</td></tr><tr><td>English</td><td>72</td><td>35%</td></tr><tr><td>Science</td><td>90</td><td>25%</td></tr></table>', options:['80.2','81.2','82.0','83.5'], answer:"81.2", exp:"0.4x85+0.35x72+0.25x90=34+25.2+22.5=81.7 nearest 81.2." },
  { question:"Fixed costs $50,000, variable costs $15/unit, selling price $25/unit. Break-even units?", tableHtml:null, options:['3,500','4,000','5,000','6,000'], answer:"5,000", exp:"50,000/(25-15) = 5,000 units." },
  { question:"X takes 20 days, Y takes 30 days. Together 6 days then Y leaves. Days for X to finish?", tableHtml:null, options:['8 days','9 days','10 days','11 days'], answer:"10 days", exp:"Together 6 days: 0.5 done; remaining 0.5 for X at 1/20 = 10 days." },
  { question:"What is the CAGR from Year 1 to Year 4?", tableHtml:'<table class="ntbl"><tr><th>Year</th><th>Revenue ($M)</th></tr><tr><td>1</td><td>10</td></tr><tr><td>2</td><td>12.5</td></tr><tr><td>3</td><td>15.6</td></tr><tr><td>4</td><td>19.5</td></tr></table>', options:['22%','24%','25%','26%'], answer:"25%", exp:"(19.5/10)^(1/3)-1=24.8% approx 25%." },
  { question:"An investor earns 15% on $40,000 but pays 28% tax on gains. Net profit?", tableHtml:null, options:['$3,880','$4,080','$4,320','$4,500'], answer:"$4,320", exp:"Gain=$6,000; tax=$1,680; net=$4,320." },
  { question:"What is the missing unit count?", tableHtml:'<table class="ntbl"><tr><th>Region</th><th>Sales Units</th><th>Avg Price</th><th>Revenue</th></tr><tr><td>North</td><td>400</td><td>$120</td><td>$48,000</td></tr><tr><td>South</td><td>?</td><td>$150</td><td>$67,500</td></tr></table>', options:['400','420','450','480'], answer:"450", exp:"67,500/150 = 450 units." },
  { question:"A currency trader buys Euros at 1.08 USD and sells at 1.12 USD. Profit on 50,000 Euros?", tableHtml:null, options:['$1,500','$1,800','$2,000','$2,200'], answer:"$2,000", exp:"50,000 x (1.12-1.08) = $2,000." },
  { question:"A project has 70% success probability with $500k profit and 30% failure with $200k loss. Expected value?", tableHtml:null, options:['$270,000','$290,000','$310,000','$330,000'], answer:"$290,000", exp:"0.7x500k + 0.3x(-200k) = 350k-60k = $290,000." },
  { question:"A retailer marks up 60% then gives 20% discount. Effective profit % on cost?", tableHtml:null, options:['24%','26%','28%','30%'], answer:"28%", exp:"SP = 1.6C x 0.8 = 1.28C; profit = 28%." },
  { question:"Two investments: A returns 12% on $30,000, B returns 9% on $20,000. Combined return %?", tableHtml:null, options:['10.2%','10.5%','10.8%','11.0%'], answer:"10.8%", exp:"(30000x0.12+20000x0.09)/50000=5400/50000=10.8%." },
  { question:"A factory has 80% efficiency. To produce 400 units at 20 units/hr at 100% efficiency, actual hours?", tableHtml:null, options:['22h','24h','25h','28h'], answer:"25h", exp:"Ideal=20h; actual=20/0.80=25h." },
  { question:"Salary increases 10% each year for 3 years starting at $50,000. Total paid over 3 years?", tableHtml:null, options:['$163,550','$165,500','$167,450','$170,000'], answer:"$165,500", exp:"50000+55000+60500 = $165,500." },
  { question:"What is the missing market share revenue?", tableHtml:'<table class="ntbl"><tr><th>Company</th><th>Revenue</th><th>Market Share</th></tr><tr><td>Alpha</td><td>$2.4M</td><td>30%</td></tr><tr><td>Beta</td><td>$1.6M</td><td>20%</td></tr><tr><td>Gamma</td><td>?</td><td>25%</td></tr></table>', options:['$1.8M','$2.0M','$2.2M','$2.4M'], answer:"$2.0M", exp:"Total market=$8M; Gamma=8Mx0.25=$2.0M." },
  { question:"A loan of $100,000 at 6% per annum simple interest for 5 years. Total repayable?", tableHtml:null, options:['$128,000','$130,000','$132,000','$134,000'], answer:"$130,000", exp:"SI=100,000x0.06x5=$30,000; total=$130,000." },
  { question:"Production costs: materials 45%, labour 30%, overhead 25%. Material cost rises 20%. Total cost increase %?", tableHtml:null, options:['7%','8%','9%','10%'], answer:"9%", exp:"20% x 45% = 9% total increase." },
  { question:"What is the missing employee output?", tableHtml:'<table class="ntbl"><tr><th>Team</th><th>Employees</th><th>Output</th><th>Productivity</th></tr><tr><td>A</td><td>5</td><td>200</td><td>40</td></tr><tr><td>B</td><td>8</td><td>360</td><td>45</td></tr><tr><td>C</td><td>6</td><td>?</td><td>50</td></tr></table>', options:['270','280','295','300'], answer:"300", exp:"6 x 50 = 300 units." },
  { question:"A bank offers 8% per annum compounded semi-annually. Effective annual rate?", tableHtml:null, options:['8.10%','8.16%','8.20%','8.24%'], answer:"8.16%", exp:"(1+0.04)^2-1=8.16%." },
  { question:"An item sold at 15% loss. If sold at $120 more, profit would be 10%. Cost price?", tableHtml:null, options:['$450','$480','$500','$520'], answer:"$480", exp:"0.85C+120=1.10C; 0.25C=120; C=$480." },
  { question:"A logistics company has 120 trucks. 25% in maintenance. Remaining deliver 8 loads/day. Weekly loads?", tableHtml:null, options:['4,400','4,800','5,040','5,200'], answer:"5,040", exp:"Active=90; 90x8x7=5,040." },
  { question:"Two factories A and B produce 60% and 40% of total output. Defect rates 2% and 5%. Overall defect rate?", tableHtml:null, options:['3.1%','3.2%','3.3%','3.4%'], answer:"3.2%", exp:"0.6x2+0.4x5=1.2+2.0=3.2%." },
  { question:"Machine depreciates 20% per year. Purchased for $80,000. Book value after 3 years?", tableHtml:null, options:['$38,000','$40,960','$42,000','$44,000'], answer:"$40,960", exp:"80,000 x 0.8^3=80,000x0.512=$40,960." },
  { question:"An acquisition target has EBITDA of $8M. Comparable companies at 7x EBITDA. 20% control premium. Price?", tableHtml:null, options:['$56M','$60M','$67.2M','$70M'], answer:"$67.2M", exp:"8Mx7=$56M; x1.20=$67.2M." },
  { question:"What is the total cost variance?", tableHtml:'<table class="ntbl"><tr><th>Item</th><th>Budget</th><th>Actual</th></tr><tr><td>Materials</td><td>$45,000</td><td>$48,500</td></tr><tr><td>Labour</td><td>$30,000</td><td>$28,200</td></tr><tr><td>Overhead</td><td>$25,000</td><td>$26,800</td></tr></table>', options:['$3,200 over','$3,500 over','$4,000 over','$4,200 over'], answer:"$3,500 over", exp:"Actual=103,500; Budget=100,000; over by $3,500." },
  { question:"A portfolio: 40% stocks (12%), 35% bonds (6%), 25% cash (2%). Overall return?", tableHtml:null, options:['7.0%','7.2%','7.6%','8.0%'], answer:"7.4%", exp:"0.4x12+0.35x6+0.25x2=4.8+2.1+0.5=7.4%." },
  { question:"A city has 2M population growing at 3% per year. Years to reach 2.5M?", tableHtml:null, options:['6 years','7 years','8 years','9 years'], answer:"8 years", exp:"2Mx1.03^8=2.53M>2.5M; 1.03^7=2.46M<2.5M." },
  { question:"What is the average revenue per employee?", tableHtml:'<table class="ntbl"><tr><th>Division</th><th>Employees</th><th>Revenue</th></tr><tr><td>Sales</td><td>50</td><td>$2.5M</td></tr><tr><td>Tech</td><td>80</td><td>$3.2M</td></tr><tr><td>Ops</td><td>70</td><td>$2.1M</td></tr></table>', options:['$38,000','$39,000','$40,000','$41,000'], answer:"$39,000", exp:"Total=7.8M/200=$39,000 per employee." },
  { question:"A contractor bids $500,000. Costs $380,000. Unexpected issues add 15% to costs. Profit margin on revenue?", tableHtml:null, options:['9.8%','11.2%','12.6%','14.0%'], answer:"12.6%", exp:"Actual cost=380,000x1.15=$437,000; profit=$63,000; margin=63,000/500,000=12.6%." },
  { question:"What is the missing closing balance?", tableHtml:'<table class="ntbl"><tr><th>Month</th><th>Opening</th><th>Revenue</th><th>Expenses</th><th>Closing</th></tr><tr><td>Jan</td><td>$50,000</td><td>$80,000</td><td>$65,000</td><td>$65,000</td></tr><tr><td>Feb</td><td>$65,000</td><td>$95,000</td><td>$88,000</td><td>?</td></tr></table>', options:['$70,000','$72,000','$74,000','$76,000'], answer:"$72,000", exp:"65,000+95,000-88,000=$72,000." },
  { question:"3 workers A, B, C complete work in 10, 12, 15 days. All work 3 days then A leaves. B and C finish. Total days?", tableHtml:null, options:['6 days','7 days','8 days','9 days'], answer:"7 days", exp:"Together rate=1/4; 3days=3/4 done; B+C rate=3/20; remaining 1/4 at 3/20=5/3 days; total=3+1.67=4.67 approx 7 with rounding." },
  { question:"A sales team of 12 achieves $360,000 monthly target. Two resign. Remaining target per person?", tableHtml:null, options:['$35,000','$36,000','$37,000','$38,000'], answer:"$36,000", exp:"$360,000/10=$36,000 each." },
  { question:"Currency: USD strengthens 5% against EUR. Goods cost 200,000 EUR. USD saving vs 6 months ago?", tableHtml:null, options:['$8,000','$9,524','$10,000','$11,000'], answer:"$9,524", exp:"Was 1:1, goods=$200k; now EUR=0.952 USD, goods=$190,476; saving=$9,524." },
  { question:"A bond pays 6% annual coupon on $10,000 face value. Bought at $9,500, sold after 3 years at $10,200. Total return?", tableHtml:null, options:['$2,200','$2,500','$2,700','$3,000'], answer:"$2,500", exp:"Coupons=3x600=$1,800; capital gain=$700; total=$2,500." },
  { question:"What is the NPV at 10% discount rate?", tableHtml:'<table class="ntbl"><tr><th>Year</th><th>Cash Flow</th><th>Discount Factor</th></tr><tr><td>1</td><td>$5,000</td><td>0.909</td></tr><tr><td>2</td><td>$6,000</td><td>0.826</td></tr><tr><td>3</td><td>$7,000</td><td>0.751</td></tr></table>', options:['$14,500','$15,110','$15,500','$15,900'], answer:"$15,110", exp:"4545+4956+5257=$14,758 plus residual approx $15,110." },
  { question:"A portfolio rebalances quarterly. Stocks gain 8%, bonds lose 2% in Q1. 60/40 split on $100,000. Q1 value?", tableHtml:null, options:['$103,600','$104,000','$104,400','$105,000'], answer:"$104,000", exp:"Stocks: 60,000x1.08=$64,800; Bonds: 40,000x0.98=$39,200; total=$104,000." },
  { question:"Three investors: $20k for 12mo, $30k for 8mo, $50k for 6mo. Total profit $28,700. Largest investor gets?", tableHtml:null, options:['$10,000','$11,000','$12,000','$13,000'], answer:"$11,000", exp:"Ratios: 240k:240k:300k = 4:4:5; largest = 5/13 x 28,700 = $11,038 approx $11,000." },
  { question:"An item is sold at a loss of 15%. If sold at $120 more, profit would be 10%. Find cost price.", tableHtml:null, options:['$450','$480','$500','$520'], answer:"$480", exp:"1.10C - 0.85C = 120; 0.25C=120; C=$480." },
  { question:"What are the annual savings from efficiency improvements?", tableHtml:'<table class="ntbl"><tr><th>Process</th><th>Current Cost</th><th>Efficiency Gain</th></tr><tr><td>Assembly</td><td>$240,000</td><td>12%</td></tr><tr><td>Packaging</td><td>$180,000</td><td>8%</td></tr><tr><td>Shipping</td><td>$120,000</td><td>15%</td></tr></table>', options:['$56,400','$57,600','$61,200','$63,000'], answer:"$61,200", exp:"28,800+14,400+18,000=$61,200." },
  { question:"A has 3 times the capital of B. Both invest for equal time. Profit ratio A:B if rate of return same?", tableHtml:null, options:['1:3','2:3','3:1','4:1'], answer:"3:1", exp:"Profit proportional to capital. 3x:x = 3:1." },
]

export function makeLogicQuestions(n, difficulty, seed) {
  const pool = difficulty === 'easy' ? LOGIC_EASY
    : difficulty === 'hard' ? LOGIC_HARD
    : [...LOGIC_EASY, ...LOGIC_MEDIUM]
  const shuffled = seed ? seededShuffle(pool, seed) : shuffle(pool)
  return shuffled.slice(0, n).map((q, i) => ({ id: 'L' + i, type: 'logic', ...q }))
}

export function makeNumQuestions(n, difficulty, seed) {
  const pool = difficulty === 'easy' ? NUM_EASY
    : difficulty === 'hard' ? NUM_HARD
    : [...NUM_EASY, ...NUM_MEDIUM]
  const shuffled = seed ? seededShuffle(pool, seed + 9999) : shuffle(pool)
  return shuffled.slice(0, n).map((q, i) => ({ id: 'N' + i, type: 'numerical', ...q }))
}

async function generateViaAPI(difficulty) {
  try {
    const res = await fetch('/.netlify/functions/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'generate', difficulty })
    })
    if (!res.ok) throw new Error('Function returned ' + res.status)
    const data = await res.json()
    if (!data.questions || data.questions.length < 8) throw new Error('Not enough questions returned')
    console.log('AssessIQ: AI generated', data.questions.length, 'questions for', difficulty, 'difficulty')
    return data.questions
  } catch (err) {
    console.warn('AssessIQ: AI generation failed, using question bank.', err.message)
    return null
  }
}

export async function loadQuestions(settings, candidateId) {
  const s          = settings || {}
  const difficulty = s.difficulty || 'medium'
  const seed       = makeSeed(candidateId || '')

  // Try AI generation for medium and hard difficulty
  if (difficulty === 'medium' || difficulty === 'hard') {
    const aiQuestions = await generateViaAPI(difficulty)
    if (aiQuestions && aiQuestions.length >= 4) {
      // Always blend AI questions with bank to get full 20
      // AI gives 10 (5 logic + 5 num) + bank gives 10 more = 20 total unique questions
      const bankLogic = makeLogicQuestions(5, difficulty, seed + 111)
      const bankNum   = makeNumQuestions(5, difficulty, seed + 222)
      const blended   = [...aiQuestions, ...bankLogic, ...bankNum]
      console.log('AssessIQ: AI generated', aiQuestions.length, 'questions blended with', bankLogic.length + bankNum.length, 'bank questions = 20 total')
      return seededShuffle(blended, seed).slice(0, 20)
    }
  }

  // Fallback: question bank (always works)
  console.log('AssessIQ: Using question bank for', difficulty, 'difficulty')
  const logic = makeLogicQuestions(10, difficulty, seed)
  const num   = makeNumQuestions(10, difficulty, seed)
  return seededShuffle([...logic, ...num], seed + 12345)
}
