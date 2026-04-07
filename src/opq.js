// ── OPQ-Style Personality Assessment ─────────────────────────────────
// 30 statements across 10 personality dimensions (3 per dimension)
// Scale: 1=Strongly Disagree, 2=Disagree, 3=Neutral, 4=Agree, 5=Strongly Agree
// Based on occupational personality research (Big Five + work-specific traits)

export const OPQ_DIMENSIONS = [
  { id: 'leadership',    label: 'Leadership Drive',        icon: '👑', desc: 'Takes charge, directs others, comfortable with authority' },
  { id: 'innovation',    label: 'Innovation & Creativity', icon: '💡', desc: 'Generates new ideas, challenges convention, embraces change' },
  { id: 'resilience',    label: 'Resilience & Composure',  icon: '🧱', desc: 'Stays calm under pressure, recovers from setbacks' },
  { id: 'empathy',       label: 'People Orientation',      icon: '🤝', desc: 'Understands others, builds relationships, shows care' },
  { id: 'achievement',   label: 'Achievement Drive',       icon: '🎯', desc: 'Sets high standards, competitive, results-focused' },
  { id: 'analytical',    label: 'Analytical Thinking',     icon: '🔍', desc: 'Data-driven, systematic, thorough in problem solving' },
  { id: 'influence',     label: 'Persuasion & Influence',  icon: '📢', desc: 'Convinces others, negotiates, builds buy-in' },
  { id: 'structure',     label: 'Planning & Structure',    icon: '📋', desc: 'Organised, methodical, follows through on plans' },
  { id: 'adaptability',  label: 'Adaptability',            icon: '🔄', desc: 'Flexible, comfortable with ambiguity, adjusts quickly' },
  { id: 'integrity',     label: 'Integrity & Ethics',      icon: '⚖️',  desc: 'Principled, transparent, does the right thing' },
]

export const OPQ_STATEMENTS = [
  // Leadership Drive
  { id: 'OL1', dimension: 'leadership', reverse: false, statement: 'I naturally step up to lead when a group lacks direction.' },
  { id: 'OL2', dimension: 'leadership', reverse: false, statement: 'I am comfortable making decisions that others will be held accountable to.' },
  { id: 'OL3', dimension: 'leadership', reverse: true,  statement: 'I prefer to follow clear instructions rather than set the direction myself.' },

  // Innovation
  { id: 'OI1', dimension: 'innovation', reverse: false, statement: 'I regularly challenge existing processes and propose better ways of working.' },
  { id: 'OI2', dimension: 'innovation', reverse: false, statement: 'I find ambiguous, open-ended problems more energising than routine tasks.' },
  { id: 'OI3', dimension: 'innovation', reverse: true,  statement: 'I prefer proven approaches over experimental ones, especially when stakes are high.' },

  // Resilience
  { id: 'OR1', dimension: 'resilience', reverse: false, statement: 'When things go wrong under pressure, I remain focused and solution-oriented.' },
  { id: 'OR2', dimension: 'resilience', reverse: false, statement: 'I recover quickly from criticism or setbacks without dwelling on them.' },
  { id: 'OR3', dimension: 'resilience', reverse: true,  statement: 'I find it difficult to move on from a significant failure without it affecting my performance.' },

  // Empathy
  { id: 'OE1', dimension: 'empathy', reverse: false, statement: 'I pick up on how others are feeling even when they do not say it directly.' },
  { id: 'OE2', dimension: 'empathy', reverse: false, statement: 'I invest significant time in understanding what motivates each person on my team individually.' },
  { id: 'OE3', dimension: 'empathy', reverse: true,  statement: 'I believe emotions should generally be kept separate from professional decision-making.' },

  // Achievement
  { id: 'OA1', dimension: 'achievement', reverse: false, statement: 'I consistently set targets for myself that push beyond what is expected.' },
  { id: 'OA2', dimension: 'achievement', reverse: false, statement: 'I find it genuinely difficult to accept work that does not meet my own quality standards.' },
  { id: 'OA3', dimension: 'achievement', reverse: true,  statement: 'I believe maintaining team wellbeing is more important than hitting stretch targets.' },

  // Analytical
  { id: 'ON1', dimension: 'analytical', reverse: false, statement: 'Before making decisions, I like to gather and analyse as much relevant data as possible.' },
  { id: 'ON2', dimension: 'analytical', reverse: false, statement: 'I find it uncomfortable to make significant decisions without sufficient evidence.' },
  { id: 'ON3', dimension: 'analytical', reverse: true,  statement: 'I trust my instincts over data analysis when the two are in conflict.' },

  // Influence
  { id: 'OP1', dimension: 'influence', reverse: false, statement: 'I am able to bring sceptical stakeholders around to my position through reasoned argument.' },
  { id: 'OP2', dimension: 'influence', reverse: false, statement: 'I actively adapt my communication style depending on who I am trying to persuade.' },
  { id: 'OP3', dimension: 'influence', reverse: true,  statement: 'I find it draining to have to constantly convince others of things I believe are obviously right.' },

  // Structure
  { id: 'OS1', dimension: 'structure', reverse: false, statement: 'I plan my work carefully and follow through systematically on every commitment I make.' },
  { id: 'OS2', dimension: 'structure', reverse: false, statement: 'I find it satisfying to bring order and clarity to chaotic or disorganised situations.' },
  { id: 'OS3', dimension: 'structure', reverse: true,  statement: 'I often find rigid processes and procedures slow me down more than they help.' },

  // Adaptability
  { id: 'OD1', dimension: 'adaptability', reverse: false, statement: 'I adjust quickly and effectively when plans change at short notice.' },
  { id: 'OD2', dimension: 'adaptability', reverse: false, statement: 'I perform well in environments where priorities shift frequently.' },
  { id: 'OD3', dimension: 'adaptability', reverse: true,  statement: 'I find it unsettling when I cannot predict what my week will look like.' },

  // Integrity
  { id: 'OT1', dimension: 'integrity', reverse: false, statement: 'I would raise a concern about an unethical practice even if doing so created personal risk for me.' },
  { id: 'OT2', dimension: 'integrity', reverse: false, statement: 'I am transparent about mistakes I have made, even when I could avoid disclosure.' },
  { id: 'OT3', dimension: 'integrity', reverse: true,  statement: 'In competitive environments, some degree of information withholding is necessary and justified.' },
]

export function scoreOPQ(responses) {
  // responses: { statementId: 1-5 }
  const dimScores = {}
  OPQ_DIMENSIONS.forEach(d => { dimScores[d.id] = { raw: 0, count: 0 } })

  OPQ_STATEMENTS.forEach(s => {
    const val = responses[s.id]
    if (val === undefined || val === null) return
    const score = s.reverse ? (6 - val) : val  // reverse score for reversed items
    dimScores[s.dimension].raw += score
    dimScores[s.dimension].count += 1
  })

  const profile = {}
  OPQ_DIMENSIONS.forEach(d => {
    const ds = dimScores[d.id]
    const avg = ds.count > 0 ? ds.raw / ds.count : 3
    const pct = Math.round(((avg - 1) / 4) * 100)  // 1-5 scale -> 0-100%
    const label = pct >= 75 ? 'Very High' : pct >= 60 ? 'High' : pct >= 40 ? 'Moderate' : pct >= 25 ? 'Low' : 'Very Low'
    profile[d.id] = { pct, label, avg: Math.round(avg * 10) / 10 }
  })

  return profile
}
