// ── Leadership SJT Question Bank v2 ──────────────────────────────────
// All options are plausible. No obviously wrong answers.
// Scoring: 0-3 per option based on leadership research best practice.
// Candidates cannot guess by elimination — must use genuine judgement.

export const DIMENSIONS = [
  { id: 'conflict',      label: 'Conflict Resolution',       icon: '🤝' },
  { id: 'delegation',    label: 'Delegation & Empowerment',  icon: '📋' },
  { id: 'motivation',    label: 'Team Motivation',           icon: '🔥' },
  { id: 'decision',      label: 'Decision Making',           icon: '⚡' },
  { id: 'communication', label: 'Communication',             icon: '💬' },
]

export const SJT_QUESTIONS = [

  // ── CONFLICT RESOLUTION (10 questions) ───────────────────────────────

  {
    id: 'C1', dimension: 'conflict',
    scenario: 'Two senior team members have an ongoing rivalry that is beginning to affect team dynamics. Both are high performers and critical to a major project launching in three weeks. Neither has raised the issue formally. What is your first move?',
    options: [
      { text: "Address it directly in the next team meeting so it is acknowledged openly and the team can move forward together.", score: 1 },
      { text: "Meet with each person individually to understand their perspective before deciding how to intervene.", score: 3 },
      { text: "Monitor the situation closely — the project deadline may naturally force collaboration without requiring your intervention.", score: 1 },
      { text: "Restructure their project responsibilities so they have minimal overlap for the duration of the launch.", score: 2 },
    ]
  },
  {
    id: 'C2', dimension: 'conflict',
    scenario: 'A team member reports that a colleague has been taking credit for their work in cross-functional meetings. You have not witnessed this directly, but three others have mentioned it informally. The accused colleague is well-regarded by senior leadership. What do you do?',
    options: [
      { text: "Raise it with the accused colleague privately, sharing what you have heard and asking for their perspective.", score: 3 },
      { text: "Observe the next few cross-functional meetings yourself before drawing conclusions or acting.", score: 2 },
      { text: "Coach the affected team member on how to assert their contributions more visibly in future meetings.", score: 1 },
      { text: "Document the incidents with the witnesses and escalate to HR to ensure proper process.", score: 1 },
    ]
  },
  {
    id: 'C3', dimension: 'conflict',
    scenario: 'During a high-pressure project, two team members get into a heated exchange in front of the broader team. One storms out of the room. The team is visibly unsettled and the meeting was only half complete. How do you handle the rest of the session?',
    options: [
      { text: "Take a short break, check on the person who left, then resume the meeting with a refocus on the agenda.", score: 3 },
      { text: "Acknowledge the tension briefly, close the meeting early, and reschedule once things have cooled down.", score: 2 },
      { text: "Continue the meeting — stopping sends the message that emotional outbursts can derail team time.", score: 1 },
      { text: "Address the conflict directly with the group present — unresolved tension in the room will affect the meeting quality anyway.", score: 1 },
    ]
  },
  {
    id: 'C4', dimension: 'conflict',
    scenario: 'Two departments have been blaming each other for a recurring operational problem that is escalating in cost. Both department heads report to you. Each presents compelling data supporting their position. What is your approach?',
    options: [
      { text: "Commission a neutral third-party review of the end-to-end process to establish facts before convening both teams.", score: 2 },
      { text: "Bring both department heads together, establish shared accountability for resolution, and set a joint problem-solving timeline.", score: 3 },
      { text: "Make a provisional decision on accountability based on the data available, communicate it, and review in 30 days.", score: 2 },
      { text: "Separate the immediate fix from the root cause — resolve the operational issue now and investigate accountability separately.", score: 2 },
    ]
  },
  {
    id: 'C5', dimension: 'conflict',
    scenario: 'Your strongest technical team member has a communication style that regularly causes friction — they are blunt to the point of being dismissive, particularly with junior staff. Performance reviews rate them exceptional. Two junior staff have raised concerns informally. What do you prioritise?',
    options: [
      { text: "Have a frank coaching conversation with the senior member about the specific impact of their communication style on team cohesion.", score: 3 },
      { text: "Acknowledge the juniors privately, coach them on how to manage upward communication with more experienced colleagues.", score: 1 },
      { text: "Raise it in the next performance review — it is the appropriate formal channel for behavioural feedback.", score: 1 },
      { text: "Create a team working agreement on communication norms that applies to everyone, avoiding singling anyone out.", score: 2 },
    ]
  },
  {
    id: 'C6', dimension: 'conflict',
    scenario: 'You and a peer manager disagree on how to allocate shared resources for Q3. You both have legitimate business cases. The resource decision needs to be made within 48 hours. Escalating to your shared manager is an option but will reflect poorly on both of you. What do you do?',
    options: [
      { text: "Request one focused meeting with your peer to find a compromise — come prepared with two or three flexible options.", score: 3 },
      { text: "Escalate to your shared manager — resource allocation disputes at this level require executive arbitration to be effective.", score: 1 },
      { text: "Propose splitting the resource equally for now and revisiting after Q3 results are in.", score: 2 },
      { text: "Make the strongest possible case to your peer and yield only if their evidence clearly outweighs yours.", score: 1 },
    ]
  },
  {
    id: 'C7', dimension: 'conflict',
    scenario: 'A team member who recently returned from a period of extended sick leave is struggling to reintegrate. Colleagues are supportive but quietly frustrated that workload redistribution has persisted for longer than expected. The individual is aware of the pressure but says they are doing their best. What is your priority action?',
    options: [
      { text: "Have a supportive but honest conversation with the returning team member about a realistic reintegration timeline and workload expectations.", score: 3 },
      { text: "Acknowledge the team's frustration directly and bring in temporary support to reduce redistribution burden.", score: 2 },
      { text: "Give the situation more time — reintegration after illness is unpredictable and pressure may slow recovery.", score: 1 },
      { text: "Consult HR on how to handle the reintegration formally, ensuring you are compliant and supported.", score: 2 },
    ]
  },
  {
    id: 'C8', dimension: 'conflict',
    scenario: 'Two high-potential employees both want the same internal promotion. Only one position is available. Both are objectively strong candidates. Choosing one risks demotivating or losing the other. How do you approach the decision and its aftermath?',
    options: [
      { text: "Use a structured competency-based process, make the decision transparently, and immediately discuss a development path with the unsuccessful candidate.", score: 3 },
      { text: "Delay the promotion decision while you explore whether a second role can be created or backfilled.", score: 1 },
      { text: "Promote the candidate with the strongest external market value — retaining the harder-to-replace talent is the priority.", score: 1 },
      { text: "Give both candidates a stretch project for 90 days and use their performance to inform the final decision.", score: 2 },
    ]
  },
  {
    id: 'C9', dimension: 'conflict',
    scenario: 'A team member is openly critical of a strategic decision made by senior leadership, voicing their frustration to colleagues during team huddles. You understand their frustration — you privately share some of their concerns — but the decision is final. What do you do?',
    options: [
      { text: "Meet privately with the team member, validate their concerns, but set clear expectations about how dissent should be expressed.", score: 3 },
      { text: "Raise the team's concerns through appropriate channels to leadership, demonstrating you advocate for your team.", score: 2 },
      { text: "Address it in a team meeting — reinforce the rationale for the decision and redirect energy toward implementation.", score: 2 },
      { text: "Allow it to continue in the short term — venting is natural and will likely diminish as the decision becomes normalised.", score: 0 },
    ]
  },
  {
    id: 'C10', dimension: 'conflict',
    scenario: 'You discover that two team members have been bypassing a process you established, finding a workaround that is faster but creates downstream risk. When you raise it, they defend their approach with solid efficiency data. How do you respond?',
    options: [
      { text: "Acknowledge their initiative, pause the workaround temporarily, and run a structured review to assess whether the process needs updating.", score: 3 },
      { text: "Reinstate the original process immediately — efficiency gains do not justify unilateral process changes.", score: 1 },
      { text: "Ask them to formally document and present their approach so the wider team can assess it together.", score: 2 },
      { text: "Approve the workaround provisionally while you review the downstream risk — pragmatism should be rewarded.", score: 2 },
    ]
  },

  // ── DELEGATION & EMPOWERMENT (10 questions) ───────────────────────────

  {
    id: 'D1', dimension: 'delegation',
    scenario: 'You are being stretched across two major initiatives and need to delegate a high-visibility client deliverable to a team member who is capable but has not handled this type of work before. The client is important and the margin for error is low. What is your approach?',
    options: [
      { text: "Brief them thoroughly, set clear success criteria, agree on check-in points, and make yourself available — but resist the urge to take over.", score: 3 },
      { text: "Delegate but retain sign-off authority on all client-facing outputs before they are shared.", score: 2 },
      { text: "Handle this deliverable yourself given the stakes, and create a development opportunity from the next lower-risk client project.", score: 1 },
      { text: "Pair them with a more experienced colleague to co-lead it — maintaining quality while creating a real development experience.", score: 2 },
    ]
  },
  {
    id: 'D2', dimension: 'delegation',
    scenario: 'You delegated a project to a capable team member. Halfway through, you review their progress and notice they have taken the work in a different direction than you envisioned — not wrong, but different. The client has not seen it yet. What do you do?',
    options: [
      { text: "Explore their reasoning before deciding anything — their direction may have merit you have not yet considered.", score: 3 },
      { text: "Redirect them toward your original vision — consistency with your approach builds better habits for future work.", score: 1 },
      { text: "Assess objectively whether their approach meets the brief and only intervene if it creates a risk to the outcome.", score: 3 },
      { text: "Let it proceed and manage client expectations — the team member needs to experience both the ownership and the consequences.", score: 1 },
    ]
  },
  {
    id: 'D3', dimension: 'delegation',
    scenario: 'A strong team member repeatedly comes to you for sign-off on decisions that are well within their authority. You sense they are seeking reassurance rather than genuinely needing approval. This is slowing down output. How do you address it?',
    options: [
      { text: "Have a direct conversation about their decision authority and coach them toward greater autonomy with a clear framework for when escalation is appropriate.", score: 3 },
      { text: "Continue to provide sign-off while gradually increasing the complexity of decisions you expect them to make independently.", score: 2 },
      { text: "Create a documented decision matrix with them that defines which decisions require escalation — making the boundary explicit.", score: 2 },
      { text: "Decline to sign off on routine decisions and direct them back to make the call themselves — a firm boundary often builds confidence faster.", score: 2 },
    ]
  },
  {
    id: 'D4', dimension: 'delegation',
    scenario: 'You are about to go on three weeks of annual leave. Your team is mid-project. You have a capable senior team member but they have never formally covered for you before. Your manager is available but prefers not to be involved in day-to-day decisions. What do you do?',
    options: [
      { text: "Formally appoint the senior team member as acting lead, brief them thoroughly, and agree clear escalation criteria with your manager.", score: 3 },
      { text: "Remain contactable during leave and ask the team to contact you for anything significant — three weeks is too critical to fully disconnect.", score: 1 },
      { text: "Pre-make as many decisions as possible before leaving and document them so the team can proceed without you.", score: 2 },
      { text: "Brief both your manager and the senior team member and let them decide between them how to manage — shared ownership reduces risk.", score: 1 },
    ]
  },
  {
    id: 'D5', dimension: 'delegation',
    scenario: 'A team member you delegated a task to has made an error that has caused a minor client complaint. The client is unhappy but not escalating. The team member is mortified and apologetic. How do you handle it?',
    options: [
      { text: "Own the situation with the client yourself, debrief with the team member privately to understand what happened, and agree on how to prevent recurrence.", score: 3 },
      { text: "Have the team member contact the client directly to apologise — accountability is part of ownership and the experience is valuable.", score: 2 },
      { text: "Retake the work from the team member for the remainder of this project — client trust needs to be restored before re-delegating.", score: 1 },
      { text: "Address it jointly with the team member — present a united front to the client and debrief thoroughly afterward.", score: 2 },
    ]
  },
  {
    id: 'D6', dimension: 'delegation',
    scenario: 'Your team has grown significantly. You are spending too much time in execution and not enough in strategy. You need to delegate more broadly but several team members are not yet fully ready for expanded responsibility. What is your approach?',
    options: [
      { text: "Identify the two or three most ready individuals, delegate meaningful stretches of work to them immediately, and build a 90-day capability plan for the others.", score: 3 },
      { text: "Hire a senior team member to take on the operational load — capability gaps in the current team should not compromise strategic output.", score: 1 },
      { text: "Run a structured skills assessment first so delegation decisions are based on evidence rather than perception.", score: 2 },
      { text: "Delegate broadly and accept a short-term dip in quality — managed stretch is the fastest way to build team capability.", score: 2 },
    ]
  },
  {
    id: 'D7', dimension: 'delegation',
    scenario: 'A junior team member proactively volunteers to lead a client presentation that is beyond their current experience level. The client is mid-tier and the stakes are moderate. Their enthusiasm is genuine. What do you decide?',
    options: [
      { text: "Support them to do it — provide coaching, review their preparation, and attend as a silent presence to step in only if necessary.", score: 3 },
      { text: "Give them a meaningful role in the presentation — lead on their section, but you present the overall narrative.", score: 2 },
      { text: "Decline for now — client relationships are built on credibility and an underprepared junior risks undermining that.", score: 1 },
      { text: "Let them lead it entirely without your attendance — full accountability is the most powerful developmental experience.", score: 1 },
    ]
  },
  {
    id: 'D8', dimension: 'delegation',
    scenario: 'You have delegated a strategic analysis to your most capable analyst. Their output is technically excellent but the narrative and executive framing are weak — it will not land well with senior stakeholders. The presentation is in two days. What do you do?',
    options: [
      { text: "Work with them to strengthen the narrative together — this is a coaching moment and the output will be better for their involvement.", score: 3 },
      { text: "Rework the framing yourself overnight — the presentation quality must be right and there is not enough time to coach.", score: 2 },
      { text: "Give them specific feedback on what needs to change and set a deadline for a revised version tomorrow morning.", score: 2 },
      { text: "Present the technical analysis yourself and ask them to support in the room — play to each person's strengths under time pressure.", score: 1 },
    ]
  },
  {
    id: 'D9', dimension: 'delegation',
    scenario: 'A team member who previously underperformed has significantly improved over the last quarter. They are now asking for more responsibility and a higher-profile project. You are not yet fully confident in their consistency. What do you do?',
    options: [
      { text: "Give them a meaningful but bounded stretch project — enough to demonstrate continued growth without overexposing the team or clients.", score: 3 },
      { text: "Ask them to demonstrate consistent performance for another quarter before expanding their scope — trust is built over time.", score: 2 },
      { text: "Involve them in a high-profile project in a supporting role first — visible without full ownership until confidence is established.", score: 2 },
      { text: "Give them the high-profile project fully — the best way to test whether the improvement is real is under genuine pressure.", score: 1 },
    ]
  },
  {
    id: 'D10', dimension: 'delegation',
    scenario: 'Your team consistently waits for your direction before taking action, even on routine matters. You are becoming a bottleneck. When you ask why, they say they prefer to have your buy-in to avoid making mistakes. What is the root cause you address first?',
    options: [
      { text: "Your own behaviour — consider whether you have inadvertently signalled that decisions need your approval by over-reviewing their work in the past.", score: 3 },
      { text: "Team confidence — implement a structured empowerment programme with clear decision rights and regular positive reinforcement for independent action.", score: 2 },
      { text: "Process clarity — the team likely lacks clear enough guidelines on decision boundaries. Documenting these should resolve the bottleneck.", score: 2 },
      { text: "Team mindset — this is a cultural issue that requires frank conversations about accountability expectations with each individual.", score: 1 },
    ]
  },

  // ── TEAM MOTIVATION (10 questions) ───────────────────────────────────

  {
    id: 'M1', dimension: 'motivation',
    scenario: 'Your team has just come through a gruelling six-month project that delivered strong results. Morale is high but exhaustion is visible. A new priority project has just been assigned with a tight deadline. How do you manage the transition?',
    options: [
      { text: "Formally close out the last project with recognition, give the team a short recovery window, then re-energise around the new challenge with clear context.", score: 3 },
      { text: "Move directly into the new project — momentum is an asset and a gap risks losing the team's rhythm.", score: 1 },
      { text: "Negotiate the new deadline with your stakeholders — the team's capacity and wellbeing must factor into realistic planning.", score: 2 },
      { text: "Let the team self-organise the transition — they have earned the right to determine their own pace into the next project.", score: 1 },
    ]
  },
  {
    id: 'M2', dimension: 'motivation',
    scenario: 'One of your best performers has become noticeably disengaged over the past month. Their output remains acceptable but their energy and initiative have dropped. They have not raised anything with you directly. In your one-to-one, how do you open the conversation?',
    options: [
      { text: "Share your observation directly but warmly — \"I've noticed a shift in your energy lately and I want to understand what's going on for you.\"", score: 3 },
      { text: "Ask broadly how they are finding things at the moment and let them lead — they will raise it if they are ready.", score: 2 },
      { text: "Focus the one-to-one on their development goals — reconnecting them with their ambitions may naturally address the disengagement.", score: 2 },
      { text: "Address performance first — a gentle but clear message that the drop in engagement is visible may prompt them to open up.", score: 1 },
    ]
  },
  {
    id: 'M3', dimension: 'motivation',
    scenario: 'Your team has achieved an exceptional result — well above target. Senior leadership has acknowledged it at the company level. One team member contributed significantly more than others due to a colleague being on leave. How do you recognise the team?',
    options: [
      { text: "Celebrate the team achievement collectively and then separately and privately acknowledge the individual who went above and beyond.", score: 3 },
      { text: "Publicly recognise the exceptional contribution of the individual alongside the team — accuracy in recognition builds trust.", score: 2 },
      { text: "Focus entirely on the team achievement — singling out individuals risks creating division and diminishes the collective win.", score: 1 },
      { text: "Ensure the individual's extra contribution is formally recorded and reflected in their performance evaluation rather than public recognition.", score: 2 },
    ]
  },
  {
    id: 'M4', dimension: 'motivation',
    scenario: 'A team member tells you in a one-to-one that they are seriously considering leaving for a competitor who has offered them a more senior title and a 20% salary increase. They say they enjoy working with you but feel their growth has plateaued. What do you do?',
    options: [
      { text: "Have an honest conversation about their ambitions, explore what you can genuinely offer, and be transparent about what is and is not within your power to change.", score: 3 },
      { text: "Advocate strongly with HR and leadership for a counter-offer — losing this person would be a significant team loss.", score: 2 },
      { text: "Focus on what you can control immediately — restructure their role to include a visible leadership component that addresses the growth concern.", score: 2 },
      { text: "Respect their decision process and avoid counter-offering — if the role is a better opportunity, retaining them short-term may only delay an inevitable exit.", score: 1 },
    ]
  },
  {
    id: 'M5', dimension: 'motivation',
    scenario: 'Your team is nine months into a twelve-month transformation programme. Fatigue is setting in and two team members have privately expressed doubt about whether the change will actually deliver the promised benefits. Milestones are being met but energy is low. What is your response?',
    options: [
      { text: "Create a visible \"progress story\" — connect current milestones to early wins and the eventual impact, making the journey tangible rather than abstract.", score: 3 },
      { text: "Acknowledge the doubt openly with the team — honest conversation about challenges is more motivating than forced positivity.", score: 2 },
      { text: "Escalate the morale concern to programme leadership — if the team lacks confidence in the programme, that is systemic and above your level.", score: 1 },
      { text: "Inject a short-term win — identify a quick, visible improvement the team can deliver in the next four weeks to rebuild confidence.", score: 2 },
    ]
  },
  {
    id: 'M6', dimension: 'motivation',
    scenario: 'You manage a team where three individuals are clearly highly ambitious and motivated by progression, while four others are solid performers who prioritise stability and work-life balance. A senior leader asks you to "raise the bar" for the whole team. How do you approach this?',
    options: [
      { text: "Differentiate your approach — raise expectations for the high-ambition group through stretch roles while supporting the stable performers to deepen their expertise.", score: 3 },
      { text: "Set a consistent higher standard for the team as a whole — clarity and fairness require the same expectations for everyone.", score: 1 },
      { text: "Have individual conversations with each team member about what \"raising the bar\" means specifically for their role and goals.", score: 2 },
      { text: "Challenge the directive with your senior leader — applying uniform pressure risks losing your stable high-quality performers.", score: 2 },
    ]
  },
  {
    id: 'M7', dimension: 'motivation',
    scenario: 'Your organisation has announced a restructure that will result in two team members\' roles being made redundant — though neither has been officially notified yet. Rumours are already circulating and the atmosphere is tense. You cannot share the details yet. How do you lead the team during this period?',
    options: [
      { text: "Acknowledge the uncertainty honestly without sharing confidential details, maintain regular communication, and ensure individuals feel seen and supported.", score: 3 },
      { text: "Hold firm — sharing anything before official communication could create legal risk and further panic.", score: 1 },
      { text: "Focus the team on their work and create short-term momentum — distraction through purposeful activity reduces anxiety.", score: 2 },
      { text: "Advocate urgently with HR to accelerate the formal communication — the current uncertainty is more damaging than a difficult truth.", score: 2 },
    ]
  },
  {
    id: 'M8', dimension: 'motivation',
    scenario: 'A team member who is technically excellent shows no interest in progression, leadership, or taking on broader responsibilities. They are content in their current role and deliver consistently. Your organisation values upward mobility. How do you manage their development?',
    options: [
      { text: "Respect their choice and focus their development on deepening technical excellence — not all career paths require upward mobility.", score: 3 },
      { text: "Explore whether their contentment reflects genuine preference or a lack of confidence in their ability to step up.", score: 2 },
      { text: "Be transparent that the organisation's expectations include growth — help them understand what that means in their context.", score: 2 },
      { text: "Channel their expertise into a mentoring or knowledge-sharing role — this creates leadership impact without a formal leadership title.", score: 2 },
    ]
  },
  {
    id: 'M9', dimension: 'motivation',
    scenario: 'After a 360-degree feedback process, you discover that your team finds your management style too directive. They feel micromanaged and say it limits their creativity. You believe the structure you provide is what keeps the team high-performing. How do you respond?',
    options: [
      { text: "Take the feedback seriously — explore specific examples with trusted team members and experiment with giving more autonomy in lower-risk areas first.", score: 3 },
      { text: "Share your perspective with the team openly — strong performance often requires structure and you want to find a shared understanding.", score: 2 },
      { text: "Review the feedback in context — consider whether it reflects a genuine issue or whether some team members simply prefer less accountability.", score: 1 },
      { text: "Adjust your style immediately and comprehensively — when a team speaks collectively, the right response is to act.", score: 1 },
    ]
  },
  {
    id: 'M10', dimension: 'motivation',
    scenario: 'A team member who regularly volunteers for extra work, takes on peer mentoring, and leads team initiatives is showing early signs of burnout — they have mentioned feeling overwhelmed but insist they are fine and want to keep going. What do you do?',
    options: [
      { text: "Have a caring but firm conversation — acknowledge what you are observing, validate their commitment, and work together to reduce their load before it becomes a crisis.", score: 3 },
      { text: "Respect their self-assessment — they know themselves best and insisting otherwise may feel patronising.", score: 0 },
      { text: "Remove some of their additional responsibilities temporarily without making it a formal conversation — action speaks louder than words.", score: 1 },
      { text: "Involve occupational health or HR for professional support — burnout risk requires formal safeguarding, not just a manager conversation.", score: 2 },
    ]
  },

  // ── DECISION MAKING (10 questions) ───────────────────────────────────

  {
    id: 'DE1', dimension: 'decision',
    scenario: 'You must make a significant resourcing decision by end of day. You have 60% of the information you need. The remaining data will take three days to gather. Delaying will mean missing a market window. What do you do?',
    options: [
      { text: "Make the decision with the available data, document your assumptions clearly, and build in a 30-day review to course-correct if needed.", score: 3 },
      { text: "Delay the decision — a significant resourcing choice made on 60% information creates more risk than missing the market window.", score: 1 },
      { text: "Make the minimum viable commitment now that keeps options open, and finalise the full decision once complete data is available.", score: 3 },
      { text: "Escalate to your manager — decisions of this significance with incomplete data require senior endorsement.", score: 1 },
    ]
  },
  {
    id: 'DE2', dimension: 'decision',
    scenario: 'Your team is evenly divided on the best technical approach to a problem. Both camps have strong arguments. You have a preference but acknowledge the other approach has merit. A decision needs to be made this week. How do you proceed?',
    options: [
      { text: "Make the call yourself — present your reasoning clearly, acknowledge the alternative view, and commit the team to one direction.", score: 3 },
      { text: "Run a structured decision framework with the team — document the criteria, weight them together, and let the analysis guide the outcome.", score: 2 },
      { text: "Pilot both approaches in parallel on a small scale for two weeks before committing — the data will resolve the disagreement.", score: 2 },
      { text: "Hold a final debate and put it to a team vote — shared ownership of the decision will improve implementation.", score: 1 },
    ]
  },
  {
    id: 'DE3', dimension: 'decision',
    scenario: 'A decision you made six months ago has not delivered the expected results. The team followed your direction faithfully. You are now under pressure from senior leadership to explain the underperformance. How do you respond?',
    options: [
      { text: "Take clear accountability for the decision, present what you have learned, and set out a clear corrective plan.", score: 3 },
      { text: "Contextualise the decision — present the information available at the time and explain how market conditions changed.", score: 2 },
      { text: "Be transparent about both your accountability and the external factors — honest complexity is more credible than either deflection or excessive self-blame.", score: 3 },
      { text: "Focus the conversation on the corrective actions rather than relitigating the original decision — forward momentum is what leadership wants to see.", score: 2 },
    ]
  },
  {
    id: 'DE4', dimension: 'decision',
    scenario: 'Senior leadership is pressuring you to approve a cost-cutting measure that you believe will damage team capability and client service quality in the medium term. The pressure is significant and the measure is popular at board level. What is your position?',
    options: [
      { text: "Build a structured business case with data that quantifies the medium-term risk and present it formally before the decision is finalised.", score: 3 },
      { text: "Implement the measure as directed but document your concerns formally — you have a duty to comply but also to protect yourself professionally.", score: 2 },
      { text: "Negotiate for a modified version of the measure that achieves the cost target with less capability damage — look for the third option.", score: 3 },
      { text: "Push back directly and firmly in leadership meetings — if you have credibility, a strong dissenting voice can change outcomes.", score: 2 },
    ]
  },
  {
    id: 'DE5', dimension: 'decision',
    scenario: 'You need to choose between two candidates for a critical team role. Candidate A has more experience and will hit the ground running. Candidate B is less experienced but shows exceptional learning agility and cultural fit. The role is critical now but will also evolve significantly in 18 months. Who do you hire?',
    options: [
      { text: "Hire Candidate B — learning agility and cultural fit predict long-term performance better than current experience for an evolving role.", score: 2 },
      { text: "Hire Candidate A — the immediate need is too critical to take on the development risk of a less experienced hire.", score: 2 },
      { text: "Define the 18-month role requirements more precisely before deciding — the right answer depends on how much the role will change and how fast.", score: 3 },
      { text: "Create a short paid trial project for both candidates — observed performance under real conditions is more reliable than interviews.", score: 1 },
    ]
  },
  {
    id: 'DE6', dimension: 'decision',
    scenario: 'A team member proposes an innovative approach to a client problem that could differentiate your offer significantly. The approach is unproven, carries moderate delivery risk, and would require a four-week investment before knowing if it works. The client has not asked for it. What do you decide?',
    options: [
      { text: "Run a contained two-week proof of concept internally before deciding whether to invest further or present to the client.", score: 3 },
      { text: "Approve the full four-week investment — genuine innovation requires genuine resource commitment, not half-measures.", score: 1 },
      { text: "Present the concept to the client and let them decide whether the risk-reward tradeoff is worth it from their perspective.", score: 2 },
      { text: "Park it for now — solving what the client has asked for reliably is more important than unsolicited innovation.", score: 1 },
    ]
  },
  {
    id: 'DE7', dimension: 'decision',
    scenario: 'You have two equally urgent priorities and insufficient resource to do both well simultaneously. Doing both at reduced quality risks both failing. Choosing one means the other is delayed by at least six weeks. Both stakeholders believe their priority is non-negotiable. What do you do?',
    options: [
      { text: "Convene both stakeholders together, present the resource reality transparently, and facilitate a shared prioritisation decision.", score: 3 },
      { text: "Make the prioritisation decision yourself based on strategic value and communicate it clearly to both stakeholders.", score: 2 },
      { text: "Escalate to your manager to make the call — cross-stakeholder prioritisation is above individual manager authority.", score: 1 },
      { text: "Attempt both at reduced scope — delivering something to both stakeholders is better than fully disappointing one.", score: 1 },
    ]
  },
  {
    id: 'DE8', dimension: 'decision',
    scenario: 'You discover a flaw in a process your team has been following for 18 months. The flaw has not caused a visible problem yet but creates potential compliance risk. Fixing it will require a two-week pause in output and will be costly. What do you do?',
    options: [
      { text: "Escalate immediately to compliance and legal, quantify the risk exposure, and implement a fix — the potential cost of non-compliance outweighs the disruption.", score: 3 },
      { text: "Conduct a rapid risk assessment first — understand the actual exposure before triggering a costly two-week pause.", score: 2 },
      { text: "Implement a compensating control immediately to mitigate the risk while you plan a proper process fix over the next quarter.", score: 2 },
      { text: "Fix it quietly within the team — escalating a compliance risk you discovered yourself may raise questions about your oversight.", score: 0 },
    ]
  },
  {
    id: 'DE9', dimension: 'decision',
    scenario: 'You are asked to make a recommendation on whether to pursue a new market that has strong growth potential but where your organisation has no existing capability or relationships. The investment required is significant. You have four weeks to advise. How do you structure your recommendation?',
    options: [
      { text: "Design a structured assessment covering market size, competitive dynamics, capability gap, build vs buy options, and risk-adjusted returns before advising.", score: 3 },
      { text: "Recommend a small pilot investment first — a time-limited market test generates real data more reliably than desk research.", score: 2 },
      { text: "Recommend against unless a clear capability acquisition path exists — organic capability building in a new market is rarely the right strategic move.", score: 1 },
      { text: "Bring in an external specialist to advise alongside you — decisions of this scale and complexity benefit from independent expertise.", score: 2 },
    ]
  },
  {
    id: 'DE10', dimension: 'decision',
    scenario: 'You made a decision to restructure your team\'s workflow three months ago. Two team members have told you privately it is not working as intended. Your manager has publicly praised the change. What do you do?',
    options: [
      { text: "Gather objective data on whether the workflow is actually underperforming, then make an evidence-based decision about whether to iterate or stay the course.", score: 3 },
      { text: "Acknowledge privately to the two team members that you are listening, and make iterative adjustments without formally announcing a reversal.", score: 2 },
      { text: "Have a direct conversation with your manager — if the change is not working, adjusting it is better than preserving a public position.", score: 2 },
      { text: "Give it more time — three months is too early to conclude a workflow change is not working, and the team may still be adjusting.", score: 1 },
    ]
  },

  // ── COMMUNICATION (10 questions) ─────────────────────────────────────

  {
    id: 'CO1', dimension: 'communication',
    scenario: 'You need to deliver significant constructive feedback to a high performer who is unaware that their interpersonal style is creating friction with other departments. They are confident and not accustomed to critical feedback. How do you approach the conversation?',
    options: [
      { text: "Be direct and specific — describe the observed behaviours and their documented impact without softening to the point of obscuring the message.", score: 3 },
      { text: "Lead with their strengths, then introduce the concern as an area for growth — framing it developmentally reduces defensiveness.", score: 2 },
      { text: "Share the feedback from others without attributing it to specific individuals — protect your sources while ensuring the message is heard.", score: 1 },
      { text: "Ask them first how they feel their cross-departmental relationships are going — their self-awareness will shape how you deliver the feedback.", score: 2 },
    ]
  },
  {
    id: 'CO2', dimension: 'communication',
    scenario: 'You are tasked with communicating a major and unpopular organisational change to your team. You have been given a prepared message from corporate communications. You believe the messaging understates the real impact. How do you communicate it?',
    options: [
      { text: "Supplement the corporate message with honest context about what this means practically for your team — without undermining leadership.", score: 3 },
      { text: "Deliver the corporate message as provided — editorialising official communication creates mixed messages and erodes trust in leadership.", score: 1 },
      { text: "Push back to communications and leadership before the message goes out — if the framing is inadequate, the right time to fix it is now.", score: 2 },
      { text: "Deliver the message, then hold a separate open Q&A where you answer honestly — the formal communication and the real conversation can coexist.", score: 2 },
    ]
  },
  {
    id: 'CO3', dimension: 'communication',
    scenario: 'In a senior leadership presentation, you are asked a question you cannot answer confidently. You have a partial answer but are not certain it is accurate. The room is watching. What do you do?',
    options: [
      { text: "Share what you know confidently, clearly flag the parts you are uncertain about, and commit to a specific follow-up by a named date.", score: 3 },
      { text: "Give your best answer without flagging uncertainty — senior audiences expect confidence and will probe if they want more.", score: 0 },
      { text: "Defer entirely — \"I want to give you an accurate answer on this. Let me come back to you by Thursday.\"", score: 2 },
      { text: "Redirect the question — \"That's a great point. [Colleague], you've been closer to that data. What's your read?\"", score: 1 },
    ]
  },
  {
    id: 'CO4', dimension: 'communication',
    scenario: 'A team member gives you direct feedback that your recent communication has been inconsistent — they have heard different things from you in different contexts and it is creating confusion. You did not intend to send mixed messages. How do you respond?',
    options: [
      { text: "Thank them sincerely, ask for specific examples to understand where the inconsistency occurred, and commit to clearer communication going forward.", score: 3 },
      { text: "Explain your reasoning — the different messages may reflect genuinely evolving thinking, which is legitimate to share transparently.", score: 2 },
      { text: "Acknowledge it with the whole team — if one person experienced inconsistency, others likely did too and a group reset is more efficient.", score: 2 },
      { text: "Investigate first — inconsistency may be a perception issue rather than a reality, and you want to understand before changing your approach.", score: 1 },
    ]
  },
  {
    id: 'CO5', dimension: 'communication',
    scenario: 'Information critical to your team\'s work is consistently arriving late from another department, causing delays. The other department manager claims they are sharing information as soon as it is available. The pattern has continued for four months. How do you address it?',
    options: [
      { text: "Request a structured meeting with the other manager to map the information flow end-to-end and identify exactly where the bottleneck sits.", score: 3 },
      { text: "Escalate the pattern to your shared manager with data — four months of documented delays is a systemic issue, not a one-off.", score: 2 },
      { text: "Build a workaround within your team that reduces your dependency on their timeline — control what you can control.", score: 2 },
      { text: "Raise it directly and firmly with the other manager — pattern behaviour requires a direct conversation, not a mapping exercise.", score: 1 },
    ]
  },
  {
    id: 'CO6', dimension: 'communication',
    scenario: 'During a one-to-one, a team member becomes visibly emotional while discussing a personal situation that is affecting their work. They were not expecting to become emotional and appear embarrassed. How do you respond in the moment?',
    options: [
      { text: "Acknowledge their emotion calmly and give them a moment — \"Take your time. This is a safe space.\" Let them lead what happens next.", score: 3 },
      { text: "Offer to reschedule — \"We don't have to do this today. Let's pick this up when you're ready.\"", score: 2 },
      { text: "Refocus gently on the work impact — you are a manager, not a counsellor, and keeping the conversation professional protects both of you.", score: 1 },
      { text: "Suggest they speak with the employee assistance programme — professional support is more appropriate than a manager conversation for personal matters.", score: 1 },
    ]
  },
  {
    id: 'CO7', dimension: 'communication',
    scenario: 'Your team consistently produces work that technically meets the brief but lacks the insight and initiative you expect. When you give feedback, they improve for that piece but revert on the next. The pattern suggests the feedback is not landing. What do you change?',
    options: [
      { text: "Change how you give feedback — shift from corrective to coaching. Ask questions that help them identify the gap themselves rather than telling them.", score: 3 },
      { text: "Make your expectations more explicit upfront — the reverting pattern suggests the standard is not clear enough at the briefing stage.", score: 2 },
      { text: "Address it as a team standard rather than individual feedback — create a shared quality framework that the team holds each other to.", score: 2 },
      { text: "Accept that this is the team's output ceiling — ensure briefs are tight enough to compensate for the initiative gap rather than trying to change the culture.", score: 0 },
    ]
  },
  {
    id: 'CO8', dimension: 'communication',
    scenario: 'You are in a leadership team meeting where a peer presents a plan you believe has a significant flaw that the group is about to approve without challenge. Raising it will slow the decision and may embarrass your peer publicly. What do you do?',
    options: [
      { text: "Raise the concern in the meeting clearly but constructively — \"I want to make sure we've considered X before we finalise this.\"", score: 3 },
      { text: "Speak to your peer privately immediately after the meeting before the plan is implemented — protecting the relationship while flagging the issue.", score: 1 },
      { text: "Ask a clarifying question that surfaces the issue without making it a direct challenge — allow the group to identify the flaw organically.", score: 2 },
      { text: "Let the decision proceed — raising concerns about a peer's plan without prior private conversation is a breach of professional courtesy.", score: 0 },
    ]
  },
  {
    id: 'CO9', dimension: 'communication',
    scenario: 'A new team member from a different cultural background communicates very indirectly. They rarely say no, which you initially interpreted as agreement — but you have since noticed that their indirect cues signal discomfort or disagreement. How do you adapt?',
    options: [
      { text: "Have a private conversation to understand their communication preferences and agree on a shared approach that works for both of you.", score: 3 },
      { text: "Adapt your own communication style to create more space for indirect signals — check in more frequently and read non-verbal cues more actively.", score: 2 },
      { text: "Create structured feedback opportunities — written updates or anonymous channels may be more comfortable for them than direct verbal disagreement.", score: 2 },
      { text: "Coach them gently toward more direct communication — in your organisation's culture, indirect signals are frequently missed and may disadvantage them.", score: 2 },
    ]
  },
  {
    id: 'CO10', dimension: 'communication',
    scenario: 'You have just been given a significant personal development piece of feedback from your own manager — they believe you are not visible enough at senior levels and that this is limiting your progression. You disagree and believe the issue is structural, not behavioural. How do you respond?',
    options: [
      { text: "Engage with the feedback genuinely — even if you disagree, there is likely a kernel of truth. Explore specific examples with your manager before forming a conclusion.", score: 3 },
      { text: "Share your alternative perspective respectfully — \"I hear that. I see it differently and here's why. Can we explore this together?\"", score: 3 },
      { text: "Accept the feedback and take action — senior leader perception is a reality you have to manage regardless of whether it is structurally fair.", score: 2 },
      { text: "Seek a second opinion from a trusted mentor before deciding how to respond — one person's view is not sufficient basis for a behavioural change.", score: 1 },
    ]
  },
]

// ── Scoring & Profiling ───────────────────────────────────────────────
export function scoreLeadership(answers) {
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

  const fitLabel = pct >= 72 ? 'Strong Fit' : pct >= 52 ? 'Moderate Fit' : 'Developing'
  const fitColor = pct >= 72 ? 'var(--ok)' : pct >= 52 ? 'var(--warn)' : 'var(--bad)'

  const sorted = DIMENSIONS.map(d => ({
    ...d,
    pct: dimScores[d.id].max > 0 ? dimScores[d.id].score / dimScores[d.id].max : 0
  })).sort((a, b) => b.pct - a.pct)

  const top = sorted[0].id
  const styleMap = {
    conflict:      'Diplomatic',
    delegation:    'Empowering',
    motivation:    'Inspiring',
    decision:      'Decisive',
    communication: 'Communicative'
  }
  const leadershipStyle = styleMap[top] || 'Balanced'

  return { dimScores, total, maxTotal, pct, fitLabel, fitColor, leadershipStyle }
}

export function getDimQualitative(dimId, pct) {
  const narratives = {
    conflict: {
      high: 'You navigate conflict with skill and maturity — able to hold space for different perspectives while steering toward constructive resolution. Your instinct is to understand before acting, and to separate people from problems. This creates psychological safety and enables teams to work through tension without it becoming damaging.',
      mid:  'You manage conflict reasonably in most situations, though you may sometimes avoid difficult conversations longer than is helpful, or default to structural solutions when a direct human conversation is what is needed. With greater consistency in early intervention you would be a stronger conflict navigator.',
      low:  'Conflict resolution is an area for meaningful development. There is a tendency to either avoid or escalate, rather than working through tension with the people involved. Building structured skills in facilitation, active listening, and constructive challenge will strengthen your leadership considerably.'
    },
    delegation: {
      high: 'You delegate with confidence and intention — matching responsibility to capability, providing appropriate scaffolding, and resisting the urge to over-control. Your team members grow under your leadership because you genuinely trust them with meaningful work. You also know when to step back in, and when not to.',
      mid:  'You delegate in many situations but may retain control when stakes are high or when a team member\'s approach differs from your own. You are developing the confidence to let people find their own way to the right outcome — this is where your next growth in delegation effectiveness will come from.',
      low:  'Delegation is an area requiring development. There is a pattern of retaining work that could be building team capability, or intervening before team members have had the chance to navigate challenges themselves. Building trust in your team and clarity about decision authority will unlock significant capacity.'
    },
    motivation: {
      high: 'You are attuned to what drives individuals and you use that knowledge to create energy, purpose, and commitment. You know that motivation is personal and your approach reflects that — you adapt to the person in front of you, not a formula. Your team members feel seen, challenged appropriately, and valued.',
      mid:  'You motivate your team effectively in stable conditions but may rely on the same approaches across different individuals and contexts. Deepening your understanding of what drives each team member personally, and adapting your style accordingly, would strengthen your motivational impact considerably.',
      low:  'Team motivation is an area for development. There may be a tendency to focus on task delivery over the human conditions that sustain performance. Understanding what energises each team member individually, and actively creating those conditions, will unlock engagement you are currently not fully accessing.'
    },
    decision: {
      high: 'You make decisions with clarity, courage, and accountability. You are comfortable acting on incomplete information when the situation demands it, and you take genuine ownership of outcomes — both when decisions work and when they do not. This decisiveness, combined with your willingness to course-correct, builds credibility.',
      mid:  'You make sound decisions in familiar territory and are developing confidence in higher-stakes or more ambiguous situations. There is a tendency to over-seek consensus or to delay when acting with imperfect information would be appropriate. Calibrating your threshold for action will be key to your next level of leadership.',
      low:  'Decision making under ambiguity is an area for development. There may be a preference for certainty before acting, or a tendency to defer decisions upward that are within your authority. Building a framework for structured decision making under uncertainty — and practising it — will strengthen this dimension significantly.'
    },
    communication: {
      high: 'You communicate with precision, empathy, and impact. You adapt your style to the audience and the context — direct when directness is needed, thoughtful when the situation calls for care. You listen actively and create the conditions in which honest dialogue can happen. Your presence in difficult conversations is a genuine leadership asset.',
      mid:  'You communicate effectively in most contexts but may find certain communication challenges more difficult — delivering uncomfortable feedback, holding firm under pressure, or adapting to very different communication styles. Developing range and consistency across these harder conversations will significantly raise your communication effectiveness.',
      low:  'Communication is an area requiring development. There may be a preference for avoiding difficult conversations, over-softening messages, or communicating in ways that create ambiguity rather than clarity. Developing a more direct and adaptive communication style — particularly in high-stakes contexts — will be a high-impact development priority.'
    }
  }
  const n = narratives[dimId]
  if (!n) return ''
  return pct >= 68 ? n.high : pct >= 45 ? n.mid : n.low
}

export function getOverallNarrative(fitLabel, leadershipStyle, pct) {
  if (fitLabel === 'Strong Fit') {
    return 'This assessment indicates strong leadership capability across the evaluated dimensions. A ' + leadershipStyle.toLowerCase() + ' leadership orientation is evident — combined with sound judgement, genuine empathy, and the ability to hold complexity without defaulting to simple answers. The response patterns suggest a leader who is credible under pressure, trusted by their team, and capable of navigating the ambiguous, people-centred challenges that define effective people management.'
  } else if (fitLabel === 'Moderate Fit') {
    return 'This assessment indicates solid leadership foundations with clear areas of strength and identifiable development priorities. A ' + leadershipStyle.toLowerCase() + ' orientation is a genuine asset, and the response patterns suggest good instincts in many leadership situations. Continued stretch, structured feedback, and deliberate practice in the development dimensions identified will accelerate the journey toward consistently high-impact leadership.'
  } else {
    return 'This assessment suggests that leadership capability is at an earlier stage of development. There are genuine strengths to build on, and the instincts shown in several dimensions provide a real foundation. The development priorities identified are learnable — they respond well to coaching, structured experience, and reflective practice. With the right investment, meaningful growth in leadership effectiveness is achievable.'
  }
}

export function selectQuestions(n, seed) {
  const perDim = Math.floor(n / DIMENSIONS.length)
  const selected = []

  DIMENSIONS.forEach(dim => {
    const pool = SJT_QUESTIONS.filter(q => q.dimension === dim.id)
    let s = seed + dim.id.charCodeAt(0) * 31
    const shuffled = [...pool]
    for (let i = shuffled.length - 1; i > 0; i--) {
      s = (s * 1664525 + 1013904223) & 0xffffffff
      const j = Math.abs(s) % (i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    selected.push(...shuffled.slice(0, perDim))
  })

  let s2 = seed + 9999
  for (let i = selected.length - 1; i > 0; i--) {
    s2 = (s2 * 1664525 + 1013904223) & 0xffffffff
    const j = Math.abs(s2) % (i + 1);
    [selected[i], selected[j]] = [selected[j], selected[i]]
  }
  return selected.slice(0, n)
}
