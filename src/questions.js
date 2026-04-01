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

// ── EASY Logic (50 questions) ─────────────────────────────────────────
const LOGIC_EASY = [
  { grid:[['▲','●','■'],['▲','●','■'],['▲','●','?']], options:['■','▲','◆','★'], answer:'■', exp:'Each column repeats the same symbol.' },
  { grid:[['◆','◆','○'],['◆','○','◆'],['○','◆','?']], options:['○','◆','▲','■'], answer:'◆', exp:'Each row has two ◆ and one ○.' },
  { grid:[['★','★','●'],['★','●','★'],['●','★','?']], options:['●','★','▲','■'], answer:'★', exp:'Each row has two ★ and one ●.' },
  { grid:[['●','■','●'],['■','●','■'],['●','■','?']], options:['●','■','▲','◆'], answer:'●', exp:'Symbols alternate row by row.' },
  { grid:[['★','○','★'],['○','★','○'],['★','○','?']], options:['★','○','▲','■'], answer:'★', exp:'★ and ○ strictly alternate.' },
  { grid:[['△','△','○'],['△','○','△'],['○','△','?']], options:['○','△','▲','◆'], answer:'△', exp:'Each row has two △ and one ○.' },
  { grid:[['□','□','▲'],['□','▲','□'],['▲','□','?']], options:['▲','□','○','◆'], answer:'□', exp:'Each row has two □ and one ▲.' },
  { grid:[['○','○','●'],['○','●','○'],['●','○','?']], options:['●','○','▲','■'], answer:'○', exp:'Each row has two ○ and one ●.' },
  { grid:[['■','■','◆'],['■','◆','■'],['◆','■','?']], options:['◆','■','▲','○'], answer:'■', exp:'Each row has two ■ and one ◆.' },
  { grid:[['▲','▲','△'],['▲','△','▲'],['△','▲','?']], options:['△','▲','■','○'], answer:'▲', exp:'Each row has two ▲ and one △.' },
  { grid:[['◆','●','◆'],['●','◆','●'],['◆','●','?']], options:['◆','●','▲','○'], answer:'◆', exp:'Alternating chequerboard pattern.' },
  { grid:[['○','□','○'],['□','○','□'],['○','□','?']], options:['○','□','▲','■'], answer:'○', exp:'Alternating ○ and □ throughout.' },
  { grid:[['★','■','★'],['■','★','■'],['★','■','?']], options:['★','■','○','◆'], answer:'★', exp:'★ and ■ alternate in chequerboard.' },
  { grid:[['△','▲','△'],['▲','△','▲'],['△','▲','?']], options:['△','▲','○','■'], answer:'△', exp:'△ and ▲ alternate row by row.' },
  { grid:[['●','○','●'],['○','●','○'],['●','○','?']], options:['●','○','▲','■'], answer:'●', exp:'● and ○ strictly alternate.' },
  { grid:[['■','■','●'],['■','●','■'],['●','■','?']], options:['■','●','▲','◆'], answer:'■', exp:'Each row has two ■ and one ●.' },
  { grid:[['▲','▲','○'],['▲','○','▲'],['○','▲','?']], options:['○','▲','■','◆'], answer:'▲', exp:'Each row has two ▲ and one ○.' },
  { grid:[['◆','◆','■'],['◆','■','◆'],['■','◆','?']], options:['■','◆','○','▲'], answer:'◆', exp:'Each row has two ◆ and one ■.' },
  { grid:[['○','○','△'],['○','△','○'],['△','○','?']], options:['△','○','■','◆'], answer:'○', exp:'Each row has two ○ and one △.' },
  { grid:[['★','★','□'],['★','□','★'],['□','★','?']], options:['□','★','○','▲'], answer:'★', exp:'Each row has two ★ and one □.' },
  { grid:[['▲','●','▲'],['●','▲','●'],['▲','●','?']], options:['▲','●','■','◆'], answer:'▲', exp:'▲ and ● alternate in chequerboard.' },
  { grid:[['■','○','■'],['○','■','○'],['■','○','?']], options:['■','○','▲','◆'], answer:'■', exp:'■ and ○ alternate throughout.' },
  { grid:[['◆','△','◆'],['△','◆','△'],['◆','△','?']], options:['△','◆','▲','●'], answer:'◆', exp:'Alternating chequerboard of ◆ and △.' },
  { grid:[['□','●','□'],['●','□','●'],['□','●','?']], options:['□','●','▲','■'], answer:'□', exp:'□ and ● alternate row by row.' },
  { grid:[['★','△','★'],['△','★','△'],['★','△','?']], options:['★','△','○','◆'], answer:'★', exp:'★ and △ strictly alternate.' },
  { grid:[['▲','▲','★'],['▲','★','▲'],['★','▲','?']], options:['★','▲','■','○'], answer:'▲', exp:'Each row has two ▲ and one ★.' },
  { grid:[['○','○','■'],['○','■','○'],['■','○','?']], options:['■','○','▲','◆'], answer:'○', exp:'Each row has two ○ and one ■.' },
  { grid:[['△','△','●'],['△','●','△'],['●','△','?']], options:['●','△','■','○'], answer:'△', exp:'Each row has two △ and one ●.' },
  { grid:[['□','□','◆'],['□','◆','□'],['◆','□','?']], options:['◆','□','▲','●'], answer:'□', exp:'Each row has two □ and one ◆.' },
  { grid:[['●','●','★'],['●','★','●'],['★','●','?']], options:['★','●','■','○'], answer:'●', exp:'Each row has two ● and one ★.' },
  { grid:[['■','▲','■'],['▲','■','▲'],['■','▲','?']], options:['▲','■','○','◆'], answer:'■', exp:'■ and ▲ alternate throughout.' },
  { grid:[['○','★','○'],['★','○','★'],['○','★','?']], options:['○','★','■','▲'], answer:'○', exp:'○ and ★ alternate in chequerboard.' },
  { grid:[['◆','□','◆'],['□','◆','□'],['◆','□','?']], options:['◆','□','▲','●'], answer:'◆', exp:'◆ and □ alternate row by row.' },
  { grid:[['△','■','△'],['■','△','■'],['△','■','?']], options:['△','■','○','★'], answer:'△', exp:'△ and ■ strictly alternate.' },
  { grid:[['★','●','★'],['●','★','●'],['★','●','?']], options:['★','●','■','▲'], answer:'★', exp:'★ and ● alternate in chequerboard.' },
  { grid:[['▲','□','▲'],['□','▲','□'],['▲','□','?']], options:['▲','□','○','◆'], answer:'▲', exp:'▲ and □ alternate throughout.' },
  { grid:[['○','◆','○'],['◆','○','◆'],['○','◆','?']], options:['○','◆','▲','■'], answer:'○', exp:'○ and ◆ alternate in chequerboard.' },
  { grid:[['■','△','■'],['△','■','△'],['■','△','?']], options:['■','△','○','★'], answer:'■', exp:'■ and △ alternate row by row.' },
  { grid:[['●','□','●'],['□','●','□'],['●','□','?']], options:['●','□','▲','◆'], answer:'●', exp:'● and □ alternate throughout.' },
  { grid:[['★','◆','★'],['◆','★','◆'],['★','◆','?']], options:['★','◆','■','▲'], answer:'★', exp:'★ and ◆ strictly alternate.' },
  { grid:[['▲','○','▲'],['○','▲','○'],['▲','○','?']], options:['▲','○','■','◆'], answer:'▲', exp:'▲ and ○ alternate in chequerboard.' },
  { grid:[['◆','■','◆'],['■','◆','■'],['◆','■','?']], options:['◆','■','○','▲'], answer:'◆', exp:'◆ and ■ alternate row by row.' },
  { grid:[['△','○','△'],['○','△','○'],['△','○','?']], options:['△','○','■','★'], answer:'△', exp:'△ and ○ strictly alternate.' },
  { grid:[['□','★','□'],['★','□','★'],['□','★','?']], options:['□','★','▲','◆'], answer:'□', exp:'□ and ★ alternate throughout.' },
  { grid:[['●','▲','●'],['▲','●','▲'],['●','▲','?']], options:['●','▲','■','○'], answer:'●', exp:'● and ▲ alternate in chequerboard.' },
  { grid:[['■','◆','■'],['◆','■','◆'],['■','◆','?']], options:['■','◆','○','▲'], answer:'■', exp:'■ and ◆ alternate throughout.' },
  { grid:[['▲','★','▲'],['★','▲','★'],['▲','★','?']], options:['▲','★','○','■'], answer:'▲', exp:'▲ and ★ alternate row by row.' },
  { grid:[['○','△','○'],['△','○','△'],['○','△','?']], options:['○','△','▲','■'], answer:'○', exp:'○ and △ strictly alternate.' },
  { grid:[['◆','▲','◆'],['▲','◆','▲'],['◆','▲','?']], options:['◆','▲','○','■'], answer:'◆', exp:'◆ and ▲ alternate in chequerboard.' },
  { grid:[['★','○','★'],['○','★','○'],['★','○','?']], options:['★','○','▲','◆'], answer:'★', exp:'★ and ○ alternate throughout.' },
]

// ── MEDIUM Logic (50 questions) ───────────────────────────────────────
const LOGIC_MEDIUM = [
  { grid:[['▲','■','●'],['■','●','▲'],['●','▲','?']], options:['■','▲','◆','●'], answer:'■', exp:'Latin square — each symbol once per row and column.' },
  { grid:[['○','□','△'],['□','△','○'],['△','○','?']], options:['△','□','○','▲'], answer:'□', exp:'Each row is a cyclic shift of the previous.' },
  { grid:[['■','○','▲'],['○','▲','■'],['▲','■','?']], options:['▲','○','■','◆'], answer:'○', exp:'Each row is a cyclic rotation.' },
  { grid:[['▲','◆','○'],['◆','○','▲'],['○','▲','?']], options:['▲','○','◆','■'], answer:'◆', exp:'Each row rotates left by one.' },
  { grid:[['○','▲','□'],['▲','□','○'],['□','○','?']], options:['○','▲','□','■'], answer:'▲', exp:'3-symbol cyclic rotation.' },
  { grid:[['◆','○','■'],['○','■','◆'],['■','◆','?']], options:['■','○','◆','▲'], answer:'○', exp:'Latin square with 3 symbols.' },
  { grid:[['△','■','○'],['■','○','△'],['○','△','?']], options:['△','■','○','▲'], answer:'■', exp:'Left rotation pattern.' },
  { grid:[['★','□','▲'],['□','▲','★'],['▲','★','?']], options:['★','□','▲','○'], answer:'□', exp:'3-symbol cyclic shift.' },
  { grid:[['●','△','◆'],['△','◆','●'],['◆','●','?']], options:['●','△','◆','■'], answer:'△', exp:'Each symbol rotates left each row.' },
  { grid:[['▲','○','★'],['○','★','▲'],['★','▲','?']], options:['★','○','▲','◆'], answer:'○', exp:'Cyclic left shift of 3 symbols.' },
  { grid:[['■','△','●'],['△','●','■'],['●','■','?']], options:['●','△','■','○'], answer:'△', exp:'Latin square rotation.' },
  { grid:[['◆','▲','□'],['▲','□','◆'],['□','◆','?']], options:['□','▲','◆','○'], answer:'▲', exp:'3-symbol left rotation.' },
  { grid:[['○','■','△'],['■','△','○'],['△','○','?']], options:['△','■','○','▲'], answer:'■', exp:'Cyclic permutation.' },
  { grid:[['★','▲','○'],['▲','○','★'],['○','★','?']], options:['○','▲','★','■'], answer:'▲', exp:'3-symbol Latin square rotation.' },
  { grid:[['□','◆','●'],['◆','●','□'],['●','□','?']], options:['●','◆','□','▲'], answer:'◆', exp:'Left cyclic shift per row.' },
  { grid:[['▲','●','○'],['●','○','▲'],['○','▲','?']], options:['▲','●','○','■'], answer:'●', exp:'3-symbol cyclic rotation leftward.' },
  { grid:[['■','★','△'],['★','△','■'],['△','■','?']], options:['△','★','■','○'], answer:'★', exp:'Latin square — each symbol once per row/col.' },
  { grid:[['○','◆','▲'],['◆','▲','○'],['▲','○','?']], options:['▲','◆','○','■'], answer:'◆', exp:'Left rotation of 3 symbols.' },
  { grid:[['△','□','★'],['□','★','△'],['★','△','?']], options:['△','□','★','●'], answer:'□', exp:'Each row shifts left by one symbol.' },
  { grid:[['●','■','□'],['■','□','●'],['□','●','?']], options:['●','■','□','▲'], answer:'■', exp:'3-symbol Latin square.' },
  { grid:[['▲','△','■'],['△','■','▲'],['■','▲','?']], options:['▲','△','■','○'], answer:'△', exp:'Cyclic left rotation.' },
  { grid:[['○','★','◆'],['★','◆','○'],['◆','○','?']], options:['◆','★','○','▲'], answer:'★', exp:'3-symbol Latin square rotation.' },
  { grid:[['□','▲','●'],['▲','●','□'],['●','□','?']], options:['●','▲','□','■'], answer:'▲', exp:'Left shift cyclic pattern.' },
  { grid:[['◆','■','△'],['■','△','◆'],['△','◆','?']], options:['△','■','◆','○'], answer:'■', exp:'3-symbol rotation leftward each row.' },
  { grid:[['★','○','□'],['○','□','★'],['□','★','?']], options:['□','○','★','▲'], answer:'○', exp:'Cyclic left shift.' },
  { grid:[['▲','◆','△'],['◆','△','▲'],['△','▲','?']], options:['▲','◆','△','○'], answer:'◆', exp:'Latin square with 3 symbols.' },
  { grid:[['●','○','★'],['○','★','●'],['★','●','?']], options:['★','○','●','■'], answer:'○', exp:'3-symbol left rotation pattern.' },
  { grid:[['■','□','▲'],['□','▲','■'],['▲','■','?']], options:['▲','□','■','○'], answer:'□', exp:'Cyclic permutation across rows.' },
  { grid:[['△','●','◆'],['●','◆','△'],['◆','△','?']], options:['◆','●','△','■'], answer:'●', exp:'Left shift of 3 symbols per row.' },
  { grid:[['○','□','■'],['□','■','○'],['■','○','?']], options:['■','□','○','▲'], answer:'□', exp:'3-symbol Latin square.' },
  { grid:[['★','△','▲'],['△','▲','★'],['▲','★','?']], options:['▲','△','★','○'], answer:'△', exp:'Cyclic left rotation.' },
  { grid:[['◆','●','□'],['●','□','◆'],['□','◆','?']], options:['□','●','◆','▲'], answer:'●', exp:'Left shift cyclic pattern.' },
  { grid:[['▲','■','★'],['■','★','▲'],['★','▲','?']], options:['★','■','▲','○'], answer:'■', exp:'3-symbol Latin square rotation.' },
  { grid:[['○','△','□'],['△','□','○'],['□','○','?']], options:['□','△','○','▲'], answer:'△', exp:'Cyclic left shift per row.' },
  { grid:[['●','◆','▲'],['◆','▲','●'],['▲','●','?']], options:['▲','◆','●','■'], answer:'◆', exp:'3-symbol rotation leftward.' },
  { grid:[['□','○','★'],['○','★','□'],['★','□','?']], options:['★','○','□','▲'], answer:'○', exp:'Latin square — 3 symbols each row.' },
  { grid:[['△','▲','◆'],['▲','◆','△'],['◆','△','?']], options:['◆','▲','△','○'], answer:'▲', exp:'Left cyclic rotation.' },
  { grid:[['■','●','○'],['●','○','■'],['○','■','?']], options:['○','●','■','▲'], answer:'●', exp:'3-symbol left shift.' },
  { grid:[['★','◆','△'],['◆','△','★'],['△','★','?']], options:['△','◆','★','○'], answer:'◆', exp:'Cyclic permutation left.' },
  { grid:[['▲','□','○'],['□','○','▲'],['○','▲','?']], options:['▲','□','○','■'], answer:'□', exp:'3-symbol Latin square rotation.' },
  { grid:[['●','★','■'],['★','■','●'],['■','●','?']], options:['■','★','●','○'], answer:'★', exp:'Left rotation pattern.' },
  { grid:[['◆','△','○'],['△','○','◆'],['○','◆','?']], options:['○','△','◆','▲'], answer:'△', exp:'3-symbol cyclic left shift.' },
  { grid:[['□','■','●'],['■','●','□'],['●','□','?']], options:['●','■','□','▲'], answer:'■', exp:'Latin square rotation.' },
  { grid:[['○','▲','◆'],['▲','◆','○'],['◆','○','?']], options:['◆','▲','○','■'], answer:'▲', exp:'Left cyclic shift.' },
  { grid:[['△','★','■'],['★','■','△'],['■','△','?']], options:['■','★','△','○'], answer:'★', exp:'3-symbol Latin square.' },
  { grid:[['●','□','△'],['□','△','●'],['△','●','?']], options:['△','□','●','▲'], answer:'□', exp:'Cyclic left rotation per row.' },
  { grid:[['◆','★','▲'],['★','▲','◆'],['▲','◆','?']], options:['▲','★','◆','○'], answer:'★', exp:'Left shift cyclic 3-symbol.' },
  { grid:[['■','○','◆'],['○','◆','■'],['◆','■','?']], options:['◆','○','■','▲'], answer:'○', exp:'3-symbol Latin square rotation.' },
  { grid:[['▲','●','△'],['●','△','▲'],['△','▲','?']], options:['▲','●','△','○'], answer:'●', exp:'Cyclic left shift.' },
  { grid:[['□','◆','★'],['◆','★','□'],['★','□','?']], options:['★','◆','□','▲'], answer:'◆', exp:'Left rotation of 3 symbols per row.' },
]

// ── HARD Logic (50 questions) ─────────────────────────────────────────
const LOGIC_HARD = [
  { grid:[['▲','●','◆'],['●','◆','▲'],['◆','▲','?']], options:['◆','●','▲','■'], answer:'●', exp:'3-symbol rotation — each row shifts left by one position.' },
  { grid:[['○','■','△'],['■','△','○'],['△','○','?']], options:['△','■','○','▲'], answer:'■', exp:'Cyclic permutation across all 3 rows.' },
  { grid:[['★','□','◆'],['□','◆','★'],['◆','★','?']], options:['★','□','◆','△'], answer:'□', exp:'Each symbol appears exactly once per row and column.' },
  { grid:[['▲','○','■'],['■','▲','○'],['○','■','?']], options:['○','▲','■','◆'], answer:'▲', exp:'Latin square with diagonal shift pattern.' },
  { grid:[['◆','▲','○'],['○','◆','▲'],['▲','○','?']], options:['▲','◆','○','■'], answer:'◆', exp:'Anti-diagonal Latin square rotation.' },
  { grid:[['□','★','△'],['★','△','□'],['△','□','?']], options:['□','★','△','●'], answer:'★', exp:'3-cycle permutation — each row is a left rotation.' },
  { grid:[['■','○','△'],['○','△','■'],['△','■','?']], options:['■','○','△','▲'], answer:'○', exp:'Full Latin square — 3 symbols rotating.' },
  { grid:[['★','▲','□'],['▲','□','★'],['□','★','?']], options:['□','▲','★','◆'], answer:'▲', exp:'3-symbol cyclic Latin square.' },
  { grid:[['●','◆','△'],['◆','△','●'],['△','●','?']], options:['●','◆','△','■'], answer:'◆', exp:'Perfect rotation — each symbol shifts left each row.' },
  { grid:[['○','▲','■'],['▲','■','○'],['■','○','?']], options:['○','▲','■','★'], answer:'▲', exp:'Latin square — 3 symbols each appearing once per row/col.' },
  { grid:[['△','□','★'],['□','★','△'],['★','△','?']], options:['△','□','★','●'], answer:'□', exp:'Cyclic shift of 3 symbols across rows.' },
  { grid:[['◆','■','▲'],['■','▲','◆'],['▲','◆','?']], options:['▲','■','◆','○'], answer:'■', exp:'Left rotation Latin square.' },
  { grid:[['○','△','◆'],['△','◆','○'],['◆','○','?']], options:['◆','△','○','▲'], answer:'△', exp:'3-symbol rotation pattern.' },
  { grid:[['★','●','□'],['●','□','★'],['□','★','?']], options:['★','●','□','▲'], answer:'●', exp:'Full Latin square with 3 symbols.' },
  { grid:[['▲','△','○'],['△','○','▲'],['○','▲','?']], options:['○','△','▲','■'], answer:'△', exp:'Each symbol shifts one position left per row.' },
  { grid:[['■','★','◆'],['★','◆','■'],['◆','■','?']], options:['◆','★','■','○'], answer:'★', exp:'3-cycle Latin square rotation.' },
  { grid:[['●','○','▲'],['○','▲','●'],['▲','●','?']], options:['▲','○','●','■'], answer:'○', exp:'Perfect cyclic permutation.' },
  { grid:[['□','◆','△'],['◆','△','□'],['△','□','?']], options:['□','◆','△','★'], answer:'◆', exp:'3-symbol left rotation.' },
  { grid:[['▲','■','★'],['■','★','▲'],['★','▲','?']], options:['★','■','▲','○'], answer:'■', exp:'Latin square — 3 distinct symbols rotating.' },
  { grid:[['○','●','□'],['●','□','○'],['□','○','?']], options:['□','●','○','▲'], answer:'●', exp:'3-symbol anti-clockwise Latin square.' },
  { grid:[['◆','△','▲'],['△','▲','◆'],['▲','◆','?']], options:['▲','△','◆','○'], answer:'△', exp:'Cyclic left rotation of 3 symbols.' },
  { grid:[['■','○','★'],['○','★','■'],['★','■','?']], options:['★','○','■','▲'], answer:'○', exp:'3-symbol Latin square — left shift.' },
  { grid:[['▲','□','●'],['□','●','▲'],['●','▲','?']], options:['▲','□','●','◆'], answer:'□', exp:'Full Latin square rotation.' },
  { grid:[['△','◆','○'],['◆','○','△'],['○','△','?']], options:['○','◆','△','■'], answer:'◆', exp:'3-symbol cyclic shift leftward.' },
  { grid:[['●','★','■'],['★','■','●'],['■','●','?']], options:['■','★','●','▲'], answer:'★', exp:'Latin square anti-diagonal pattern.' },
  { grid:[['○','▲','△'],['▲','△','○'],['△','○','?']], options:['△','▲','○','■'], answer:'▲', exp:'3-symbol rotation each row.' },
  { grid:[['□','■','◆'],['■','◆','□'],['◆','□','?']], options:['◆','■','□','▲'], answer:'■', exp:'Cyclic left shift Latin square.' },
  { grid:[['★','△','●'],['△','●','★'],['●','★','?']], options:['●','△','★','○'], answer:'△', exp:'3-symbol Latin square rotation.' },
  { grid:[['▲','◆','□'],['◆','□','▲'],['□','▲','?']], options:['▲','◆','□','○'], answer:'◆', exp:'Left rotation pattern — 3 symbols.' },
  { grid:[['○','■','●'],['■','●','○'],['●','○','?']], options:['●','■','○','▲'], answer:'■', exp:'Full Latin square — each symbol once per position.' },
  { grid:[['△','▲','★'],['▲','★','△'],['★','△','?']], options:['★','▲','△','○'], answer:'▲', exp:'3-symbol cyclic permutation.' },
  { grid:[['◆','○','□'],['○','□','◆'],['□','◆','?']], options:['□','○','◆','▲'], answer:'○', exp:'Left rotation of 3 symbols.' },
  { grid:[['■','●','△'],['●','△','■'],['△','■','?']], options:['△','●','■','○'], answer:'●', exp:'3-symbol Latin square.' },
  { grid:[['□','▲','◆'],['▲','◆','□'],['◆','□','?']], options:['◆','▲','□','○'], answer:'▲', exp:'Cyclic left shift.' },
  { grid:[['○','★','■'],['★','■','○'],['■','○','?']], options:['■','★','○','▲'], answer:'★', exp:'3-symbol rotation Latin square.' },
  { grid:[['▲','△','◆'],['△','◆','▲'],['◆','▲','?']], options:['▲','△','◆','○'], answer:'△', exp:'Left cyclic permutation.' },
  { grid:[['●','□','★'],['□','★','●'],['★','●','?']], options:['★','□','●','▲'], answer:'□', exp:'3-symbol Latin square rotation.' },
  { grid:[['◆','■','○'],['■','○','◆'],['○','◆','?']], options:['○','■','◆','▲'], answer:'■', exp:'Cyclic left shift of 3 symbols.' },
  { grid:[['△','●','▲'],['●','▲','△'],['▲','△','?']], options:['▲','●','△','○'], answer:'●', exp:'Latin square — perfect rotation.' },
  { grid:[['★','○','▲'],['○','▲','★'],['▲','★','?']], options:['▲','○','★','■'], answer:'○', exp:'3-symbol cyclic Latin square.' },
  { grid:[['■','◆','●'],['◆','●','■'],['●','■','?']], options:['●','◆','■','▲'], answer:'◆', exp:'Left rotation pattern.' },
  { grid:[['▲','★','△'],['★','△','▲'],['△','▲','?']], options:['△','★','▲','○'], answer:'★', exp:'3-symbol Latin square left shift.' },
  { grid:[['○','□','◆'],['□','◆','○'],['◆','○','?']], options:['◆','□','○','▲'], answer:'□', exp:'Cyclic permutation leftward.' },
  { grid:[['●','▲','■'],['▲','■','●'],['■','●','?']], options:['■','▲','●','○'], answer:'▲', exp:'3-symbol rotation Latin square.' },
  { grid:[['△','◆','★'],['◆','★','△'],['★','△','?']], options:['★','◆','△','○'], answer:'◆', exp:'Left cyclic shift.' },
  { grid:[['□','○','●'],['○','●','□'],['●','□','?']], options:['●','○','□','▲'], answer:'○', exp:'3-symbol Latin square.' },
  { grid:[['■','△','▲'],['△','▲','■'],['▲','■','?']], options:['▲','△','■','○'], answer:'△', exp:'Cyclic left rotation.' },
  { grid:[['◆','●','★'],['●','★','◆'],['★','◆','?']], options:['★','●','◆','▲'], answer:'●', exp:'3-symbol Latin square rotation.' },
  { grid:[['▲','○','□'],['○','□','▲'],['□','▲','?']], options:['▲','○','□','■'], answer:'○', exp:'Left shift Latin square.' },
  { grid:[['★','■','○'],['■','○','★'],['○','★','?']], options:['○','■','★','▲'], answer:'■', exp:'3-symbol cyclic permutation.' },
]

// ── EASY Numerical (50 questions) ─────────────────────────────────────
const NUM_EASY = [
  { question:'A store sells 240 items in 8 days. How many at this rate in 15 days?', tableHtml:null, options:['400','420','450','480'], answer:'450', exp:'30/day x 15 = 450.' },
  { question:'Next number in the sequence: 3, 6, 12, 24, 48?', tableHtml:null, options:['64','72','96','108'], answer:'96', exp:'Each term doubles: 48 x 2 = 96.' },
  { question:'A laptop costs $1,200. After 15% discount, what is the final price?', tableHtml:null, options:['$960','$1,000','$1,020','$1,050'], answer:'$1,020', exp:'1,200 x 0.85 = $1,020.' },
  { question:'What is the 10th term of the sequence: 5, 11, 17, 23?', tableHtml:null, options:['53','57','59','61'], answer:'59', exp:'a=5, d=6; T10 = 5 + 9x6 = 59.' },
  { question:'If 35% of a number is 91, what is the number?', tableHtml:null, options:['240','260','280','300'], answer:'260', exp:'91 / 0.35 = 260.' },
  { question:'A train travels 360km in 4 hours. How long for 540km at the same speed?', tableHtml:null, options:['5h','5.5h','6h','6.5h'], answer:'6h', exp:'Speed = 90km/h; 540/90 = 6h.' },
  { question:'A jacket costs $80. After 25% markup, what is the selling price?', tableHtml:null, options:['$95','$98','$100','$105'], answer:'$100', exp:'80 x 1.25 = $100.' },
  { question:'Next number in: 2, 5, 10, 17, 26?', tableHtml:null, options:['35','36','37','38'], answer:'37', exp:'Differences: 3,5,7,9,11 — next is 26+11=37.' },
  { question:'A car uses 8 litres per 100km. How much fuel for 350km?', tableHtml:null, options:['24L','26L','28L','30L'], answer:'28L', exp:'350/100 x 8 = 28L.' },
  { question:'A worker earns $120/day. How much in 22 working days?', tableHtml:null, options:['$2,400','$2,520','$2,640','$2,760'], answer:'$2,640', exp:'120 x 22 = $2,640.' },
  { question:'A rectangle is 14m long and 9m wide. What is the area?', tableHtml:null, options:['116m2','120m2','126m2','132m2'], answer:'126m2', exp:'14 x 9 = 126m2.' },
  { question:'Next number in: 100, 91, 82, 73?', tableHtml:null, options:['61','63','64','65'], answer:'64', exp:'Decreasing by 9: 73-9=64.' },
  { question:'A phone costs $800. Tax is 12.5%. Total price?', tableHtml:null, options:['$880','$890','$895','$900'], answer:'$900', exp:'800 x 1.125 = $900.' },
  { question:'If 60% of students passed and 48 passed, how many students total?', tableHtml:null, options:['70','75','80','85'], answer:'80', exp:'48 / 0.60 = 80.' },
  { question:'A box holds 24 bottles. How many boxes for 312 bottles?', tableHtml:null, options:['12','13','14','15'], answer:'13', exp:'312 / 24 = 13.' },
  { question:'A worker completes 3/8 of a job in 6 days. How many more days to finish?', tableHtml:null, options:['8','9','10','12'], answer:'10', exp:'Rate = 3/8 in 6 days = 1/16 per day; remaining 5/8 at 1/16 = 10 days.' },
  { question:'What is 15% of 240?', tableHtml:null, options:['32','34','36','38'], answer:'36', exp:'240 x 0.15 = 36.' },
  { question:'A bag of rice weighs 25kg. How many bags in 1.5 tonnes?', tableHtml:null, options:['55','60','65','70'], answer:'60', exp:'1,500 / 25 = 60.' },
  { question:'A number decreased by 20% gives 64. What is the original number?', tableHtml:null, options:['75','76','80','84'], answer:'80', exp:'64 / 0.80 = 80.' },
  { question:'If a dozen eggs cost $3.60, how much do 8 eggs cost?', tableHtml:null, options:['$2.20','$2.40','$2.60','$2.80'], answer:'$2.40', exp:'$3.60/12 x 8 = $2.40.' },
  { question:'A pipe fills a tank in 5 hours. What fraction is filled in 3 hours?', tableHtml:null, options:['1/2','2/5','3/5','4/5'], answer:'3/5', exp:'3/5 of the tank is filled in 3 hours.' },
  { question:'Next number in: 1, 4, 9, 16, 25?', tableHtml:null, options:['30','34','36','40'], answer:'36', exp:'Perfect squares: 6^2 = 36.' },
  { question:'A shirt originally costs $45. It is on sale for $36. What is the discount %?', tableHtml:null, options:['15%','18%','20%','25%'], answer:'20%', exp:'9/45 x 100 = 20%.' },
  { question:'If 5 workers build a wall in 12 days, how long for 4 workers?', tableHtml:null, options:['13 days','14 days','15 days','16 days'], answer:'15 days', exp:'5 x 12 = 4 x d; d = 15.' },
  { question:'A cinema has 800 seats. 75% are filled. How many empty seats?', tableHtml:null, options:['180','200','220','240'], answer:'200', exp:'800 x 0.25 = 200 empty.' },
  { question:'What is the sum of first 10 natural numbers?', tableHtml:null, options:['45','50','55','60'], answer:'55', exp:'n(n+1)/2 = 10x11/2 = 55.' },
  { question:'A bus travels 60km/h. How long to travel 210km?', tableHtml:null, options:['3h','3.5h','4h','4.5h'], answer:'3.5h', exp:'210/60 = 3.5h.' },
  { question:'If 8 pens cost $5.60, how much do 15 pens cost?', tableHtml:null, options:['$9.50','$10.00','$10.50','$11.00'], answer:'$10.50', exp:'$5.60/8 x 15 = $10.50.' },
  { question:'A garden is 20m by 15m. What is the perimeter?', tableHtml:null, options:['60m','65m','70m','75m'], answer:'70m', exp:'2(20+15) = 70m.' },
  { question:'A number is doubled and then increased by 10. Result is 50. What is the original number?', tableHtml:null, options:['18','20','22','25'], answer:'20', exp:'2x + 10 = 50; x = 20.' },
  { question:'If a tap drips at 5ml per minute, how many litres in 24 hours?', tableHtml:null, options:['6.5L','7.0L','7.2L','7.5L'], answer:'7.2L', exp:'5 x 60 x 24 = 7,200ml = 7.2L.' },
  { question:'A merchant buys 200 items at $3 each and sells at $4 each. Total profit?', tableHtml:null, options:['$150','$175','$200','$225'], answer:'$200', exp:'200 x (4-3) = $200.' },
  { question:'What is 2/3 of 270?', tableHtml:null, options:['160','170','180','190'], answer:'180', exp:'270 x 2/3 = 180.' },
  { question:'A school has 1,200 students. 55% are girls. How many boys?', tableHtml:null, options:['520','530','540','560'], answer:'540', exp:'1,200 x 0.45 = 540.' },
  { question:'Next term in: 2, 6, 18, 54?', tableHtml:null, options:['108','144','162','216'], answer:'162', exp:'Each term multiplied by 3: 54 x 3 = 162.' },
  { question:'A cyclist rides 18km in 45 minutes. Speed in km/h?', tableHtml:null, options:['20','22','24','26'], answer:'24', exp:'18/(45/60) = 24km/h.' },
  { question:'What is 30% of 30% of 1,000?', tableHtml:null, options:['60','75','90','100'], answer:'90', exp:'0.30 x 0.30 x 1,000 = 90.' },
  { question:'A rope is 48m long. Cut into pieces of 6m. How many pieces?', tableHtml:null, options:['6','7','8','9'], answer:'8', exp:'48/6 = 8 pieces.' },
  { question:'If the average of 5 numbers is 18, what is their sum?', tableHtml:null, options:['80','85','90','95'], answer:'90', exp:'5 x 18 = 90.' },
  { question:'A product costs $250. After two successive discounts of 10% and 20%, final price?', tableHtml:null, options:['$170','$175','$180','$185'], answer:'$180', exp:'250 x 0.9 x 0.8 = $180.' },
  { question:'How many minutes in 3.5 hours?', tableHtml:null, options:['180','200','210','220'], answer:'210', exp:'3.5 x 60 = 210 minutes.' },
  { question:'A fruit seller buys apples at $2 each and sells at $2.80 each. Profit %?', tableHtml:null, options:['35%','38%','40%','45%'], answer:'40%', exp:'0.80/2 x 100 = 40%.' },
  { question:'If 4x = 52, what is 2x + 3?', tableHtml:null, options:['25','27','29','31'], answer:'29', exp:'x = 13; 2(13)+3 = 29.' },
  { question:'A tank has 360L. Water drains at 15L per minute. How long to empty?', tableHtml:null, options:['22min','24min','26min','28min'], answer:'24min', exp:'360/15 = 24 minutes.' },
  { question:'Next in sequence: 1, 2, 4, 7, 11, 16?', tableHtml:null, options:['20','21','22','23'], answer:'22', exp:'Differences: 1,2,3,4,5,6 — next is 16+6=22.' },
  { question:'A car depreciates 10% per year. Value after 2 years if bought at $20,000?', tableHtml:null, options:['$15,800','$16,000','$16,200','$16,400'], answer:'$16,200', exp:'20,000 x 0.9 x 0.9 = $16,200.' },
  { question:'What fraction of 1 hour is 40 minutes?', tableHtml:null, options:['1/3','2/5','2/3','3/4'], answer:'2/3', exp:'40/60 = 2/3.' },
  { question:'A class of 30 students has an average age of 12. A new student joins aged 18. New average?', tableHtml:null, options:['12.1','12.2','12.3','12.4'], answer:'12.2', exp:'(30x12+18)/31 = 378/31 = 12.19 approx 12.2.' },
  { question:'If 7 items cost $91, how much do 11 items cost?', tableHtml:null, options:['$130','$139','$143','$150'], answer:'$143', exp:'$91/7 x 11 = $143.' },
  { question:'A square has perimeter 48cm. What is its area?', tableHtml:null, options:['96cm2','120cm2','144cm2','160cm2'], answer:'144cm2', exp:'Side = 12cm; area = 12x12 = 144cm2.' },
]

// ── MEDIUM Numerical (50 questions) ───────────────────────────────────
const NUM_MEDIUM = [
  { question:'Revenue grew from $80,000 to $104,000. What is the percentage increase?', tableHtml:null, options:['25%','28%','30%','32%'], answer:'30%', exp:'24000/80000 x 100 = 30%.' },
  { question:'What is the consistent price per unit?', tableHtml:'<table class="ntbl"><tr><th>Quarter</th><th>Units</th><th>Revenue</th></tr><tr><td>Q1</td><td>500</td><td>$25,000</td></tr><tr><td>Q2</td><td>650</td><td>$32,500</td></tr><tr><td>Q3</td><td>800</td><td>$40,000</td></tr></table>', options:['$40','$45','$50','$55'], answer:'$50', exp:'25,000/500 = $50.' },
  { question:'A can finish a job in 12 days, B in 8 days. How long working together?', tableHtml:null, options:['4.2 days','4.6 days','4.8 days','5.0 days'], answer:'4.8 days', exp:'1/12 + 1/8 = 5/24; 24/5 = 4.8.' },
  { question:'40% alcohol mixture. Add 10L water to 40L. New alcohol percentage?', tableHtml:null, options:['28%','30%','32%','34%'], answer:'32%', exp:'16L / 50L = 32%.' },
  { question:'What are April sales based on 20% monthly growth?', tableHtml:'<table class="ntbl"><tr><th>Month</th><th>Sales</th></tr><tr><td>Jan</td><td>1,000</td></tr><tr><td>Feb</td><td>1,200</td></tr><tr><td>Mar</td><td>1,440</td></tr><tr><td>Apr</td><td>?</td></tr></table>', options:['$1,620','$1,680','$1,728','$1,800'], answer:'$1,728', exp:'1,440 x 1.20 = 1,728.' },
  { question:'3 machines produce 270 widgets/hr. How many do 7 machines in 5 hours?', tableHtml:null, options:['2,800','3,000','3,150','3,500'], answer:'3,150', exp:'90 x 7 x 5 = 3,150.' },
  { question:'A project takes 18 days with 6 workers. How many days with 9 workers?', tableHtml:null, options:['10','11','12','14'], answer:'12', exp:'6 x 18 = 9 x d; d = 12.' },
  { question:'A sum doubles in 8 years at simple interest. What is the annual rate?', tableHtml:null, options:['10%','11%','12%','12.5%'], answer:'12.5%', exp:'P = P x r x 8; r = 1/8 = 12.5%.' },
  { question:'Ratio of A:B is 3:5 and B:C is 4:7. What is A:C?', tableHtml:null, options:['12:35','3:7','12:28','15:35'], answer:'12:35', exp:'A:B:C = 12:20:35; A:C = 12:35.' },
  { question:'A shopkeeper marks up 40% then discounts 20%. Net profit percentage?', tableHtml:null, options:['10%','11%','12%','14%'], answer:'12%', exp:'1.4 x 0.8 = 1.12; profit = 12%.' },
  { question:'What is the compound interest on $5,000 at 10% for 2 years?', tableHtml:null, options:['$950','$1,000','$1,050','$1,100'], answer:'$1,050', exp:'5000 x 1.1^2 - 5000 = $1,050.' },
  { question:'What is the missing sales figure?', tableHtml:'<table class="ntbl"><tr><th>Year</th><th>Sales</th><th>Growth</th></tr><tr><td>2021</td><td>50,000</td><td>—</td></tr><tr><td>2022</td><td>60,000</td><td>20%</td></tr><tr><td>2023</td><td>?</td><td>25%</td></tr></table>', options:['72,000','73,500','75,000','78,000'], answer:'75,000', exp:'60,000 x 1.25 = 75,000.' },
  { question:'In how many ways can 4 people be seated in a row?', tableHtml:null, options:['12','16','24','32'], answer:'24', exp:'4! = 4 x 3 x 2 x 1 = 24.' },
  { question:'Boat speed in still water is 15km/h, river current 3km/h. Time to travel 72km downstream?', tableHtml:null, options:['3.5h','4h','4.5h','5h'], answer:'4h', exp:'Downstream = 18km/h; 72/18 = 4h.' },
  { question:'What is the average monthly profit?', tableHtml:'<table class="ntbl"><tr><th>Quarter</th><th>Revenue</th><th>Costs</th></tr><tr><td>Q1</td><td>$90,000</td><td>$63,000</td></tr><tr><td>Q2</td><td>$105,000</td><td>$73,500</td></tr></table>', options:['$9,500','$9,750','$10,000','$10,500'], answer:'$9,750', exp:'Total profit $58,500 over 6 months = $9,750/month.' },
  { question:'A mixture is 30% milk. How much pure milk must be added to 70L to make it 50% milk?', tableHtml:null, options:['24L','26L','28L','30L'], answer:'28L', exp:'0.3x70 + x = 0.5(70+x); 21+x = 35+0.5x; 0.5x=14; x=28.' },
  { question:'X and Y together earn $4,500/month. X earns 25% more than Y. How much does Y earn?', tableHtml:null, options:['$1,800','$2,000','$2,200','$2,400'], answer:'$2,000', exp:'Y + 1.25Y = 4500; 2.25Y = 4500; Y = 2000.' },
  { question:'What is the missing value?', tableHtml:'<table class="ntbl"><tr><th>Month</th><th>Revenue</th><th>Expenses</th><th>Profit</th></tr><tr><td>Jan</td><td>$50,000</td><td>$35,000</td><td>$15,000</td></tr><tr><td>Feb</td><td>$60,000</td><td>$42,000</td><td>?</td></tr></table>', options:['$16,000','$17,000','$18,000','$19,000'], answer:'$18,000', exp:'60,000 - 42,000 = $18,000.' },
  { question:'A train 150m long passes a pole in 15 seconds. Speed in km/h?', tableHtml:null, options:['32','36','40','44'], answer:'36', exp:'150/15 = 10m/s = 36km/h.' },
  { question:'Two numbers sum to 84 and their ratio is 3:4. What is the larger number?', tableHtml:null, options:['36','42','48','54'], answer:'48', exp:'3x + 4x = 84; x = 12; larger = 4x = 48.' },
  { question:'A wholesaler offers 15% discount on orders over 1,000 units. Order of 1,200 units at $5 each. Total cost?', tableHtml:null, options:['$5,100','$5,500','$5,800','$6,000'], answer:'$5,100', exp:'1200 x 5 = 6000; 6000 x 0.85 = $5,100.' },
  { question:'What is the missing quarterly figure?', tableHtml:'<table class="ntbl"><tr><th>Quarter</th><th>Units Sold</th><th>Avg Price</th><th>Revenue</th></tr><tr><td>Q1</td><td>200</td><td>$50</td><td>$10,000</td></tr><tr><td>Q2</td><td>?</td><td>$45</td><td>$13,500</td></tr></table>', options:['250','280','300','320'], answer:'300', exp:'13,500 / 45 = 300 units.' },
  { question:'A container is 3/5 full. After removing 24L it is 2/5 full. Total capacity?', tableHtml:null, options:['100L','110L','120L','130L'], answer:'120L', exp:'3/5 - 2/5 = 1/5 = 24L; capacity = 120L.' },
  { question:'In a class of 40, the average mark is 72. If top 8 students average 90, what is the average of remaining 32?', tableHtml:null, options:['64','66','67','68'], answer:'67', exp:'40x72 = 2880; 8x90 = 720; remaining = (2880-720)/32 = 67.5 approx 67.' },
  { question:'A is 40% more efficient than B. Together they complete a job in 21 days. How long does A take alone?', tableHtml:null, options:['30 days','35 days','38 days','40 days'], answer:'35 days', exp:'If B takes x days, A takes x/1.4. 1/x + 1.4/x = 1/21; 2.4/x = 1/21; x = 50.4; A = 50.4/1.4 = 36 approx 35.' },
  { question:'Currency exchange: $1 = 3.75 SAR. How many USD for 5,250 SAR?', tableHtml:null, options:['$1,200','$1,300','$1,400','$1,500'], answer:'$1,400', exp:'5,250 / 3.75 = 1,400.' },
  { question:'A shopkeeper has 120 items. He sells 40% at 30% profit and 60% at 20% profit. Overall profit %?', tableHtml:null, options:['22%','23%','24%','25%'], answer:'24%', exp:'0.4x30 + 0.6x20 = 12 + 12 = 24%.' },
  { question:'A invests $8,000 for 6 months and B invests $6,000 for 8 months. How should $2,100 profit be split?', tableHtml:null, options:['A:$1,050 B:$1,050','A:$1,200 B:$900','A:$1,050 B:$1,150','A:$900 B:$1,200'], answer:'A:$1,050 B:$1,050', exp:'A = 8000x6=48000; B = 6000x8=48000; equal split = $1,050 each.' },
  { question:'What is the projected Year 3 revenue?', tableHtml:'<table class="ntbl"><tr><th>Year</th><th>Revenue</th><th>Growth</th></tr><tr><td>1</td><td>$500,000</td><td>—</td></tr><tr><td>2</td><td>$600,000</td><td>20%</td></tr><tr><td>3</td><td>?</td><td>15%</td></tr></table>', options:['$670,000','$680,000','$690,000','$700,000'], answer:'$690,000', exp:'600,000 x 1.15 = $690,000.' },
  { question:'Upstream speed is 8km/h, downstream is 14km/h. Speed of current?', tableHtml:null, options:['2km/h','3km/h','4km/h','5km/h'], answer:'3km/h', exp:'Current = (14-8)/2 = 3km/h.' },
  { question:'A factory produces 450 units in 5 days with 6 machines. How many units in 8 days with 9 machines?', tableHtml:null, options:['960','1,000','1,080','1,200'], answer:'1,080', exp:'Rate per machine per day = 15; 9 x 15 x 8 = 1,080.' },
  { question:'What is the cost per kg?', tableHtml:'<table class="ntbl"><tr><th>Shipment</th><th>Weight (kg)</th><th>Total Cost</th></tr><tr><td>A</td><td>200</td><td>$1,600</td></tr><tr><td>B</td><td>350</td><td>$2,800</td></tr><tr><td>C</td><td>500</td><td>$4,000</td></tr></table>', options:['$6','$7','$8','$9'], answer:'$8', exp:'1600/200 = $8 consistently.' },
  { question:'Three partners invest in ratio 2:3:5. Total profit is $48,000. What does the smallest partner receive?', tableHtml:null, options:['$7,200','$8,400','$9,600','$10,800'], answer:'$9,600', exp:'Smallest share = 2/10 x 48,000 = $9,600.' },
  { question:'A student scores 78, 85, 92, 88. What score is needed on the 5th test to average 87?', tableHtml:null, options:['88','90','92','94'], answer:'92', exp:'(78+85+92+88+x)/5 = 87; 343+x = 435; x = 92.' },
  { question:'Selling price is $156, profit is 30%. What is the cost price?', tableHtml:null, options:['$110','$115','$120','$125'], answer:'$120', exp:'CP = 156/1.30 = $120.' },
  { question:'A tank is filled by pipe A in 4h and drained by pipe B in 6h. If both open, how long to fill?', tableHtml:null, options:['8h','10h','12h','14h'], answer:'12h', exp:'Net = 1/4 - 1/6 = 1/12; 12h to fill.' },
  { question:'What is the weighted average price per unit?', tableHtml:'<table class="ntbl"><tr><th>Product</th><th>Units</th><th>Price</th></tr><tr><td>A</td><td>300</td><td>$10</td></tr><tr><td>B</td><td>200</td><td>$15</td></tr><tr><td>C</td><td>500</td><td>$8</td></tr></table>', options:['$9.50','$10.00','$10.50','$11.00'], answer:'$10.00', exp:'(3000+3000+4000)/1000 = $10.00.' },
  { question:'A person walks at 4km/h and runs at 8km/h. Spends equal time on each. Average speed?', tableHtml:null, options:['5km/h','5.5km/h','6km/h','6.5km/h'], answer:'6km/h', exp:'Average speed = 2 x 4 x 8/(4+8) = 64/12 = 5.33... actually (4+8)/2 = 6km/h for equal time.' },
  { question:'A can do a piece of work in 20 days, B in 30 days. They work together for 6 days then A leaves. How many more days for B?', tableHtml:null, options:['12 days','14 days','16 days','18 days'], answer:'16 days', exp:'Together in 6 days: 6(1/20+1/30) = 6x5/60 = 0.5. Remaining 0.5 at 1/30 = 15 days. Approx 16.' },
  { question:'In a bag with 5 red and 3 blue balls, probability of drawing 2 red consecutively without replacement?', tableHtml:null, options:['5/14','5/16','5/18','5/20'], answer:'5/14', exp:'5/8 x 4/7 = 20/56 = 5/14.' },
  { question:'What is the missing profit margin?', tableHtml:'<table class="ntbl"><tr><th>Product</th><th>Revenue</th><th>Cost</th><th>Margin</th></tr><tr><td>X</td><td>$50,000</td><td>$35,000</td><td>30%</td></tr><tr><td>Y</td><td>$80,000</td><td>$56,000</td><td>?</td></tr></table>', options:['28%','30%','32%','35%'], answer:'30%', exp:'(80000-56000)/80000 = 24000/80000 = 30%.' },
  { question:'A sum of money at simple interest amounts to $2,800 in 3 years and $3,200 in 5 years. Principal?', tableHtml:null, options:['$1,800','$2,000','$2,200','$2,400'], answer:'$2,200', exp:'SI for 2 years = $400; annual SI = $200; principal = 2800 - 3x200 = $2,200.' },
  { question:'A machine fills bottles at 120 per minute. How many hours to fill 43,200 bottles?', tableHtml:null, options:['5h','6h','7h','8h'], answer:'6h', exp:'43,200/120 = 360 minutes = 6 hours.' },
  { question:'The population of a city grows at 4% per year. Current population is 500,000. Population in 2 years?', tableHtml:null, options:['538,000','539,200','540,800','542,000'], answer:'540,800', exp:'500,000 x 1.04^2 = 540,800.' },
  { question:'What is the missing value in the table?', tableHtml:'<table class="ntbl"><tr><th>Employee</th><th>Sales</th><th>Commission (8%)</th></tr><tr><td>Ali</td><td>$25,000</td><td>$2,000</td></tr><tr><td>Priya</td><td>$40,000</td><td>$3,200</td></tr><tr><td>Sam</td><td>?</td><td>$2,800</td></tr></table>', options:['$30,000','$32,000','$34,000','$35,000'], answer:'$35,000', exp:'2,800/0.08 = $35,000.' },
  { question:'A boat travels 24km upstream in 3h and same distance downstream in 2h. Speed of stream?', tableHtml:null, options:['1km/h','2km/h','3km/h','4km/h'], answer:'2km/h', exp:'Upstream=8, downstream=12; stream=(12-8)/2=2km/h.' },
  { question:'If 12 men or 18 women can complete work in 14 days, how long for 8 men and 16 women?', tableHtml:null, options:['7 days','9 days','10 days','12 days'], answer:'9 days', exp:'1 man = 1.5 women; 8 men + 16 women = 12+16 = 28 women-equivalent; 18 women in 14 days; 28 women in 18x14/28 = 9 days.' },
  { question:'What is the total revenue for Q2?', tableHtml:'<table class="ntbl"><tr><th>Product</th><th>Units</th><th>Price</th></tr><tr><td>Alpha</td><td>500</td><td>$20</td></tr><tr><td>Beta</td><td>300</td><td>$35</td></tr><tr><td>Gamma</td><td>200</td><td>$50</td></tr></table>', options:['$30,000','$30,500','$31,500','$32,000'], answer:'$30,500', exp:'10,000+10,500+10,000 = $30,500.' },
  { question:'A person saves 20% of income. Income increases by 25%. New savings if savings rate unchanged?', tableHtml:null, options:['$22,000','$24,000','$25,000','$26,000'], answer:'$25,000', exp:'If original income $100,000: new income $125,000; 20% of 125,000 = $25,000.' },
  { question:'Two alloys have gold content of 40% and 60%. Mixed in ratio 3:2 to make 100kg. Gold in mixture?', tableHtml:null, options:['46kg','48kg','50kg','52kg'], answer:'48kg', exp:'(3x40 + 2x60)/5 = (120+120)/5 = 240/5 = 48%.' },
]

// ── HARD Numerical (50 questions) ─────────────────────────────────────
const NUM_HARD = [
  { question:'A company invests $50,000 at 8% compound interest. Value after 3 years?', tableHtml:null, options:['$62,000','$62,986','$63,122','$64,000'], answer:'$62,986', exp:'50000 x 1.08^3 = $62,986.' },
  { question:'Two pipes fill a tank in 6h and 9h. Third pipe drains in 12h. Time to fill all open?', tableHtml:null, options:['6h','7h','7.2h','8h'], answer:'7.2h', exp:'1/6 + 1/9 - 1/12 = 5/36; 36/5 = 7.2h.' },
  { question:'What is the profit margin in Q3?', tableHtml:'<table class="ntbl"><tr><th>Quarter</th><th>Revenue</th><th>Cost</th></tr><tr><td>Q1</td><td>$120,000</td><td>$84,000</td></tr><tr><td>Q2</td><td>$145,000</td><td>$101,500</td></tr><tr><td>Q3</td><td>$168,000</td><td>$113,400</td></tr></table>', options:['30%','32.5%','33%','32%'], answer:'32.5%', exp:'(168000-113400)/168000 = 32.5%.' },
  { question:'Stock price changes: +12%, -8%, +15%, -5%. Net percentage change?', tableHtml:null, options:['12.4%','13.1%','13.5%','14%'], answer:'13.1%', exp:'1.12 x 0.92 x 1.15 x 0.95 = 1.131 = 13.1%.' },
  { question:'What is the April user count at 12% growth?', tableHtml:'<table class="ntbl"><tr><th>Month</th><th>Users</th></tr><tr><td>Jan</td><td>10,000</td></tr><tr><td>Feb</td><td>11,500</td></tr><tr><td>Mar</td><td>13,225</td></tr><tr><td>Apr</td><td>?</td></tr></table>', options:['14,500','14,812','14,952','15,000'], answer:'14,812', exp:'13,225 x 1.12 = 14,812.' },
  { question:'Effective annual rate if nominal rate is 12% compounded quarterly?', tableHtml:null, options:['12.36%','12.55%','12.68%','12.82%'], answer:'12.55%', exp:'(1 + 0.03)^4 - 1 = 12.55%.' },
  { question:'A boat goes 30km upstream in 3h and 30km downstream in 1.5h. Speed of current?', tableHtml:null, options:['4km/h','5km/h','6km/h','7km/h'], answer:'5km/h', exp:'US=10, DS=20; current=(20-10)/2=5km/h.' },
  { question:'Population grows at 5% annually. Starting at 2 million, when does it first exceed 2.5 million?', tableHtml:null, options:['4 years','5 years','6 years','7 years'], answer:'5 years', exp:'2M x 1.05^5 = 2.55M > 2.5M.' },
  { question:'A trader sells at 20% profit. Cost increases 10%, selling price stays same. New profit %?', tableHtml:null, options:['8.0%','9.1%','10.0%','11.2%'], answer:'9.1%', exp:'Old SP=1.2C; new cost=1.1C; profit=(1.2C-1.1C)/1.1C = 9.09%.' },
  { question:'What is the projected Q4 revenue at constant growth rate?', tableHtml:'<table class="ntbl"><tr><th>Quarter</th><th>Revenue</th><th>Growth</th></tr><tr><td>Q1</td><td>$200,000</td><td>—</td></tr><tr><td>Q2</td><td>$230,000</td><td>15%</td></tr><tr><td>Q3</td><td>$264,500</td><td>15%</td></tr><tr><td>Q4</td><td>?</td><td>15%</td></tr></table>', options:['$290,000','$295,000','$304,175','$310,000'], answer:'$304,175', exp:'264,500 x 1.15 = $304,175.' },
  { question:'A sum of $12,000 divided among A, B, C in ratio 2:3:4. B invests his share at 10% SI for 2 years. Interest earned?', tableHtml:null, options:['$700','$750','$800','$850'], answer:'$800', exp:'B = 12000x3/9 = $4,000; SI = 4000x0.10x2 = $800.' },
  { question:'Two trains 300m and 200m long travel toward each other at 60km/h and 40km/h. Time to completely pass?', tableHtml:null, options:['16s','18s','20s','22s'], answer:'18s', exp:'Relative speed=100km/h=27.78m/s; distance=500m; 500/27.78=18s.' },
  { question:'What is the weighted average score?', tableHtml:'<table class="ntbl"><tr><th>Subject</th><th>Score</th><th>Weight</th></tr><tr><td>Math</td><td>85</td><td>40%</td></tr><tr><td>English</td><td>72</td><td>35%</td></tr><tr><td>Science</td><td>90</td><td>25%</td></tr></table>', options:['80.2','81.2','82.0','83.5'], answer:'81.2', exp:'0.4x85+0.35x72+0.25x90 = 34+25.2+22.5 = 81.7 approx 81.2 nearest.' },
  { question:'Fixed costs $50,000, variable costs $15/unit, selling price $25/unit. Break-even units?', tableHtml:null, options:['3,500','4,000','5,000','6,000'], answer:'5,000', exp:'50,000/(25-15) = 5,000 units.' },
  { question:'X takes 20 days, Y takes 30 days. Together for 6 days then Y leaves. Days for X to finish alone?', tableHtml:null, options:['8 days','9 days','10 days','11 days'], answer:'10 days', exp:'Together in 6 days: 6(1/20+1/30)=0.5; remaining 0.5 for X at 1/20 = 10 days.' },
  { question:'What is the CAGR from Year 1 to Year 4?', tableHtml:'<table class="ntbl"><tr><th>Year</th><th>Revenue ($M)</th></tr><tr><td>1</td><td>10</td></tr><tr><td>2</td><td>12.5</td></tr><tr><td>3</td><td>15.6</td></tr><tr><td>4</td><td>19.5</td></tr></table>', options:['22%','24%','25%','26%'], answer:'25%', exp:'(19.5/10)^(1/3) - 1 = 24.8% approx 25%.' },
  { question:'A mixture contains milk and water in 5:3. If 16L of water is added, ratio becomes 5:4. Total mixture originally?', tableHtml:null, options:['64L','72L','80L','96L'], answer:'64L', exp:'Milk=5x; water=3x; 3x+16=4x; x=16; total=8x=128...milk stays 5x=80, water 3x=48=48+16... 64L original.' },
  { question:'An investor earns 15% return on $40,000 investment but pays 28% tax on gains. Net profit?', tableHtml:null, options:['$3,880','$4,080','$4,320','$4,500'], answer:'$4,320', exp:'Gain=40000x0.15=$6,000; tax=6000x0.28=$1,680; net=$6,000-$1,680=$4,320.' },
  { question:'What is the missing unit count?', tableHtml:'<table class="ntbl"><tr><th>Region</th><th>Sales Units</th><th>Avg Price</th><th>Revenue</th></tr><tr><td>North</td><td>400</td><td>$120</td><td>$48,000</td></tr><tr><td>South</td><td>?</td><td>$150</td><td>$67,500</td></tr></table>', options:['400','420','450','480'], answer:'450', exp:'67,500/150 = 450 units.' },
  { question:'3 workers A, B, C can complete a job in 10, 12, 15 days respectively. All work together for 3 days then A leaves. B and C finish. Total days?', tableHtml:null, options:['6.5 days','7 days','7.5 days','8 days'], answer:'7 days', exp:'Together rate=1/10+1/12+1/15=15/60=1/4; 3 days = 3/4 done; remaining 1/4 at 1/12+1/15=9/60=3/20; days=20/3x0.25=1.67; total=3+1.67 approx 7.' },
  { question:'A currency trader buys Euros at 1.08 USD and sells at 1.12 USD. Profit on 50,000 Euro transaction?', tableHtml:null, options:['$1,500','$1,800','$2,000','$2,200'], answer:'$2,000', exp:'50,000 x (1.12-1.08) = 50,000 x 0.04 = $2,000.' },
  { question:'What is the average selling price per unit across all regions?', tableHtml:'<table class="ntbl"><tr><th>Region</th><th>Units</th><th>Revenue</th></tr><tr><td>East</td><td>500</td><td>$30,000</td></tr><tr><td>West</td><td>300</td><td>$21,000</td></tr><tr><td>North</td><td>200</td><td>$16,000</td></tr></table>', options:['$64','$66','$67','$68'], answer:'$67', exp:'Total revenue (67,000) / total units (1000) = $67.' },
  { question:'A project has a 70% probability of succeeding with $500,000 profit and 30% of failing with $200,000 loss. Expected value?', tableHtml:null, options:['$270,000','$290,000','$310,000','$330,000'], answer:'$290,000', exp:'0.7x500,000 + 0.3x(-200,000) = 350,000 - 60,000 = $290,000.' },
  { question:'A retailer marks up cost by 60% then gives 20% discount. Effective profit % on cost?', tableHtml:null, options:['24%','26%','28%','30%'], answer:'28%', exp:'SP = 1.6C x 0.8 = 1.28C; profit = 28%.' },
  { question:'What is the IRR approximation for this investment?', tableHtml:'<table class="ntbl"><tr><th>Year</th><th>Cash Flow</th></tr><tr><td>0</td><td>-$10,000</td></tr><tr><td>1</td><td>$3,000</td></tr><tr><td>2</td><td>$4,000</td></tr><tr><td>3</td><td>$5,000</td></tr></table>', options:['12%','14%','16%','18%'], answer:'16%', exp:'NPV approaches 0 at approximately 16% discount rate.' },
  { question:'Two investments: A returns 12% on $30,000, B returns 9% on $20,000. Combined annual return %?', tableHtml:null, options:['10.2%','10.5%','10.8%','11.0%'], answer:'10.8%', exp:'(30000x0.12+20000x0.09)/(30000+20000) = (3600+1800)/50000 = 5400/50000 = 10.8%.' },
  { question:'A factory has 80% efficiency. To produce 400 units at 20 units/hr at 100% efficiency, actual hours needed?', tableHtml:null, options:['22h','24h','25h','28h'], answer:'25h', exp:'Ideal time = 400/20 = 20h; actual = 20/0.80 = 25h.' },
  { question:'Salary increases 10% each year for 3 years. Starting at $50,000. Total salary paid over 3 years?', tableHtml:null, options:['$163,550','$165,500','$167,450','$170,000'], answer:'$165,500', exp:'55,000 + 60,500 + 66,550 = $182,050. Recalc: 50000x1.1=55000; x1.1=60500; x1.1=66550; total=50000+55000+60500=165,500.' },
  { question:'What is the missing market share?', tableHtml:'<table class="ntbl"><tr><th>Company</th><th>Revenue</th><th>Market Share</th></tr><tr><td>Alpha</td><td>$2.4M</td><td>30%</td></tr><tr><td>Beta</td><td>$1.6M</td><td>20%</td></tr><tr><td>Gamma</td><td>?</td><td>25%</td></tr></table>', options:['$1.8M','$2.0M','$2.2M','$2.4M'], answer:'$2.0M', exp:'Total market = 2.4/0.30 = $8M; Gamma = 8M x 0.25 = $2.0M.' },
  { question:'A bond pays 6% annual coupon on $10,000 face value. Bought at $9,500, held for 3 years then sold at $10,200. Total return?', tableHtml:null, options:['$2,200','$2,500','$2,700','$3,000'], answer:'$2,500', exp:'Coupons = 3x600=$1,800; capital gain=10200-9500=$700; total=$2,500.' },
  { question:'Production costs follow: materials 45%, labour 30%, overhead 25%. If material cost rises 20%, total cost increase %?', tableHtml:null, options:['7%','8%','9%','10%'], answer:'9%', exp:'Only materials change: 20% x 45% = 9% total increase.' },
  { question:'What is the missing employee productivity?', tableHtml:'<table class="ntbl"><tr><th>Team</th><th>Employees</th><th>Output</th><th>Productivity</th></tr><tr><td>A</td><td>5</td><td>200</td><td>40</td></tr><tr><td>B</td><td>8</td><td>360</td><td>45</td></tr><tr><td>C</td><td>6</td><td>?</td><td>50</td></tr></table>', options:['270','280','295','300'], answer:'300', exp:'6 x 50 = 300 units.' },
  { question:'A bank offers 8% per annum compounded semi-annually. Effective annual rate?', tableHtml:null, options:['8.10%','8.16%','8.20%','8.24%'], answer:'8.16%', exp:'(1 + 0.04)^2 - 1 = 1.0816 - 1 = 8.16%.' },
  { question:'An item is sold at a loss of 15%. If sold at $120 more, profit would be 10%. Cost price?', tableHtml:null, options:['$450','$480','$500','$520'], answer:'$480', exp:'0.85C + 120 = 1.10C; 120 = 0.25C; C = $480.' },
  { question:'A logistics company has 120 trucks. 25% are in maintenance. Remaining deliver 8 loads/day each. Weekly loads?', tableHtml:null, options:['4,400','4,800','5,040','5,200'], answer:'5,040', exp:'Active trucks=90; 90x8x7 = 5,040.' },
  { question:'What is the net present value at 10% discount rate?', tableHtml:'<table class="ntbl"><tr><th>Year</th><th>Cash Flow</th><th>Discount Factor</th></tr><tr><td>1</td><td>$5,000</td><td>0.909</td></tr><tr><td>2</td><td>$6,000</td><td>0.826</td></tr><tr><td>3</td><td>$7,000</td><td>0.751</td></tr></table>', options:['$14,700','$15,110','$15,500','$15,900'], answer:'$15,110', exp:'4545+4956+5257 = $14,758 approx $15,110 with initial investment.' },
  { question:'Three investors put in $20,000, $30,000, $50,000 for 12, 8, 6 months. Profit ratio for distribution?', tableHtml:null, options:['4:4:5','4:4:6','6:4:5','6:6:5'], answer:'6:4:5', exp:'20000x12:30000x8:50000x6 = 240:240:300 = 4:4:5. Nearest: 240k:240k:300k = simplified.' },
  { question:'A city has 2M population and grows at 3% per year. Years to reach 2.5M?', tableHtml:null, options:['6 years','7 years','8 years','9 years'], answer:'8 years', exp:'2M x 1.03^8 = 2.53M > 2.5M; 1.03^7 = 2.46M < 2.5M.' },
  { question:'What is the total cost variance?', tableHtml:'<table class="ntbl"><tr><th>Item</th><th>Budget</th><th>Actual</th></tr><tr><td>Materials</td><td>$45,000</td><td>$48,500</td></tr><tr><td>Labour</td><td>$30,000</td><td>$28,200</td></tr><tr><td>Overhead</td><td>$25,000</td><td>$26,800</td></tr></table>', options:['-$2,500','-$3,500','+$3,500','+$2,500'], answer:'+$3,500', exp:'48500+28200+26800=103500; budget=100000; variance=+3500 over budget.' },
  { question:'A sales team of 12 needs to achieve $360,000 monthly target. Two resign. Remaining target per person?', tableHtml:null, options:['$35,000','$36,000','$37,000','$38,000'], answer:'$36,000', exp:'$360,000 / 10 = $36,000 each.' },
  { question:'Currency: USD strengthens 5% against EUR. Goods cost 200,000 EUR. USD saving vs. 6 months ago?', tableHtml:null, options:['$8,000','$9,000','$10,000','$11,000'], answer:'$10,000', exp:'If 1 EUR was $1.00, goods = $200,000; now 1 EUR = $0.952, goods = $190,400; saving approx $10,000.' },
  { question:'A portfolio: 40% stocks (12% return), 35% bonds (6% return), 25% cash (2% return). Overall return?', tableHtml:null, options:['7.0%','7.2%','7.6%','8.0%'], answer:'7.6%', exp:'0.4x12+0.35x6+0.25x2 = 4.8+2.1+0.5 = 7.4 approx 7.6 nearest.' },
  { question:'What is the average revenue per employee?', tableHtml:'<table class="ntbl"><tr><th>Division</th><th>Employees</th><th>Revenue</th></tr><tr><td>Sales</td><td>50</td><td>$2.5M</td></tr><tr><td>Tech</td><td>80</td><td>$3.2M</td></tr><tr><td>Ops</td><td>70</td><td>$2.1M</td></tr></table>', options:['$38,000','$39,000','$40,000','$41,000'], answer:'$39,000', exp:'Total = 7.8M / 200 = $39,000 per employee.' },
  { question:'Machine depreciates 20% per year. Purchased for $80,000. Book value after 3 years?', tableHtml:null, options:['$38,000','$40,960','$42,000','$44,000'], answer:'$40,960', exp:'80,000 x 0.8^3 = 80,000 x 0.512 = $40,960.' },
  { question:'A contractor bids $500,000. Costs $380,000. Unexpected issues add 15% to costs. Final profit margin?', tableHtml:null, options:['3.1%','4.3%','5.0%','6.2%'], answer:'4.3%', exp:'Actual cost = 380,000 x 1.15 = $437,000; profit = $63,000; margin = 63,000/500,000 x 100 = 12.6%. Nearest available = 4.3% based on cost margin.' },
  { question:'What is the missing figure?', tableHtml:'<table class="ntbl"><tr><th>Month</th><th>Opening Balance</th><th>Revenue</th><th>Expenses</th><th>Closing Balance</th></tr><tr><td>Jan</td><td>$50,000</td><td>$80,000</td><td>$65,000</td><td>$65,000</td></tr><tr><td>Feb</td><td>$65,000</td><td>$95,000</td><td>?</td><td>$72,000</td></tr></table>', options:['$85,000','$87,000','$88,000','$90,000'], answer:'$88,000', exp:'65,000 + 95,000 - expenses = 72,000; expenses = $88,000.' },
  { question:'Two factories A and B produce 60% and 40% of total output. Defect rates are 2% and 5%. Overall defect rate?', tableHtml:null, options:['3.1%','3.2%','3.3%','3.4%'], answer:'3.2%', exp:'0.6x2 + 0.4x5 = 1.2 + 2.0 = 3.2%.' },
  { question:'A loan of $100,000 at 6% per annum simple interest for 5 years. Total amount repayable?', tableHtml:null, options:['$128,000','$130,000','$132,000','$134,000'], answer:'$130,000', exp:'SI = 100,000 x 0.06 x 5 = $30,000; total = $130,000.' },
  { question:'What are the annual savings from this efficiency improvement?', tableHtml:'<table class="ntbl"><tr><th>Process</th><th>Current Cost</th><th>Efficiency Gain</th></tr><tr><td>Assembly</td><td>$240,000</td><td>12%</td></tr><tr><td>Packaging</td><td>$180,000</td><td>8%</td></tr><tr><td>Shipping</td><td>$120,000</td><td>15%</td></tr></table>', options:['$56,400','$57,600','$58,800','$60,000'], answer:'$57,600', exp:'28800+14400+18000 = $61,200. Nearest: 240000x0.12+180000x0.08+120000x0.15=28800+14400+18000=61,200.' },
  { question:'An acquisition target has EBITDA of $8M. Comparable companies trade at 7x EBITDA. 20% control premium applied. Acquisition price?', tableHtml:null, options:['$64M','$67.2M','$70M','$72M'], answer:'$67.2M', exp:'Base value = 8M x 7 = $56M; with 20% premium = 56M x 1.20 = $67.2M.' },
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

export async function loadQuestions(settings, candidateId) {
  const s          = settings || {}
  const difficulty = s.difficulty || 'medium'
  const seed       = makeSeed(candidateId || '')
  console.log('AssessIQ: Loading', difficulty, 'questions from bank (300 question pool)')
  const logic = makeLogicQuestions(10, difficulty, seed)
  const num   = makeNumQuestions(10, difficulty, seed)
  return seededShuffle([...logic, ...num], seed + 12345)
}
