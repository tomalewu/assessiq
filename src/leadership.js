// ── Leadership SJT Question Bank ──────────────────────────────────────
// Each option scores 0-3. Candidate never sees scores.
// Dimensions: conflict, delegation, motivation, decision, communication

export const DIMENSIONS = [
  { id: 'conflict',      label: 'Conflict Resolution',       icon: '🤝' },
  { id: 'delegation',    label: 'Delegation & Empowerment',  icon: '📋' },
  { id: 'motivation',    label: 'Team Motivation',           icon: '🔥' },
  { id: 'decision',      label: 'Decision Making',           icon: '⚡' },
  { id: 'communication', label: 'Communication',             icon: '💬' },
]

export const SJT_QUESTIONS = [
  // Conflict Resolution (8 questions)
  {
    id: 'C1', dimension: 'conflict',
    scenario: 'Two of your team members are in open conflict and refusing to collaborate on a shared project, causing delays. What do you do first?',
    options: [
      { text: 'Tell them both to act professionally and get on with the work.', score: 0 },
      { text: 'Meet with each person separately to understand their perspective before bringing them together.', score: 3 },
      { text: 'Reassign the project so they no longer need to work together.', score: 1 },
      { text: 'Ask a senior colleague to mediate on your behalf.', score: 1 },
    ]
  },
  {
    id: 'C2', dimension: 'conflict',
    scenario: 'A team member comes to you saying they feel they are being treated unfairly by another colleague. You have not witnessed this yourself. What do you do?',
    options: [
      { text: 'Reassure them it is probably a misunderstanding and ask them to let it go.', score: 0 },
      { text: 'Immediately confront the accused colleague on behalf of the complainant.', score: 1 },
      { text: 'Listen carefully, take notes, and open a fair and confidential investigation.', score: 3 },
      { text: 'Escalate immediately to HR without further investigation.', score: 2 },
    ]
  },
  {
    id: 'C3', dimension: 'conflict',
    scenario: 'During a team meeting, two members get into a heated argument in front of the whole group. How do you handle it?',
    options: [
      { text: 'Let them finish — it is important to express feelings.', score: 0 },
      { text: 'Firmly but calmly pause the discussion and reschedule a private meeting with both of them.', score: 3 },
      { text: 'Side with the person you believe is correct to end the argument quickly.', score: 0 },
      { text: 'Ask the rest of the team to vote on who is right.', score: 0 },
    ]
  },
  {
    id: 'C4', dimension: 'conflict',
    scenario: 'You discover that two departments have been blaming each other for a recurring problem. How do you approach this?',
    options: [
      { text: 'Bring both department heads together to map the process and identify root cause jointly.', score: 3 },
      { text: 'Conduct your own investigation and announce who is at fault.', score: 1 },
      { text: 'Ignore it — interdepartmental politics are not your concern.', score: 0 },
      { text: 'Ask each department to write a report justifying their position.', score: 1 },
    ]
  },
  {
    id: 'C5', dimension: 'conflict',
    scenario: 'A strong performer on your team frequently clashes with others due to their blunt communication style. What do you do?',
    options: [
      { text: 'Do nothing — their results speak for themselves.', score: 0 },
      { text: 'Have a private coaching conversation about communication style and its impact on the team.', score: 3 },
      { text: 'Warn them that continued behaviour may affect their performance review.', score: 1 },
      { text: 'Ask the team to be more tolerant of different personalities.', score: 1 },
    ]
  },
  {
    id: 'C6', dimension: 'conflict',
    scenario: 'You are involved in a disagreement with a peer manager about how to handle a cross-team issue. You believe you are right. What do you do?',
    options: [
      { text: 'Escalate to your manager immediately to get a decision made.', score: 1 },
      { text: 'Proceed with your approach without telling them.', score: 0 },
      { text: 'Seek to understand their reasoning fully, share your perspective, and try to reach a joint decision.', score: 3 },
      { text: 'Agree with them to avoid conflict even if you disagree.', score: 0 },
    ]
  },
  {
    id: 'C7', dimension: 'conflict',
    scenario: 'A team member is spreading negativity and complaining to colleagues about management decisions. How do you respond?',
    options: [
      { text: 'Address it in the next team meeting so everyone hears the same message.', score: 1 },
      { text: 'Ignore it and hope it passes on its own.', score: 0 },
      { text: 'Have a direct private conversation to understand their concerns and address them honestly.', score: 3 },
      { text: 'Document it and escalate to HR immediately.', score: 1 },
    ]
  },
  {
    id: 'C8', dimension: 'conflict',
    scenario: 'Two high-performing employees both want the same development opportunity but only one can go. How do you decide?',
    options: [
      { text: 'Give it to the more senior employee automatically.', score: 0 },
      { text: 'Use a fair and transparent criteria-based process and communicate the decision clearly to both.', score: 3 },
      { text: 'Flip a coin to keep it fair.', score: 0 },
      { text: 'Ask them to compete for it through a task or presentation.', score: 2 },
    ]
  },

  // Delegation & Empowerment (8 questions)
  {
    id: 'D1', dimension: 'delegation',
    scenario: 'You have too much work and need to delegate a high-visibility project to a capable team member. What is your approach?',
    options: [
      { text: 'Assign it but check in every hour to make sure they are doing it correctly.', score: 1 },
      { text: 'Brief them clearly on expectations, give them autonomy, and set agreed checkpoints.', score: 3 },
      { text: 'Do it yourself — it is too important to risk.', score: 0 },
      { text: 'Ask for volunteers and give it to whoever responds first.', score: 1 },
    ]
  },
  {
    id: 'D2', dimension: 'delegation',
    scenario: 'A team member you have delegated to comes back with a solution that works but is different from how you would have done it. What do you do?',
    options: [
      { text: 'Ask them to redo it your way — consistency matters.', score: 0 },
      { text: 'Accept their approach if it meets the objective, and acknowledge their initiative.', score: 3 },
      { text: 'Do it yourself going forward to ensure quality.', score: 0 },
      { text: 'Accept it but note it in their review as a lack of alignment.', score: 0 },
    ]
  },
  {
    id: 'D3', dimension: 'delegation',
    scenario: 'You notice a team member is consistently underutilised and not stretched in their role. What do you do?',
    options: [
      { text: 'Add more work to their plate without explanation.', score: 0 },
      { text: 'Have a conversation about their ambitions and delegate stretch tasks that align with their development.', score: 3 },
      { text: 'Leave it — if they are not complaining, they are happy.', score: 0 },
      { text: 'Ask other managers if they need help from this person.', score: 1 },
    ]
  },
  {
    id: 'D4', dimension: 'delegation',
    scenario: 'You are about to go on leave for two weeks. How do you ensure the team continues to function well?',
    options: [
      { text: 'Stay contactable at all times during your leave in case something goes wrong.', score: 1 },
      { text: 'Designate a capable team lead, brief them thoroughly, and trust them to manage.', score: 3 },
      { text: 'Delay all important decisions until you return.', score: 0 },
      { text: 'Ask your manager to cover your responsibilities directly.', score: 0 },
    ]
  },
  {
    id: 'D5', dimension: 'delegation',
    scenario: 'A team member makes an error on a task you delegated to them. How do you handle it?',
    options: [
      { text: 'Take back the responsibility and handle it yourself from now on.', score: 0 },
      { text: 'Use it as a learning moment — debrief together, fix the error, and adjust support level going forward.', score: 3 },
      { text: 'Report the error to your manager and note it in the person\'s file.', score: 1 },
      { text: 'Blame the team member if asked about the error by senior management.', score: 0 },
    ]
  },
  {
    id: 'D6', dimension: 'delegation',
    scenario: 'You are asked to grow your team\'s capability. What is your primary approach?',
    options: [
      { text: 'Send team members on formal training courses.', score: 1 },
      { text: 'Delegate progressively more challenging work and coach them through it.', score: 3 },
      { text: 'Hire more experienced people to raise the overall team level.', score: 1 },
      { text: 'Set higher performance targets to force growth.', score: 0 },
    ]
  },
  {
    id: 'D7', dimension: 'delegation',
    scenario: 'A junior team member asks to take ownership of a client-facing task they have not done before. What do you do?',
    options: [
      { text: 'Decline — client-facing work is too risky for inexperienced staff.', score: 0 },
      { text: 'Allow it with appropriate preparation, clear briefing, and a safety net in place.', score: 3 },
      { text: 'Allow it without any support — they need to learn by doing.', score: 1 },
      { text: 'Agree but attend every meeting with them to supervise.', score: 1 },
    ]
  },
  {
    id: 'D8', dimension: 'delegation',
    scenario: 'Your team consistently depends on you to make all decisions, even small ones. What do you do?',
    options: [
      { text: 'Continue to make decisions — that is your job as manager.', score: 0 },
      { text: 'Work on building their confidence and decision-making skills through coaching and clear boundaries of authority.', score: 3 },
      { text: 'Tell them to make decisions themselves without guidance.', score: 1 },
      { text: 'Escalate the issue to HR as a team capability problem.', score: 0 },
    ]
  },

  // Team Motivation (8 questions)
  {
    id: 'M1', dimension: 'motivation',
    scenario: 'Team morale has dropped following a difficult period of change. What do you do?',
    options: [
      { text: 'Organise a team social event to boost spirits.', score: 1 },
      { text: 'Acknowledge the difficulty honestly, listen to concerns, and involve the team in shaping the way forward.', score: 3 },
      { text: 'Remind the team they are fortunate to have jobs and should stay focused.', score: 0 },
      { text: 'Wait for morale to recover naturally once things stabilise.', score: 0 },
    ]
  },
  {
    id: 'M2', dimension: 'motivation',
    scenario: 'A previously high-performing team member has become disengaged and their output has declined. What is your approach?',
    options: [
      { text: 'Put them on a formal performance improvement plan immediately.', score: 0 },
      { text: 'Have a private, empathetic conversation to understand what has changed and how you can support them.', score: 3 },
      { text: 'Publicly recognise other team members to motivate them by comparison.', score: 0 },
      { text: 'Give them space — they will come round on their own.', score: 0 },
    ]
  },
  {
    id: 'M3', dimension: 'motivation',
    scenario: 'Your team has just delivered an excellent result under significant pressure. What do you do?',
    options: [
      { text: 'Move quickly to the next challenge — celebrating slows momentum.', score: 0 },
      { text: 'Recognise individuals specifically for their contributions and celebrate the team achievement meaningfully.', score: 3 },
      { text: 'Send a brief thank you email to the group.', score: 1 },
      { text: 'Highlight the team\'s success to senior leadership and take credit as their manager.', score: 0 },
    ]
  },
  {
    id: 'M4', dimension: 'motivation',
    scenario: 'A team member tells you they no longer feel challenged in their role and are considering leaving. What do you do?',
    options: [
      { text: 'Tell them to be patient — opportunities will come when they arise.', score: 0 },
      { text: 'Have a career conversation and actively work to create stretch opportunities within or beyond your team.', score: 3 },
      { text: 'Wish them well if they decide to leave — you cannot force people to stay.', score: 1 },
      { text: 'Offer them a salary increase to retain them.', score: 1 },
    ]
  },
  {
    id: 'M5', dimension: 'motivation',
    scenario: 'Your team is working on a long project with no visible end in sight. Energy is fading. What do you do?',
    options: [
      { text: 'Push them harder — deadlines do not move.', score: 0 },
      { text: 'Break the project into milestones, celebrate small wins, and keep the team connected to the purpose.', score: 3 },
      { text: 'Remind them of the consequences of failure to reinvigorate focus.', score: 0 },
      { text: 'Reduce their workload temporarily to give them a break.', score: 1 },
    ]
  },
  {
    id: 'M6', dimension: 'motivation',
    scenario: 'You manage a diverse team with very different motivations — some want recognition, others want autonomy, others want security. How do you approach motivation?',
    options: [
      { text: 'Use the same approach for everyone to be fair.', score: 0 },
      { text: 'Tailor your approach to each individual based on what drives them personally.', score: 3 },
      { text: 'Focus on monetary rewards — money motivates everyone.', score: 0 },
      { text: 'Ask HR to run a motivation survey and act on the results.', score: 1 },
    ]
  },
  {
    id: 'M7', dimension: 'motivation',
    scenario: 'Your organisation has made an unpopular decision that you must communicate and implement with your team. How do you handle it?',
    options: [
      { text: 'Communicate it as directly as possible without your own opinion.', score: 1 },
      { text: 'Pretend you agree with it to maintain team trust in leadership.', score: 0 },
      { text: 'Communicate it honestly, acknowledge concerns, explain the rationale, and support your team through it.', score: 3 },
      { text: 'Let the team find out through official channels — it is not your place to communicate this.', score: 0 },
    ]
  },
  {
    id: 'M8', dimension: 'motivation',
    scenario: 'A team member repeatedly volunteers for extra work and is showing signs of burnout. What do you do?',
    options: [
      { text: 'Let them continue — they are clearly highly motivated.', score: 0 },
      { text: 'Have a caring conversation, help them set boundaries, and adjust their workload.', score: 3 },
      { text: 'Tell them to stop volunteering so others get a chance.', score: 1 },
      { text: 'Note their commitment positively in their performance review and do nothing else.', score: 1 },
    ]
  },

  // Decision Making (8 questions)
  {
    id: 'DE1', dimension: 'decision',
    scenario: 'You need to make an important decision but you do not have all the information you need. The deadline is tomorrow. What do you do?',
    options: [
      { text: 'Wait until you have complete information — a wrong decision is worse than a late one.', score: 0 },
      { text: 'Gather the most critical information quickly, assess the risks, and make a well-reasoned decision with the data available.', score: 3 },
      { text: 'Ask your manager to make the decision for you.', score: 0 },
      { text: 'Make a decision randomly — all decisions are guesses anyway.', score: 0 },
    ]
  },
  {
    id: 'DE2', dimension: 'decision',
    scenario: 'Your team is divided on the best approach to a problem. How do you reach a decision?',
    options: [
      { text: 'Put it to a vote — majority rules.', score: 1 },
      { text: 'Make the decision yourself without consulting the team.', score: 0 },
      { text: 'Facilitate a structured discussion, weigh perspectives, and make a clear decision with shared rationale.', score: 3 },
      { text: 'Ask an external expert to decide for you.', score: 1 },
    ]
  },
  {
    id: 'DE3', dimension: 'decision',
    scenario: 'You made a decision that turned out to be wrong and it has impacted the team negatively. What do you do?',
    options: [
      { text: 'Find a way to shift responsibility to other factors or people.', score: 0 },
      { text: 'Acknowledge the mistake openly, take responsibility, and focus on what can be done to correct it.', score: 3 },
      { text: 'Say nothing and hope it resolves itself.', score: 0 },
      { text: 'Apologise once and move on quickly.', score: 1 },
    ]
  },
  {
    id: 'DE4', dimension: 'decision',
    scenario: 'You are under pressure from senior management to take a shortcut that could compromise quality. What do you do?',
    options: [
      { text: 'Comply — senior management knows best.', score: 0 },
      { text: 'Refuse outright and do not engage further.', score: 1 },
      { text: 'Raise your concerns with evidence, propose alternatives, and escalate if necessary.', score: 3 },
      { text: 'Agree in the meeting and then do it your way anyway.', score: 0 },
    ]
  },
  {
    id: 'DE5', dimension: 'decision',
    scenario: 'You must choose between two good candidates for a promotion. How do you decide?',
    options: [
      { text: 'Choose the one you personally get along with better.', score: 0 },
      { text: 'Use a structured and transparent criteria-based evaluation and document your rationale.', score: 3 },
      { text: 'Promote whoever has been in the role longer.', score: 0 },
      { text: 'Ask senior management to make the decision to avoid responsibility.', score: 0 },
    ]
  },
  {
    id: 'DE6', dimension: 'decision',
    scenario: 'A team member proposes an innovative idea that carries some risk. How do you respond?',
    options: [
      { text: 'Reject it — the risk is not worth it.', score: 0 },
      { text: 'Approve it immediately to show you support innovation.', score: 1 },
      { text: 'Evaluate the idea seriously, assess the risk vs opportunity, pilot it if viable, and give clear feedback.', score: 3 },
      { text: 'Pass it to a committee to decide.', score: 1 },
    ]
  },
  {
    id: 'DE7', dimension: 'decision',
    scenario: 'Two urgent priorities conflict and you cannot do both. What do you do?',
    options: [
      { text: 'Do both at once — multitasking is a key leadership skill.', score: 0 },
      { text: 'Assess impact, consult key stakeholders, make a clear prioritisation decision, and communicate it.', score: 3 },
      { text: 'Do whichever is easier first.', score: 0 },
      { text: 'Ask your manager to choose for you.', score: 1 },
    ]
  },
  {
    id: 'DE8', dimension: 'decision',
    scenario: 'You discover that a long-standing process your team follows is inefficient. What do you do?',
    options: [
      { text: 'Change it immediately without telling anyone.', score: 0 },
      { text: 'Leave it — processes exist for a reason.', score: 0 },
      { text: 'Involve the team in redesigning it, build a business case, and implement the change properly.', score: 3 },
      { text: 'Raise it with management and wait for them to act.', score: 1 },
    ]
  },

  // Communication (8 questions)
  {
    id: 'CO1', dimension: 'communication',
    scenario: 'You need to deliver critical feedback to a team member about their performance. How do you approach it?',
    options: [
      { text: 'Be blunt and direct — they need to hear the truth.', score: 1 },
      { text: 'Avoid the conversation to preserve the relationship.', score: 0 },
      { text: 'Have a private, structured conversation — specific, balanced, and focused on behaviours and impact not personality.', score: 3 },
      { text: 'Mention it casually in passing so it does not feel too formal.', score: 0 },
    ]
  },
  {
    id: 'CO2', dimension: 'communication',
    scenario: 'You need to communicate a major organisational change to your team. What is your approach?',
    options: [
      { text: 'Send a detailed email covering all the facts.', score: 1 },
      { text: 'Hold a team meeting, explain the change clearly, address questions honestly, and follow up in writing.', score: 3 },
      { text: 'Tell team members one by one in informal conversations.', score: 1 },
      { text: 'Let them find out through the company announcement and follow up only if asked.', score: 0 },
    ]
  },
  {
    id: 'CO3', dimension: 'communication',
    scenario: 'A team member gives you feedback that your management style is too controlling. How do you respond?',
    options: [
      { text: 'Dismiss it — they are probably just uncomfortable with accountability.', score: 0 },
      { text: 'Thank them sincerely, reflect on the feedback, and consider what adjustments you might make.', score: 3 },
      { text: 'Apologise and immediately change your entire approach.', score: 1 },
      { text: 'Defend your style and explain why it is necessary.', score: 0 },
    ]
  },
  {
    id: 'CO4', dimension: 'communication',
    scenario: 'You are presenting to senior leadership and realise midway through that you do not know the answer to a key question. What do you do?',
    options: [
      { text: 'Make up a plausible answer — admitting ignorance looks weak.', score: 0 },
      { text: 'Confidently say you will confirm the answer and follow up promptly.', score: 3 },
      { text: 'Deflect and move to the next point quickly.', score: 0 },
      { text: 'Ask a colleague in the room to answer on your behalf.', score: 1 },
    ]
  },
  {
    id: 'CO5', dimension: 'communication',
    scenario: 'You notice that important information is not flowing well between your team and another department. What do you do?',
    options: [
      { text: 'Blame the other department for poor communication.', score: 0 },
      { text: 'Establish regular cross-team touchpoints and clear communication channels collaboratively.', score: 3 },
      { text: 'Copy senior management on all communications to create accountability.', score: 0 },
      { text: 'Send a detailed report to both teams outlining the gaps.', score: 1 },
    ]
  },
  {
    id: 'CO6', dimension: 'communication',
    scenario: 'During a one-to-one, a team member becomes emotional and upset. How do you respond?',
    options: [
      { text: 'Tell them to compose themselves and continue the meeting professionally.', score: 0 },
      { text: 'End the meeting immediately to give them space.', score: 1 },
      { text: 'Acknowledge their feelings, give them space to express themselves, and adapt the conversation accordingly.', score: 3 },
      { text: 'Refer them to HR immediately as this is outside your remit.', score: 1 },
    ]
  },
  {
    id: 'CO7', dimension: 'communication',
    scenario: 'Your team regularly misunderstands your instructions, leading to rework. What do you do?',
    options: [
      { text: 'Assume the team is not paying attention and remind them to listen better.', score: 0 },
      { text: 'Reflect on your communication style, seek feedback, and adjust how you give instructions.', score: 3 },
      { text: 'Put all instructions in writing from now on.', score: 1 },
      { text: 'Assign a team lead to translate your instructions for the others.', score: 1 },
    ]
  },
  {
    id: 'CO8', dimension: 'communication',
    scenario: 'You disagree with a decision made by senior leadership. How do you communicate this?',
    options: [
      { text: 'Complain about it to your team.', score: 0 },
      { text: 'Say nothing — it is not your place to challenge leadership.', score: 0 },
      { text: 'Raise your concern privately and professionally through appropriate channels with clear rationale.', score: 3 },
      { text: 'Publicly challenge the decision at the next all-hands meeting.', score: 0 },
    ]
  },
]

// ── Scoring & Profiling ───────────────────────────────────────────────
export function scoreLeadership(answers) {
  // answers: { questionId: optionIndex }
  const dimScores = {}
  DIMENSIONS.forEach(d => { dimScores[d.id] = { score: 0, max: 0 } })

  SJT_QUESTIONS.forEach(q => {
    const selected = answers[q.id]
    if (selected !== undefined && selected !== null) {
      dimScores[q.dimension].score += q.options[selected].score
      dimScores[q.dimension].max   += 3
    }
  })

  const total    = Object.values(dimScores).reduce((a, d) => a + d.score, 0)
  const maxTotal = Object.values(dimScores).reduce((a, d) => a + d.max, 0)
  const pct      = maxTotal > 0 ? Math.round(total / maxTotal * 100) : 0

  const fitLabel = pct >= 75 ? 'Strong Fit' : pct >= 50 ? 'Moderate Fit' : 'Developing'
  const fitColor = pct >= 75 ? 'var(--ok)' : pct >= 50 ? 'var(--warn)' : 'var(--bad)'

  // Leadership style based on strongest dimensions
  const sorted = DIMENSIONS.map(d => ({ ...d, pct: dimScores[d.id].max > 0 ? dimScores[d.id].score / dimScores[d.id].max : 0 }))
    .sort((a, b) => b.pct - a.pct)
  const top = sorted[0].id
  const styleMap = { conflict: 'Diplomatic', delegation: 'Empowering', motivation: 'Inspiring', decision: 'Decisive', communication: 'Communicative' }
  const leadershipStyle = styleMap[top] || 'Balanced'

  return { dimScores, total, maxTotal, pct, fitLabel, fitColor, leadershipStyle }
}

export function getDimQualitative(dimId, pct) {
  const narratives = {
    conflict: {
      high:   'You handle conflict with composure and skill, creating structured space for resolution while maintaining relationships and team cohesion.',
      mid:    'You manage conflict reasonably well but may sometimes avoid difficult conversations or rely on others to mediate.',
      low:    'Conflict situations appear to be an area for development. Building structured conflict resolution skills would strengthen your leadership.'
    },
    delegation: {
      high:   'You delegate effectively and trust your team with meaningful responsibility, creating an empowering environment that grows capability.',
      mid:    'You delegate in many situations but may tend to retain control when stakes are high or when unsure of a team member\'s readiness.',
      low:    'Delegation appears to be a development area. Building trust in your team and letting go of control will be important for your leadership growth.'
    },
    motivation: {
      high:   'You inspire and energise your team naturally, understanding what drives individuals and connecting them to a shared purpose.',
      mid:    'You motivate your team in many ways but may rely on standard approaches rather than tailoring motivation to each individual.',
      low:    'Team motivation is an area for development. Understanding what drives each team member individually will significantly improve engagement.'
    },
    decision: {
      high:   'You make clear, well-reasoned decisions under pressure, take accountability for outcomes, and involve the right people at the right time.',
      mid:    'You make sound decisions in familiar situations but may hesitate or defer to others when faced with ambiguity or high-stakes choices.',
      low:    'Decision making under pressure is an area for development. Building confidence in structured decision frameworks will support your growth.'
    },
    communication: {
      high:   'You communicate with clarity, empathy and impact — adapting your style to the audience and creating an environment where people feel heard.',
      mid:    'You communicate effectively in most situations but may struggle with difficult conversations or adapting your style under pressure.',
      low:    'Communication is an area for development. Focusing on active listening, feedback delivery and clarity will strengthen your leadership presence.'
    }
  }
  const n = narratives[dimId]
  if (!n) return ''
  return pct >= 70 ? n.high : pct >= 45 ? n.mid : n.low
}

export function getOverallNarrative(fitLabel, leadershipStyle, pct) {
  if (fitLabel === 'Strong Fit') {
    return 'You demonstrate strong leadership capability across the assessed dimensions. Your ' + leadershipStyle.toLowerCase() + ' approach creates an environment where teams can thrive. You handle pressure with composure, communicate with clarity, and show genuine care for the growth of those around you. You are well placed to take on or continue in a people leadership role.'
  } else if (fitLabel === 'Moderate Fit') {
    return 'You show solid leadership potential with clear strengths in several areas. Your ' + leadershipStyle.toLowerCase() + ' style is an asset, and with continued focus on your development areas you have the foundation to grow into a highly effective people leader. Targeted coaching and stretch assignments will accelerate your progress.'
  } else {
    return 'You are at an early stage of your leadership development journey. There are genuine strengths to build on, and with structured support, coaching and experience managing people, you have the potential to develop into an effective leader over time. This assessment highlights the areas where focused development will have the most impact.'
  }
}

export function selectQuestions(n, seed) {
  // Select n questions ensuring coverage across all dimensions
  const perDim = Math.floor(n / DIMENSIONS.length)
  const selected = []
  DIMENSIONS.forEach(dim => {
    const pool = SJT_QUESTIONS.filter(q => q.dimension === dim.id)
    // Seeded shuffle for consistency
    let s = seed + dim.id.charCodeAt(0)
    const shuffled = [...pool]
    for (let i = shuffled.length - 1; i > 0; i--) {
      s = (s * 1664525 + 1013904223) & 0xffffffff
      const j = Math.abs(s) % (i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    selected.push(...shuffled.slice(0, perDim))
  })
  // Shuffle the final selection
  let s2 = seed + 42
  for (let i = selected.length - 1; i > 0; i--) {
    s2 = (s2 * 1664525 + 1013904223) & 0xffffffff
    const j = Math.abs(s2) % (i + 1);
    [selected[i], selected[j]] = [selected[j], selected[i]]
  }
  return selected.slice(0, n)
}
