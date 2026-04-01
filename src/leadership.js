// ── Leadership SJT Question Bank v3 ──────────────────────────────────
// AI-resistant design principles:
// 1. All 4 options are defensible best practices from different frameworks
// 2. Scoring rubric is private — AI cannot know which option scores highest
// 3. Context-dependent answers — buried details change the right answer
// 4. Reverse-scored traps — most "professional-sounding" option scores lower
// 5. Numeric/data scenarios — AI tools misweight quantitative constraints
// 6. Double-bind options — two excellent choices but one fits the context better

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
    scenario: 'Two senior engineers — both with 8+ years tenure — have escalated a technical disagreement to you. Engineer A wants to refactor the legacy codebase (3-month effort, lower long-term risk). Engineer B wants to ship a workaround now (2-week effort, higher long-term debt). The client delivery deadline is in 6 weeks. Both engineers have credible arguments and your CTO is watching. What do you do?',
    options: [
      { text: 'Side with Engineer B — the 6-week deadline is the primary constraint and the workaround keeps the client commitment intact.', score: 2 },
      { text: 'Side with Engineer A — short-term workarounds compound into long-term failure and technical leadership requires protecting against that.', score: 1 },
      { text: 'Escalate to the CTO — a decision with this level of strategic and technical complexity should not rest with you alone.', score: 0 },
      { text: 'Facilitate a structured session with both engineers to define the minimum viable refactor that reduces long-term debt without missing the deadline.', score: 3 },
    ]
  },
  {
    id: 'C2', dimension: 'conflict',
    scenario: 'Your team engagement score dropped from 74 to 51 in 90 days. Exit interviews from two recent departures both cite "management style" as a reason. You have not changed your approach. One remaining senior team member privately tells you the team finds your feedback style harsh, but your manager has praised your directness repeatedly. You have a team meeting tomorrow. What is your priority action today?',
    options: [
      { text: 'Prepare a structured agenda for tomorrow\'s meeting that addresses team concerns directly and transparently.', score: 2 },
      { text: 'Speak individually with 2-3 trusted team members today to get specific examples before making any changes.', score: 3 },
      { text: 'Review your recent feedback interactions and identify where your delivery may have landed differently than intended.', score: 2 },
      { text: 'Trust your manager\'s assessment — your style is working at the organisational level and some team friction is the cost of high standards.', score: 0 },
    ]
  },
  {
    id: 'C3', dimension: 'conflict',
    scenario: 'Two team members have a personal conflict that is now affecting sprint velocity — down 18% over 3 weeks. One is a junior developer (6 months in, high potential). The other is your tech lead (critical to the project, 4 years tenure). The tech lead has privately told you the junior is "not cut out for this team." The junior has privately told you the tech lead is "creating a hostile environment." You have 4 weeks until your most important release. What do you address first?',
    options: [
      { text: 'Address the tech lead first — senior team members set the cultural standard and their behaviour has disproportionate impact.', score: 3 },
      { text: 'Bring both together immediately — transparency and direct confrontation of the issue is the fastest path to resolution.', score: 1 },
      { text: 'Focus on the junior developer first — they are most vulnerable and most likely to leave if the environment does not improve.', score: 1 },
      { text: 'Restructure the sprint so both individuals have minimal overlap for the next 4 weeks — protect the release first, resolve the relationship second.', score: 2 },
    ]
  },
  {
    id: 'C4', dimension: 'conflict',
    scenario: 'A high-performing team member (top 10% of your organisation by output) has filed an informal complaint against a peer, citing repeated interruptions and dismissiveness in meetings. The accused peer is well-liked, has never had a complaint before, and denies the behaviour was intentional. HR has advised you that no formal investigation is triggered at this stage. The complainant says they will escalate formally if nothing changes. What do you do?',
    options: [
      { text: 'Treat it as a formal matter regardless of HR\'s threshold — document everything and involve HR proactively to protect both parties.', score: 2 },
      { text: 'Have a direct conversation with the accused peer about the specific behaviours and their impact, without framing it as a complaint.', score: 3 },
      { text: 'Facilitate a mediated conversation between both parties with you present — surface the issue in a controlled setting.', score: 1 },
      { text: 'Reassure the complainant you are taking it seriously, then monitor future interactions before deciding on action.', score: 0 },
    ]
  },
  {
    id: 'C5', dimension: 'conflict',
    scenario: 'Your organisation has just announced a restructure. Two of your team members applied for the same new role. You were on the selection panel and you know who got it, but the announcement has not been made yet. The unsuccessful candidate — your strongest individual contributor — approaches you visibly anxious and asks directly: "Did I get the role?" The announcement is scheduled for tomorrow morning. What do you say?',
    options: [
      { text: 'Confirm they did not get it — they asked directly and deserve honesty. Soften it by immediately pivoting to their development path.', score: 1 },
      { text: 'Tell them you cannot share the outcome yet but that the announcement is coming very soon — and that you want to speak with them after.', score: 3 },
      { text: 'Redirect: "I want to make sure you hear this in the right way — let\'s talk properly tomorrow after the announcement."', score: 2 },
      { text: 'Tell them the decision was very close and leave it at that — technically not lying and protects the process.', score: 0 },
    ]
  },
  {
    id: 'C6', dimension: 'conflict',
    scenario: 'A client has escalated a complaint directly to your CEO, bypassing you entirely. The complaint cites "slow response times and lack of accountability" from your team. You believe the complaint is partially valid — there were two delayed responses last month — but also inflated. Your CEO has forwarded it to you and asked for a response within 2 hours. How do you respond to your CEO?',
    options: [
      { text: 'Provide a full factual account — acknowledge the two delays, explain the context, and outline what process changes are already in place.', score: 3 },
      { text: 'Ask for 24 hours to investigate properly before responding — a rushed response risks getting the facts wrong.', score: 1 },
      { text: 'Respond quickly acknowledging the complaint fully and committing to a detailed review — prioritise the CEO relationship over nuance.', score: 1 },
      { text: 'Frame the response around the client relationship and what you will do differently — avoid dwelling on what went wrong.', score: 2 },
    ]
  },
  {
    id: 'C7', dimension: 'conflict',
    scenario: 'Two department heads who both report to you have been in conflict for 6 months over resource allocation. You have mediated three times with temporary resolutions each time. The conflict is now escalating again and affecting cross-functional delivery. Your own manager has noticed and asked you to "sort it out." A peer suggests you simply split the shared resource permanently. What is your approach this time?',
    options: [
      { text: 'Implement the permanent resource split immediately — you have mediated three times and the temporary resolutions are not working.', score: 2 },
      { text: 'Diagnose why the previous resolutions failed before implementing anything — you are solving a symptom, not the cause.', score: 3 },
      { text: 'Escalate to your own manager with a recommendation — three failed mediations means this is now above your resolution authority.', score: 1 },
      { text: 'Set a final deadline for both department heads to agree a solution themselves — make clear that the next step is a unilateral decision by you.', score: 2 },
    ]
  },
  {
    id: 'C8', dimension: 'conflict',
    scenario: 'You discover that two team members have been sending each other messages critical of a third colleague — messages that have now been forwarded to you by someone else on the team. The messages are unprofessional but not discriminatory or policy-violating. The colleague being discussed is unaware. The team dynamics are already fragile after a difficult quarter. What do you do?',
    options: [
      { text: 'Address it with the two individuals privately — the behaviour is unprofessional regardless of whether it violated policy.', score: 3 },
      { text: 'Do nothing — private messages between colleagues are not your domain unless they escalate or affect performance.', score: 0 },
      { text: 'Inform the colleague who was discussed — they have a right to know and transparency is the foundation of a healthy team culture.', score: 1 },
      { text: 'Use it as an opportunity to address team culture broadly without singling anyone out — a team-level conversation about respect.', score: 2 },
    ]
  },
  {
    id: 'C9', dimension: 'conflict',
    scenario: 'Your highest-billed client has requested that a specific team member be removed from their account, citing "communication style differences." The team member is technically excellent, has done nothing wrong by your assessment, and the removal would send a damaging signal to the rest of your team. The client represents 22% of your team\'s annual revenue. What is your position?',
    options: [
      { text: 'Decline the request and explain why — client preferences cannot override your team members\' professional standing without cause.', score: 1 },
      { text: 'Agree to the request — 22% revenue concentration is too high a risk to defend a preference issue.', score: 1 },
      { text: 'Request a meeting with the client to understand the specific concerns before making any decision — the issue may be resolvable without removal.', score: 3 },
      { text: 'Agree to the request but reframe it as a development opportunity for the team member — new account, new challenge.', score: 2 },
    ]
  },
  {
    id: 'C10', dimension: 'conflict',
    scenario: 'During a reorg, two team members were told informally (not by you) that they would be promoted. The reorg finalised and neither received the promotion — budget was cut. Both are now disengaged and one has started job hunting. You were not involved in the informal communication. HR says the informal promises were not sanctioned. What do you do?',
    options: [
      { text: 'Acknowledge the situation honestly with both individuals — they were given false expectations and they deserve that validation even if it was not your mistake.', score: 3 },
      { text: 'Focus on retention — immediately explore what non-promotion recognition or development you can offer within the current budget.', score: 2 },
      { text: 'Escalate to HR and the person who made the informal promises — the accountability sits there, not with you.', score: 1 },
      { text: 'Do not acknowledge the informal promises as they were not sanctioned — focus purely on future development conversations.', score: 0 },
    ]
  },

  // ── DELEGATION & EMPOWERMENT (10 questions) ───────────────────────────

  {
    id: 'D1', dimension: 'delegation',
    scenario: 'You have a critical deliverable due Friday. Your most capable team member could complete it in 2 days but is already at 90% capacity. A less experienced team member is at 60% capacity and could complete it in 4 days — tight but feasible. A third option: you complete it yourself in 1.5 days. It is Monday morning. What do you do?',
    options: [
      { text: 'Complete it yourself — the deadline risk is too high to delegate under these conditions and your time is justified here.', score: 1 },
      { text: 'Assign it to the capable team member — manage their capacity by deprioritising something else on their plate.', score: 3 },
      { text: 'Assign it to the less experienced team member — the development opportunity is valuable and the timeline is feasible if you provide close support.', score: 2 },
      { text: 'Split the work — you handle the structure and difficult sections, the less experienced team member handles the execution components.', score: 2 },
    ]
  },
  {
    id: 'D2', dimension: 'delegation',
    scenario: 'You delegated a client proposal to a senior team member 2 weeks ago. You check in today — 3 days before the deadline — and find the work is only 40% complete, the approach is different from what you briefed, and the team member seems confident it will be fine. The client is a strategic priority account. What do you do?',
    options: [
      { text: 'Step in immediately and take over the proposal — the risk to the client relationship is too high.', score: 1 },
      { text: 'Have an urgent honest conversation — understand their plan for completion, assess whether their approach has merit, then decide on intervention level.', score: 3 },
      { text: 'Assign a second team member to support and accelerate — do not take it away but add resource to de-risk the deadline.', score: 2 },
      { text: 'Trust the team member — they said it will be fine and undermining their ownership now creates a worse long-term dynamic.', score: 0 },
    ]
  },
  {
    id: 'D3', dimension: 'delegation',
    scenario: 'A team member consistently delivers excellent work but always exceeds the agreed timeline by 20-30%. Their quality is the highest on the team. Your stakeholders have started to notice and comment on the delays. The team member says they need the extra time to meet their own quality bar. What is the real problem you need to solve?',
    options: [
      { text: 'A quality calibration problem — help them understand that 85% quality on time is more valuable than 100% quality late.', score: 2 },
      { text: 'A workload and estimation problem — work with them to build more realistic timelines upfront rather than adjusting quality expectations.', score: 3 },
      { text: 'A stakeholder management problem — manage expectations with stakeholders better so the delays are pre-communicated and absorbed.', score: 1 },
      { text: 'A delegation fit problem — this person should be working on fewer, higher-stakes projects where the extra time investment is justified.', score: 2 },
    ]
  },
  {
    id: 'D4', dimension: 'delegation',
    scenario: 'You have been promoted and must now delegate your previous specialist role to someone on your team. The most technically qualified person has low confidence and frequently defers to you. The second-best candidate is confident but sometimes cuts corners. The third option is to hire externally. The role is critical to team output. What do you decide?',
    options: [
      { text: 'Develop the qualified but low-confidence team member into the role — they have the right foundation and confidence is buildable with structured support.', score: 3 },
      { text: 'Give it to the confident team member and put guardrails around quality — confidence and motivation matter more than raw technical score.', score: 2 },
      { text: 'Hire externally — neither internal candidate is optimal and this role is too critical to use as a development exercise.', score: 1 },
      { text: 'Split the responsibility temporarily across both internal candidates while you assess — keep your options open.', score: 1 },
    ]
  },
  {
    id: 'D5', dimension: 'delegation',
    scenario: 'You delegated ownership of a team process to a team member 3 months ago. The process has measurably improved — errors down 40%, speed up 25%. The team member has now started making changes to adjacent processes without asking you. Some changes are good. One created a downstream problem for another team. What do you do?',
    options: [
      { text: 'Praise the initiative, address the specific downstream issue, and clarify the boundaries of their authority going forward.', score: 3 },
      { text: 'Withdraw some of the autonomy — unsanctioned changes to adjacent processes show they are not ready for expanded scope.', score: 1 },
      { text: 'Do nothing yet — the net impact is positive and clarifying boundaries now may stifle their initiative.', score: 1 },
      { text: 'Use it as a team discussion to collectively define the principles for when changes require sign-off versus can be made autonomously.', score: 2 },
    ]
  },
  {
    id: 'D6', dimension: 'delegation',
    scenario: 'You have 7 direct reports. Analysis shows you spend 60% of your time reviewing and approving their work before it goes out. Your manager says you need to be more strategic. When you ask your team why they always bring work for approval, they say "because you always find something to change." What do you change first?',
    options: [
      { text: 'Your approval behaviour — you have trained the team to seek approval by consistently changing their work. The bottleneck is you.', score: 3 },
      { text: 'The team\'s confidence — implement structured feedback sessions to raise their self-assessment capability before changing approval flows.', score: 2 },
      { text: 'The process — create a documented quality standard so team members can self-assess against it before bringing work to you.', score: 2 },
      { text: 'The expectation — make clear that you expect them to submit work directly to stakeholders and copy you, reversing the approval flow.', score: 1 },
    ]
  },
  {
    id: 'D7', dimension: 'delegation',
    scenario: 'A high-potential team member asks for a significant stretch assignment — leading a cross-functional project that is one level above their current grade. You believe they are 70% ready. The project has moderate stakes and a 3-month timeline. Your peer manager says the person is not ready and would be "set up to fail." What do you decide?',
    options: [
      { text: 'Give them the assignment with structured support — 70% ready is sufficient for a stretch role and your peer\'s risk aversion should not override your assessment.', score: 3 },
      { text: 'Decline for now — your peer\'s perspective adds evidence that the readiness gap may be larger than you assessed.', score: 1 },
      { text: 'Give them the assignment but position your peer as a shadow advisor — bring them into the support structure rather than leaving them as an opposing voice.', score: 2 },
      { text: 'Create a smaller proof-of-concept project first — let the team member demonstrate readiness on a lower-stakes assignment before the cross-functional lead role.', score: 2 },
    ]
  },
  {
    id: 'D8', dimension: 'delegation',
    scenario: 'You manage a team of 12 across two locations. The co-located group (8 people) is visibly more engaged and receives more of your informal coaching time simply due to proximity. The remote group (4 people) is performing adequately but two have flagged feeling disconnected in their last check-ins. You have 6 hours per week of available 1:1 time. How do you restructure your delegation and coaching approach?',
    options: [
      { text: 'Allocate proportionally more 1:1 time to the remote group temporarily — correct the structural imbalance you have created.', score: 3 },
      { text: 'Appoint an informal team lead in the remote location to bridge the gap — you cannot replicate physical proximity with calendar time alone.', score: 2 },
      { text: 'Move some of your 1:1s with the co-located group to group sessions, freeing up time for more remote 1:1s.', score: 2 },
      { text: 'Address it in a full-team session — acknowledge the imbalance openly and invite the team to help design a solution.', score: 1 },
    ]
  },
  {
    id: 'D9', dimension: 'delegation',
    scenario: 'A team member returns a piece of delegated work and tells you they cannot complete it — it is outside their skill set and they should have flagged it earlier but felt pressured not to. You have 48 hours until the deadline. The team member is visibly distressed. What is your immediate priority?',
    options: [
      { text: 'Solve the deadline problem first — identify who can complete the work in 48 hours and reassign immediately.', score: 2 },
      { text: 'Address the team member\'s distress first — a conversation that makes them feel safe will prevent this recurring more than any other action.', score: 2 },
      { text: 'Do both simultaneously — brief a replacement on the task while having a quick but genuine check-in with the distressed team member.', score: 3 },
      { text: 'Escalate the deadline to the stakeholder immediately — buy time before solving the resourcing problem.', score: 1 },
    ]
  },
  {
    id: 'D10', dimension: 'delegation',
    scenario: 'You are being considered for a VP role. Your current team of 5 would expand to 18 across 3 functions. You currently do a lot of the strategic thinking yourself and delegate execution. At VP level you will need to delegate strategy too. Two of your current team members could take on more strategic work. Your manager says your biggest development gap is "letting go of strategy." What do you prioritise in the next 90 days?',
    options: [
      { text: 'Deliberately delegate one significant strategic workstream to each of the two capable team members — create the evidence of strategic delegation.', score: 3 },
      { text: 'Work with a coach or mentor to address the underlying behaviour that drives your tendency to retain strategy.', score: 2 },
      { text: 'Ask your manager for specific examples of where you failed to delegate strategy — you need concrete data before you can change the behaviour.', score: 2 },
      { text: 'Focus on developing the two capable team members\' strategic skills first — you cannot delegate what they are not ready to receive.', score: 1 },
    ]
  },

  // ── TEAM MOTIVATION (10 questions) ───────────────────────────────────

  {
    id: 'M1', dimension: 'motivation',
    scenario: 'Your team has just delivered a project 2 weeks early and 8% under budget. The client gave exceptional feedback. Senior leadership sent a company-wide congratulations email. Two days later, your top contributor privately tells you they feel invisible — they did 40% of the work but the recognition email did not mention anyone by name. How do you respond?',
    options: [
      { text: 'Acknowledge their contribution directly and specifically in your next team meeting — name the work and its impact publicly.', score: 2 },
      { text: 'Escalate to the person who sent the company-wide email and ask them to send a follow-up that acknowledges individual contributors.', score: 1 },
      { text: 'Have a private conversation that validates their specific contribution and asks how they prefer to be recognised in future — then act on it.', score: 3 },
      { text: 'Frame it as a team achievement — great outcomes belong to teams and it is important they internalise that.', score: 0 },
    ]
  },
  {
    id: 'M2', dimension: 'motivation',
    scenario: 'Three of your eight team members are clearly disengaged — arriving late to meetings, contributing minimally, and doing just enough. The other five are high performers. The disengaged three are not violating any policies. Your manager says to "manage them out." You believe the disengagement has a cause. Before taking any action, what do you need to know?',
    options: [
      { text: 'Whether the disengagement started at the same time — a common trigger suggests a systemic cause rather than individual attitude.', score: 3 },
      { text: 'Whether their performance metrics meet the minimum bar — if they do, managing them out is premature regardless of engagement levels.', score: 2 },
      { text: 'What the five high performers think — peer perception of the disengaged three is important data in deciding how to intervene.', score: 1 },
      { text: 'Whether your own management behaviour changed around the time the disengagement began — you may be part of the cause.', score: 2 },
    ]
  },
  {
    id: 'M3', dimension: 'motivation',
    scenario: 'Your most ambitious team member has told you they want to be a director within 18 months. Based on your honest assessment, they are 3-4 years away. They are performing well but lack the political acumen, executive presence, and cross-functional credibility required at director level. They are also your best individual contributor. How do you approach the next career conversation?',
    options: [
      { text: 'Be honest about the 3-4 year realistic timeline — a false 18-month expectation will damage trust more than the truth.', score: 3 },
      { text: 'Focus the conversation on what they need to develop rather than the timeline — define the gap without specifying how long it will take.', score: 2 },
      { text: 'Support the 18-month aspiration and create a stretch plan — ambitious timelines with the right support sometimes work, and they are your best contributor.', score: 1 },
      { text: 'Consult with your HR partner before the conversation — a director promotion timeline involves stakeholders beyond you.', score: 1 },
    ]
  },
  {
    id: 'M4', dimension: 'motivation',
    scenario: 'You manage a team of analysts. One has just discovered that a peer doing identical work at a competitor earns 28% more. They have brought salary data to your 1:1 and asked you to match it. The data appears credible. You know your organisation is 15-20% below market. You do not control compensation. What do you say in this meeting?',
    options: [
      { text: 'Validate the data, acknowledge the gap honestly, commit to escalating it internally, and be transparent about what you can and cannot control.', score: 3 },
      { text: 'Tell them the decision is above your authority and direct them to HR — you should not be having compensation conversations without HR present.', score: 0 },
      { text: 'Challenge the comparability of the data — different companies, different roles, different total comp packages make direct comparison difficult.', score: 1 },
      { text: 'Focus on the non-monetary aspects of their role — growth opportunity, culture, stability — to reframe the conversation.', score: 1 },
    ]
  },
  {
    id: 'M5', dimension: 'motivation',
    scenario: 'You inherited a team 4 months ago. The previous manager was described as "inspiring but chaotic." The team loved the energy but missed deadlines regularly. You have introduced structure and delivery has improved — on-time delivery up from 58% to 89%. But the last two team surveys show satisfaction dropped from 81% to 63%. Three team members have told you informally they "miss the old vibe." What do you do?',
    options: [
      { text: 'Hold the course — 89% on-time delivery is the right outcome and satisfaction will recover as the team adapts to a high-performing structure.', score: 1 },
      { text: 'Explore specifically what "vibe" means to the team — the drop may signal something addressable that is separate from structure.', score: 3 },
      { text: 'Introduce structured social and creative elements into team time — performance and culture are not mutually exclusive.', score: 2 },
      { text: 'Acknowledge the change directly in a team session — name that the shift from the previous manager\'s style has been significant and invite dialogue.', score: 2 },
    ]
  },
  {
    id: 'M6', dimension: 'motivation',
    scenario: 'A team member who was previously your highest performer has been in a visible personal crisis for 6 weeks — performance is down 35%, they have missed two deadlines, and they have been tearful in two 1:1s. They have declined your offer of EAP support. Their workload is being absorbed by the rest of the team who are beginning to show strain. It has been 6 weeks. What do you do now?',
    options: [
      { text: 'Implement a formal performance plan — 6 weeks is enough time and the rest of the team cannot absorb the workload indefinitely.', score: 0 },
      { text: 'Have a direct conversation: acknowledge the support they have declined, name the impact on the team, and explore what they actually need right now.', score: 3 },
      { text: 'Consult HR about your obligations and options — you need to know what formal steps are available before your next conversation.', score: 2 },
      { text: 'Redistribute their workload formally and reduce their responsibilities temporarily — remove the pressure without making it punitive.', score: 2 },
    ]
  },
  {
    id: 'M7', dimension: 'motivation',
    scenario: 'Your organisation has introduced a forced ranking system. You must designate 10% of your team as "below expectations" regardless of their actual performance. Your entire team is performing well — no one genuinely belongs in that category. The policy is non-negotiable. Two team members are marginally lower than the rest. How do you handle the forced ranking conversation with the two designated as "below expectations"?',
    options: [
      { text: 'Be completely transparent — tell them the ranking is a result of the forced distribution system, not a genuine reflection of their performance.', score: 3 },
      { text: 'Use the conversation to set higher performance targets — even high-performing teams have development areas to address.', score: 1 },
      { text: 'Soften the language in the conversation and focus on development — protect their motivation while technically fulfilling the policy requirement.', score: 2 },
      { text: 'Escalate to HR before the conversations — a system that requires you to misrepresent performance has ethical implications you should not navigate alone.', score: 2 },
    ]
  },
  {
    id: 'M8', dimension: 'motivation',
    scenario: 'You are running a team of 10 through a 9-month digital transformation. At month 5, an external benchmarking report shows your team\'s change adoption score is 34th percentile — below your internal target of 60th. Your sponsor is concerned. Your team is working hard but the ambiguity of the transformation is causing anxiety. What is the most effective intervention at this stage?',
    options: [
      { text: 'Increase the frequency of team communications and share progress data transparently — ambiguity is the primary driver of low adoption scores.', score: 2 },
      { text: 'Identify the 2-3 individuals with the lowest adoption scores and focus intensive support on them — they are disproportionately pulling the average down.', score: 1 },
      { text: 'Diagnose what is specifically driving the low score before intervening — the 34th percentile tells you something is wrong but not what.', score: 3 },
      { text: 'Reset expectations with your sponsor — 34th percentile at month 5 of a 9-month transformation may be within normal range before adoption accelerates.', score: 2 },
    ]
  },
  {
    id: 'M9', dimension: 'motivation',
    scenario: 'Two of your best team members have been headhunted by the same competitor. One has told you. The other has not but you have heard through a third party. Neither has resigned yet. The competitor is offering 30% salary increases. You cannot match the salary. What do you do with the information you have?',
    options: [
      { text: 'Speak to the one who told you — acknowledge their transparency, be honest about what you can and cannot offer, and explore what would make them stay.', score: 2 },
      { text: 'Speak to both — address the person who told you formally and the other informally, making clear you want to understand their thinking.', score: 3 },
      { text: 'Do nothing until resignations are submitted — acting on unconfirmed information about the second person risks damaging trust.', score: 1 },
      { text: 'Use the situation to make a case to leadership for a market salary review — the individual cases are symptoms of a structural problem.', score: 2 },
    ]
  },
  {
    id: 'M10', dimension: 'motivation',
    scenario: 'Your team has been told they must return to the office 4 days per week, reversing a 3-day remote policy they have had for 2 years. The team is unhappy. Two people have said they will resign. You personally disagree with the policy but it is final. You have a team meeting in 1 hour to communicate it. What is your approach?',
    options: [
      { text: 'Present the policy with full support — your personal view is irrelevant and divided leadership signals undermine implementation.', score: 1 },
      { text: 'Present the policy clearly, acknowledge that you understand this is difficult, and open the floor for questions — do not pretend to feel something you do not.', score: 3 },
      { text: 'Present the policy and immediately pivot to what you can influence — flexible hours, desk arrangements, remote Fridays as an exception.', score: 2 },
      { text: 'Tell the team you personally advocated against the policy but were overruled — they deserve to know you tried.', score: 1 },
    ]
  },

  // ── DECISION MAKING (10 questions) ───────────────────────────────────

  {
    id: 'DE1', dimension: 'decision',
    scenario: 'You have $200,000 discretionary budget for Q4. Option A: invest in an automation tool that saves 2.5 hours per person per week across 15 people (projected ROI: 14 months). Option B: bring in 2 contractors for 3 months to clear a backlog worth an estimated $180,000 in delayed revenue. Option C: invest in team training that your team has been requesting for 18 months. You must commit by Friday. What do you choose?',
    options: [
      { text: 'Option B — the $180,000 delayed revenue recovery has the clearest and most immediate financial return.', score: 2 },
      { text: 'Option A — long-term efficiency gains compound in value and 14-month ROI is strong for infrastructure investment.', score: 2 },
      { text: 'Option C — 18 months of requesting signals this is a significant retention and engagement risk that financial metrics do not capture.', score: 1 },
      { text: 'Split B and C — clear the backlog (highest immediate return) and make a partial training investment (highest retention signal) rather than an all-or-nothing choice.', score: 3 },
    ]
  },
  {
    id: 'DE2', dimension: 'decision',
    scenario: 'Your team is 3 weeks from launch. QA has identified 47 bugs — 12 critical, 23 major, 12 minor. Engineering says fixing all critical bugs requires 4 weeks. Marketing has a $400,000 campaign locked in for the launch date. You can launch with critical bugs if you implement workarounds that affect 8% of user journeys. What do you recommend?',
    options: [
      { text: 'Delay the launch — shipping known critical bugs is a reputational and potentially legal risk that outweighs the campaign cost.', score: 2 },
      { text: 'Launch with the workarounds for 8% of journeys — the business cannot absorb a $400,000 campaign loss and 8% is a manageable degraded experience.', score: 1 },
      { text: 'Escalate immediately to the executive team with a clear risk/cost analysis of both options — this decision is above your authority level.', score: 2 },
      { text: 'Push for a 2-week delay and renegotiate the campaign — fix the highest-risk critical bugs and launch with a smaller subset of workarounds, reducing the 8% impact.', score: 3 },
    ]
  },
  {
    id: 'DE3', dimension: 'decision',
    scenario: 'You are 6 months into a strategic initiative that was your idea and that you championed to the board. New data suggests the market assumption the initiative was based on was incorrect — the addressable market is 40% smaller than projected. The initiative has consumed $1.2M so far. It would take another $800,000 to complete. If completed in the smaller market the projected return is break-even at best. What do you recommend?',
    options: [
      { text: 'Recommend stopping the initiative — sunk costs should not drive future investment and break-even in a smaller market is not strategic.', score: 3 },
      { text: 'Recommend completing it — stopping now wastes the $1.2M already invested and break-even still returns the remaining $800,000.', score: 0 },
      { text: 'Recommend a 60-day pivot assessment — explore whether the initiative can be redirected toward a different market application before committing to stop or continue.', score: 2 },
      { text: 'Bring in an external advisor to validate the new market data before making a recommendation — your objectivity is compromised as the initiative champion.', score: 2 },
    ]
  },
  {
    id: 'DE4', dimension: 'decision',
    scenario: 'You need to hire a senior role in 6 weeks. After interviews, two candidates remain. Candidate A: technically exceptional, cultural fit concerns raised by 3 of 5 interviewers, 20% cheaper. Candidate B: technically strong (not exceptional), strong cultural fit, asks 20% above budget. Your hiring manager prefers Candidate A. Your team\'s feedback is split 3-2 in favour of Candidate B. What do you decide?',
    options: [
      { text: 'Hire Candidate A — technical excellence is harder to develop than cultural fit, and the budget saving is material.', score: 1 },
      { text: 'Hire Candidate B — cultural fit concerns from 3 of 5 interviewers is a significant signal that should not be overridden by technical score.', score: 2 },
      { text: 'Go back to market — neither candidate is a clear hire and a rushed decision on a senior role is more costly than a 6-week delay.', score: 2 },
      { text: 'Hire Candidate B, negotiate on the salary — the cultural fit signal is more predictive of long-term success and the gap may be closeable.', score: 3 },
    ]
  },
  {
    id: 'DE5', dimension: 'decision',
    scenario: 'You discover at 4pm on a Friday that a report sent to a regulator earlier that week contained a material error — a figure was overstated by 23%. The error was made by a team member who has already left for the weekend. Correcting it may trigger a regulatory inquiry. Not correcting it may be worse if discovered later. Your legal team is unavailable until Monday. What do you do?',
    options: [
      { text: 'Wait until Monday and involve legal before taking any action — acting without legal advice on a regulatory matter creates more risk.', score: 0 },
      { text: 'Contact your legal team via emergency channels tonight — regulatory errors have time-sensitive remediation windows that cannot wait until Monday.', score: 3 },
      { text: 'Contact the regulator directly to notify them of the error — proactive disclosure always reduces regulatory risk regardless of legal involvement.', score: 1 },
      { text: 'Document everything thoroughly tonight and prepare a full correction package so you are ready to act first thing Monday with legal support.', score: 2 },
    ]
  },
  {
    id: 'DE6', dimension: 'decision',
    scenario: 'You manage a product team. User research shows two features — Feature X (requested by 78% of users, low engineering complexity, low strategic value) and Feature Y (requested by 12% of users, high complexity, high strategic value) — are both on your backlog. You have one sprint of capacity. Your CEO informally mentioned Feature X last week. Your product strategy document prioritises Feature Y. What do you build?',
    options: [
      { text: 'Feature X — 78% user demand plus CEO interest is a clear signal from two independent sources.', score: 1 },
      { text: 'Feature Y — your product strategy exists for a reason and informal CEO comments should not override a documented strategic framework.', score: 2 },
      { text: 'Feature Y — but proactively align with the CEO on why Feature X is deprioritised before the sprint starts.', score: 3 },
      { text: 'Feature X — and use the momentum to build credibility with the CEO before making the case for strategic features in future sprints.', score: 1 },
    ]
  },
  {
    id: 'DE7', dimension: 'decision',
    scenario: 'Your team\'s data shows that Channel A (your core channel, 5 years of investment) is declining at 8% per year. Channel B (emerging, 18 months of data) is growing at 34% per year but is currently 12% of Channel A\'s volume. Migrating fully to Channel B would take 18 months and $600,000. Staying with Channel A maintains current revenue for approximately 4 more years before decline becomes critical. What do you recommend to leadership?',
    options: [
      { text: 'Begin migration to Channel B now — 34% growth versus 8% decline makes the long-term trajectory clear and waiting makes migration harder.', score: 2 },
      { text: 'Invest in both — use Channel A revenue to fund Channel B growth for 12 months before committing to full migration.', score: 3 },
      { text: 'Wait 12 more months of Channel B data before recommending migration — 18 months of growth data is insufficient to commit $600,000.', score: 2 },
      { text: 'Commission an independent market analysis — a decision of this scale requires external validation of your internal data.', score: 1 },
    ]
  },
  {
    id: 'DE8', dimension: 'decision',
    scenario: 'Your highest-performing team member asks to move to a 4-day week for personal reasons. Their output would likely drop 15% (you estimate). They are currently contributing at 130% of a normal team member. Even at 85% of their current output, they would still outperform the team average. HR policy does not explicitly allow or prohibit 4-day arrangements. Your manager has said "use your judgement." What do you decide?',
    options: [
      { text: 'Approve it — at 85% of their current output they still outperform the team average and forcing full-time hours risks losing them entirely.', score: 3 },
      { text: 'Decline — approving an off-policy arrangement for one team member creates precedent and fairness issues with the rest of the team.', score: 1 },
      { text: 'Approve it as a 3-month trial and evaluate the actual output impact before making it permanent.', score: 2 },
      { text: 'Escalate to HR to create a formal policy before approving — your judgement call should be supported by a framework that applies fairly to everyone.', score: 2 },
    ]
  },
  {
    id: 'DE9', dimension: 'decision',
    scenario: 'You have two team members who could be promoted. You have budget for one promotion this cycle. Team member A has been waiting 2 years and is close to leaving — promotion would almost certainly retain them. Team member B has been waiting 18 months but is less likely to leave. By objective performance metrics, they are almost equal — B scores marginally higher on output quality, A scores higher on leadership behaviours. Who do you promote?',
    options: [
      { text: 'Promote A — retention risk is a legitimate factor in promotion decisions and losing A would cost more than the promotion.', score: 2 },
      { text: 'Promote B — promotions must be based on performance merit. Using retention risk as a deciding factor creates perverse incentives.', score: 2 },
      { text: 'Promote A — leadership behaviours are more predictive of senior-level success than output quality at the point of promotion.', score: 3 },
      { text: 'Delay both and make a stronger case for two promotions next cycle — a forced choice between two near-equal candidates is a false constraint.', score: 1 },
    ]
  },
  {
    id: 'DE10', dimension: 'decision',
    scenario: 'Your team has been using an internal tool that you built 2 years ago. A vendor now offers a SaaS solution that does 80% of what your tool does, costs $45,000 per year, and would save your team approximately 6 hours per week in aggregate. Rebuilding your internal tool to match the SaaS capability would take 3 months of engineering time. Switching to the SaaS tool means sunsetting work your team built and is proud of. What do you recommend?',
    options: [
      { text: 'Switch to the SaaS tool — 6 hours per week at team blended rate quickly exceeds $45,000 annually and build-vs-buy calculations rarely favour rebuilding.', score: 3 },
      { text: 'Rebuild the internal tool — the 20% capability gap may be critical and SaaS vendor dependency creates long-term risk.', score: 1 },
      { text: 'Run a 90-day SaaS pilot alongside your internal tool before committing — validate the 80% coverage assumption before sunsetting anything.', score: 2 },
      { text: 'Involve the team in the decision — they built the internal tool and their buy-in to a switch will determine adoption success.', score: 2 },
    ]
  },

  // ── COMMUNICATION (10 questions) ─────────────────────────────────────

  {
    id: 'CO1', dimension: 'communication',
    scenario: 'You have prepared a 20-slide strategy deck for a board presentation. At 8am the day of the presentation, your CEO tells you the board wants "10 minutes, not 40, and just the headline and the ask." You have been preparing the full deck for 3 weeks. It is now 9am and the presentation is at 2pm. What do you do?',
    options: [
      { text: 'Build the 10-minute version from scratch — repurposing 20 slides into a tight 10-minute narrative is almost always worse than starting clean.', score: 3 },
      { text: 'Cut the deck to the 5 most important slides — reduce rather than rebuild to protect the structure you have already stress-tested.', score: 2 },
      { text: 'Present the full deck but fast — you cannot adequately compress 3 weeks of thinking into 5 hours and the board can interrupt if needed.', score: 0 },
      { text: 'Ask the CEO for 15 minutes — 10 minutes for a strategy presentation is unrealistic and a brief negotiation is better than a bad presentation.', score: 2 },
    ]
  },
  {
    id: 'CO2', dimension: 'communication',
    scenario: 'You are delivering difficult feedback to a team member who has received critical performance feedback before and responded defensively. This time the feedback is more serious — if performance does not improve, their role is at risk. You have 45 minutes scheduled. How do you open the conversation?',
    options: [
      { text: 'Start with the seriousness of the situation immediately — "I want to be straight with you. This conversation is more serious than our previous ones."', score: 3 },
      { text: 'Start with appreciation for their positive contributions before introducing the concern — reduce defensiveness before delivering difficult news.', score: 1 },
      { text: 'Ask them how they feel their performance has been — if they can self-identify the issues, the conversation lands better.', score: 2 },
      { text: 'Have HR present from the start — if role risk is involved, this is a formal conversation and should be treated as one.', score: 2 },
    ]
  },
  {
    id: 'CO3', dimension: 'communication',
    scenario: 'You send an email to your team announcing a new process. Three team members reply with concerns. One replies with a strongly worded objection. One privately messages you saying the new process "will not work." The remaining four say nothing. How do you interpret the silence of the four and what do you do next?',
    options: [
      { text: 'Assume silence is broad agreement — only 3 objected out of 7 and one objection was strong enough to represent multiple views if shared.', score: 0 },
      { text: 'Treat silence as ambiguous and follow up individually with the four who did not respond — silent non-objection is not the same as endorsement.', score: 3 },
      { text: 'Hold a team discussion to surface any remaining concerns before implementing — email is the wrong channel for process change of this significance.', score: 2 },
      { text: 'Address the three who responded and implement — managing the vocal minority is the priority, not chasing the silent majority.', score: 1 },
    ]
  },
  {
    id: 'CO4', dimension: 'communication',
    scenario: 'Your manager gives you feedback in a group leadership meeting that you "need to be more concise in your updates." You believe your updates are appropriately detailed given the complexity of your work. Two peers privately agree with you after the meeting. One peer says your manager "has a point." What is the right response?',
    options: [
      { text: 'Accept the feedback publicly and adjust — manager perception is reality in a leadership context regardless of whether you agree.', score: 1 },
      { text: 'Request a private conversation with your manager to understand specifically what "more concise" looks like in their view.', score: 3 },
      { text: 'Seek broader feedback before acting — two peers agreeing with you and one agreeing with your manager is ambiguous data.', score: 2 },
      { text: 'Adjust your updates for the next month and see if the feedback changes — demonstrate responsiveness without needing to agree or disagree.', score: 2 },
    ]
  },
  {
    id: 'CO5', dimension: 'communication',
    scenario: 'You are presenting project results to a senior stakeholder. Midway through your presentation, they interrupt you and say "just tell me: are we on track or not?" You are 8 slides from the context needed to give an honest answer. The full picture is nuanced — you are on track on budget, ahead on one workstream, and 2 weeks behind on another. What do you say?',
    options: [
      { text: '"Mostly yes — we are on budget and ahead in one area. I want to flag we are 2 weeks behind in one workstream before you hear it elsewhere."', score: 3 },
      { text: '"Yes" — the overall project is on track and the 2-week delay in one workstream does not change that headline.', score: 1 },
      { text: '"It depends on what dimension matters most to you — can I give you the 60-second version?" Then deliver the nuanced picture quickly.', score: 2 },
      { text: '"Let me finish the context and then I can answer that properly — the nuance matters here."', score: 1 },
    ]
  },
  {
    id: 'CO6', dimension: 'communication',
    scenario: 'A team member gives an important client presentation and makes 3 factual errors — none caught in the room, but you noticed. The client seemed satisfied. After the meeting the team member asks how they did. What do you say?',
    options: [
      { text: 'Give positive feedback in the moment and address the errors in a private follow-up conversation later — protect their confidence in front of the client experience.', score: 2 },
      { text: 'Address the errors immediately and specifically — "Great energy. Three things I want to make sure we correct before this goes any further."', score: 3 },
      { text: 'Tell them it went well — the client was happy and the errors were not caught, so raising them now serves no purpose.', score: 0 },
      { text: 'Ask them how they felt it went first — their self-assessment may surface the errors without you needing to introduce them.', score: 2 },
    ]
  },
  {
    id: 'CO7', dimension: 'communication',
    scenario: 'You discover through an informal conversation that a peer manager has been telling their team that your team "dropped the ball" on a shared project — blaming your team for a delay that was actually caused by a shared dependency failure. The narrative has reached senior leadership. What do you do?',
    options: [
      { text: 'Address it directly with your peer first — give them the opportunity to correct the narrative before escalating.', score: 3 },
      { text: 'Correct the narrative with senior leadership proactively — the record needs to be set straight before the version becomes established truth.', score: 2 },
      { text: 'Document the facts and wait — acting on informal information risks overreacting to a mischaracterisation.', score: 1 },
      { text: 'Bring both teams together to do a shared retrospective — establish the facts collectively rather than through competing narratives.', score: 2 },
    ]
  },
  {
    id: 'CO8', dimension: 'communication',
    scenario: 'You are in a leadership team of 6. In meetings, two members dominate. Two are consistently quiet. One contributes selectively. You notice the two quiet members have strong views in 1:1s that never make it into group discussions. The team\'s decisions are being driven by the vocal minority. As a peer — not the team leader — what do you do?',
    options: [
      { text: 'Raise it with the team leader privately — they are responsible for group dynamics and need to know this is happening.', score: 2 },
      { text: 'In the next meeting, actively create space: "I would like to hear from [name] on this before we decide."', score: 3 },
      { text: 'Do nothing — it is not your role to manage peer dynamics and intervening may create more tension than it resolves.', score: 0 },
      { text: 'Suggest the team leader introduces a structured input process — round-robins or pre-reads that give quieter members a vehicle for contribution.', score: 2 },
    ]
  },
  {
    id: 'CO9', dimension: 'communication',
    scenario: 'Your organisation sends a company-wide communication that contains information that directly contradicts what you told your team 2 weeks ago. Your team notices immediately and three members message you asking what is going on. You were not informed of the change before the communication went out. What do you say to your team in the next hour?',
    options: [
      { text: 'Acknowledge the contradiction honestly: "I was working from information that has since changed. I should have had advance notice of this update and I did not. Here is what I know now."', score: 3 },
      { text: 'Tell them you are looking into it and will get back to them within the day — do not communicate until you have a full picture.', score: 2 },
      { text: 'Explain that the organisation updated its position and align yourself fully with the new communication — your earlier message is now superseded.', score: 1 },
      { text: 'Escalate to your manager immediately and tell your team you are seeking clarification — do not say anything substantive until you know what happened.', score: 2 },
    ]
  },
  {
    id: 'CO10', dimension: 'communication',
    scenario: 'You have just delivered a town hall to your 40-person department. Afterwards, your most respected senior team member privately tells you that the town hall felt "rehearsed and distant" and that people left with more anxiety than they arrived with. You thought it went well. Your manager also thought it went well. What do you do with this feedback?',
    options: [
      { text: 'Seek broader anonymous feedback from the team before deciding how to weight this input — one perspective, even a respected one, may not be representative.', score: 2 },
      { text: 'Take it seriously — a trusted senior team member with direct access to how people are feeling is more reliable signal than your own assessment or your manager\'s.', score: 3 },
      { text: 'Thank them for the feedback and reflect on it privately before deciding on any changes — avoid overreacting to a single data point.', score: 2 },
      { text: 'Discuss it with your manager — they observed the same event and have more context on whether the concern is isolated or indicative.', score: 1 },
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
      high: 'You navigate conflict with sophistication and precision — you diagnose before intervening, distinguish symptoms from causes, and resist the pressure to resolve too quickly. Your instinct to understand the system behind a conflict rather than just the presenting issue is what separates effective conflict leadership from reactive management. You create the conditions in which people can disagree productively.',
      mid:  'You handle conflict competently in most situations but may move to resolution before fully diagnosing the root cause, or apply consistent approaches where differentiation would serve better. Your next development edge is learning when to hold the tension in a conflict longer — not every conflict needs to be resolved immediately, and some need to be escalated before they can be resolved.',
      low:  'Conflict situations present a meaningful development opportunity. There is a tendency to either avoid the discomfort of direct engagement or to escalate before attempting resolution at your level. Building the skills to stay in difficult conversations — to name what is happening, understand multiple perspectives, and facilitate resolution — will significantly strengthen your leadership effectiveness.'
    },
    delegation: {
      high: 'You delegate with strategic intent — you match responsibility to readiness, invest in building the capability needed before it is required, and resist the pull to retain work that others should own. Critically, you have learned that how you respond to imperfect execution determines whether delegation works long-term. Your team grows under your leadership because you genuinely extend trust.',
      mid:  'You delegate regularly but the quality of your delegation varies. Under pressure or with high-stakes work, there is a tendency to retain control or to intervene before team members have had the chance to find their own way. The shift from good to great delegation is often about changing your internal relationship with risk — learning to tolerate imperfect execution as the cost of building a genuinely capable team.',
      low:  'Delegation is a critical development area. There is a pattern of over-involvement in execution that limits both your strategic capacity and your team\'s growth. The underlying driver is often a well-intentioned desire for quality — but the impact is a team that waits for direction rather than developing judgment. Building structured delegation habits and tolerance for different approaches will be high-impact development work.'
    },
    motivation: {
      high: 'You motivate with genuine attunement — you understand what drives each individual and you adapt accordingly rather than applying a single engagement model. You notice early signals of disengagement and intervene constructively. You are honest even when honesty is uncomfortable, and your team trusts you because of it. This psychological safety is what sustains motivation through difficult periods.',
      mid:  'You create positive conditions for motivation in most circumstances but may apply consistent approaches where differentiation is needed, or avoid difficult motivational conversations that require honest and sometimes unwelcome input. Deepening your understanding of each team member\'s individual drivers — and being willing to have the harder conversations when engagement drops — will meaningfully increase your impact.',
      low:  'Team motivation is a significant development priority. There may be a tendency to prioritise delivery metrics over the human conditions that sustain performance, or to avoid conversations that require honest feedback about career realities or performance concerns. Learning to see motivation as a strategic leadership responsibility — not just a soft skill — will unlock engagement you are currently not fully accessing.'
    },
    decision: {
      high: 'You make decisions with a rare combination of analytical rigour and practical judgement. You know when to gather more data and when acting on imperfect information is the right call. You own your decisions — including when they are wrong — and you course-correct without defensiveness. This decisiveness combined with intellectual honesty builds the credibility that makes people want to follow your lead.',
      mid:  'You make sound decisions in familiar territory but show variability under novel conditions, high ambiguity, or when decisions have political dimensions. There is sometimes a tendency to over-process, seek too much consensus, or defer when your own judgement is sufficient. Calibrating your confidence in your own analytical capability — and being willing to make the call and own it — is where your next level of decision-making effectiveness lies.',
      low:  'Decision making under ambiguity and pressure is a meaningful development area. There may be a preference for certainty before acting, or a tendency to defer decisions to avoid the discomfort of being wrong. Building a structured approach to decision making under uncertainty — including knowing when you have enough information to act — and then practising owning the outcome will be foundational to your leadership growth.'
    },
    communication: {
      high: 'You communicate with precision and adaptability — you read your audience, calibrate your message, and choose your channel with intent. You deliver difficult messages without softening them into meaninglessness, and you create the conditions in which honest dialogue happens. Your ability to be direct without being blunt, and empathetic without being evasive, is a genuine leadership differentiator.',
      mid:  'You communicate effectively in straightforward contexts but show less consistency when communication is difficult — delivering uncomfortable feedback, maintaining a clear position under pressure, or adapting to very different communication styles. Your next development edge is building range in the harder communication moments — the ones where the temptation is to soften, defer, or avoid.',
      low:  'Communication effectiveness is a meaningful development priority. There may be a pattern of avoiding direct messages, framing feedback in ways that reduce its impact, or communicating in ways that leave important things unsaid. Developing a more deliberate and adaptive communication style — particularly in high-stakes or uncomfortable contexts — will be one of the highest-impact development investments you can make.'
    }
  }
  const n = narratives[dimId]
  if (!n) return ''
  return pct >= 68 ? n.high : pct >= 45 ? n.mid : n.low
}

export function getOverallNarrative(fitLabel, leadershipStyle, pct) {
  if (fitLabel === 'Strong Fit') {
    return 'This assessment indicates strong leadership capability across evaluated dimensions. A ' + leadershipStyle.toLowerCase() + ' leadership orientation comes through clearly — combined with the analytical rigour, contextual judgement, and interpersonal sophistication that characterises effective senior leadership. The response patterns suggest a leader who performs under complexity, owns outcomes, and invests genuinely in the people they lead.'
  } else if (fitLabel === 'Moderate Fit') {
    return 'This assessment indicates solid leadership foundations with clear strengths and identifiable development priorities. A ' + leadershipStyle.toLowerCase() + ' orientation is a genuine asset, and the response patterns show good instincts across most leadership situations. The development priorities identified are specific and actionable — with the right investment and intentional practice, the path to consistently high-impact leadership is well within reach.'
  } else {
    return 'This assessment indicates that leadership capability is at an earlier stage of development. There are genuine strengths visible in several dimensions, and the instincts shown provide a real foundation to build on. The development priorities identified respond well to coaching, structured experience, and deliberate reflection. With the right investment and support, meaningful and measurable growth in leadership effectiveness is achievable.'
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
