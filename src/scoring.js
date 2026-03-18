export function buildProfile(totalScore, logicScore, numScore, timeTaken) {
  const pct = totalScore / 20
  const timeMins = timeTaken / 60
  const speedPct = Math.max(0, Math.min(100, 100 - (timeMins / 20) * 60))

  let percentile
  if      (pct >= 0.9) percentile = Math.round(92 + Math.random() * 7)
  else if (pct >= 0.8) percentile = Math.round(78 + Math.random() * 13)
  else if (pct >= 0.7) percentile = Math.round(58 + Math.random() * 19)
  else if (pct >= 0.6) percentile = Math.round(38 + Math.random() * 19)
  else if (pct >= 0.5) percentile = Math.round(22 + Math.random() * 15)
  else                 percentile = Math.round(8  + Math.random() * 13)

  const traits = {
    logicalReasoning:   Math.min(100, Math.round((logicScore / 10) * 100)),
    numericalReasoning: Math.min(100, Math.round((numScore   / 10) * 100)),
    processingSpeed:    Math.round(speedPct),
    problemSolving:     Math.min(100, Math.round(((logicScore + numScore) / 20) * 90 + 10)),
    analyticalThinking: Math.min(100, Math.round(((logicScore * 1.2 + numScore * 0.8) / 20) * 85 + 10)),
  }

  let fit
  if      (pct >= 0.85) fit = { label: 'Strong Fit',  color: 'var(--ok)',     bg: 'var(--ok-dim)',    desc: 'Exceptional cognitive ability — well above the benchmark for this role. Highly recommended.' }
  else if (pct >= 0.70) fit = { label: 'Good Fit',     color: 'var(--accent)', bg: 'var(--accent-dim)',desc: 'Strong reasoning skills that meet the cognitive benchmark. A solid candidate to advance.' }
  else if (pct >= 0.55) fit = { label: 'Moderate Fit', color: 'var(--warn)',   bg: 'var(--warn-dim)',  desc: 'Meets some benchmarks. Consider a structured interview to probe weaker dimensions.' }
  else                  fit = { label: 'Low Fit',       color: 'var(--bad)',    bg: 'var(--bad-dim)',   desc: 'Below the recommended threshold for this role. Further evaluation is advised.' }

  let speedLabel
  if      (speedPct > 70) speedLabel = 'Fast'
  else if (speedPct > 40) speedLabel = 'Average'
  else                    speedLabel = 'Careful'

  let insight
  if      (totalScore >= 17) insight = 'demonstrates exceptional cognitive capacity — top-tier logical and numerical reasoning that signals strong potential for complex analytical roles.'
  else if (totalScore >= 14) insight = 'shows well-above-average reasoning ability. Logical and numerical skills are solid foundations for this role.'
  else if (totalScore >= 10) insight = 'meets baseline cognitive benchmarks. Some areas show strength; a structured interview is recommended to probe weaker dimensions.'
  else                       insight = 'scored below the recommended threshold for this role. Further evaluation is advised before proceeding.'

  let speedDesc
  if      (speedLabel === 'Fast')    speedDesc = 'Completed well ahead of schedule — strong processing speed and confidence under time pressure.'
  else if (speedLabel === 'Average') speedDesc = 'Completed at a typical pace — balanced between speed and accuracy.'
  else                               speedDesc = 'Took a careful, methodical approach — thoroughness prioritised over speed.'

  return { percentile, traits, fit, speedLabel, speedDesc, insight }
}

export const TRAIT_NAMES = {
  logicalReasoning:   'Logical Reasoning',
  numericalReasoning: 'Numerical Reasoning',
  processingSpeed:    'Processing Speed',
  problemSolving:     'Problem Solving',
  analyticalThinking: 'Analytical Thinking',
}

export const TRAIT_COLORS = {
  logicalReasoning:   '#4f6ef7',
  numericalReasoning: '#7c5cfc',
  processingSpeed:    '#00b37e',
  problemSolving:     '#f59e0b',
  analyticalThinking: '#ef4444',
}
