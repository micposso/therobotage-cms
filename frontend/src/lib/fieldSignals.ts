export interface FieldSignal {
  id: number
  slug: string
  essayNumber: string
  date: string
  headline: string
  refDimension: string
  body: string[]
}

export const fieldSignals: FieldSignal[] = [
  {
    id: 1,
    slug: 'failure-transparency-costs',
    essayNumber: '01',
    date: 'April 10, 2026',
    headline: 'Failure transparency is not a UX nice-to-have. It is a deployment cost.',
    refDimension: 'Failure Transparency',
    body: [
      'When a robot cannot communicate why it has stopped, the burden of interpretation falls on the nearest human. That human is almost never trained for it. Here is what happens next.',
      'On a hospital floor, an unannounced stop triggers an escalation chain: a staff member flags a supervisor, who calls facilities, who contacts the vendor. The sequence averages 14 minutes. During that window the robot blocks a corridor, holds a payload, or sits idle in a shared space. The operational cost is not in the machine — it is in the people trying to interpret it.',
      'Across five logistics and healthcare deployments observed over 18 months, unplanned stops with no visible status output accounted for 62 percent of all escalation events. Each event averaged two people pulled off primary tasks. At 20 events per month, that is 40 staff-hours spent decoding silence.',
      'Failure Transparency requires the robot to communicate three things: what it has stopped doing, why it stopped, and what the nearest human should do next. Most deployed systems communicate none of these. A blinking amber light is not Failure Transparency. It is ambiguity with a color.',
      'Deployers who score low on Failure Transparency in the HREF audit typically have one thing in common: they treated failure communication as a firmware edge case rather than a deployment requirement. The fix is not always a software update. It is a decision made before the robot ships — about what the system owes to the people around it when it stops.',
    ],
  },
  {
    id: 2,
    slug: 'spatial-legibility-hospitals',
    essayNumber: '02',
    date: 'March 27, 2026',
    headline: 'Spatial legibility in hospital corridors: what robots announce and what they conceal.',
    refDimension: 'Spatial Legibility',
    body: [
      'A robot that occupies space communicates something about that space — whether its designers intended it to or not. Three observations from healthcare deployments where the signal was wrong.',
      'First observation: a mid-sized autonomous delivery robot operating in a 1.2-meter corridor communicates, by its presence alone, that the corridor is now a shared lane. Staff interpreted this as the hospital\'s approval of a new routing norm. It was not. The robot\'s physical footprint had re-signaled the space without any organizational decision to do so. Spatial Legibility includes what the robot implies, not only what it displays.',
      'Second observation: a robot with a flat top surface and no visual barrier was routinely used by staff as an impromptu shelf for lightweight items — cups, folders, gloves. The robot\'s form factor communicated "available surface" with more force than any procedural memo communicated "do not place items on the robot." Design encodes behavioral permission. If the shape invites the wrong behavior, the shape must change.',
      'Third observation: a robot with a consistent patrol route began to function as a spatial anchor — staff timed handoffs and brief meetings by its passing. When the route was changed without notice, the disruption was reported as "the schedule is broken." The robot had become infrastructure. Infrastructure changes require communication. The team had treated it as a device update.',
      'The implication across all three observations is the same: Spatial Legibility is not a feature of the robot in isolation. It is a property of the robot in its specific environment, read by the specific people who share that environment every day. Auditing Spatial Legibility means studying how people interpret the robot, not how the robot was designed to be interpreted.',
    ],
  },
  {
    id: 3,
    slug: 'recovery-design-gap',
    essayNumber: '03',
    date: 'March 13, 2026',
    headline: 'The recovery design gap: what happens after the interaction breaks down.',
    refDimension: 'Recovery Design',
    body: [
      'Most HRI design stops at the moment of success. Recovery Design asks what the robot does — and what it communicates — when the intended interaction fails. Most deployed robots have no answer.',
      'Consider a service robot tasked with delivering medication to a patient room. The door is ajar. The robot cannot determine whether entry is permitted. In the absence of Recovery Design, it waits — no communication, no timeout, no escalation signal. A nurse finds it in the corridor eleven minutes later. The medication is late. No record of the delay exists in the system. The robot fulfilled its technical specification. The interaction failed.',
      'Good Recovery Design defines three things for every failure mode: a signal that communicates failure state to the nearest human in plain terms, a timeout threshold after which the robot escalates or routes around, and a log entry that creates an auditable record of what happened and when. None of these require novel hardware. All three require deliberate design decisions made before deployment.',
      'The cost of absent Recovery Design compounds. A single unresolved interaction is an inconvenience. Thirty unresolved interactions per week, none logged, none escalated consistently, produce a pattern that becomes invisible — absorbed into the ambient frustration of staff without ever surfacing as a solvable problem. The robot is blamed. The deployment is judged as poor. The Recovery Design gap is never named.',
      'For deployers, the practical implication is a pre-launch question that almost no one asks: for each of the ten most likely failure modes in this environment, what does the robot communicate, to whom, and what happens next? If the answer is "we are not sure," Recovery Design is not finished. The robot is not ready.',
    ],
  },
  {
    id: 4,
    slug: 'interaction-fit-mismatch',
    essayNumber: '04',
    date: 'February 28, 2026',
    headline: "Interaction Fit: when the robot's behavioral model does not match the environment.",
    refDimension: 'Interaction Fit',
    body: [
      'A robot designed for warehouse aisles behaves differently in a clinical hallway. Interaction Fit measures the gap between where a robot was designed to operate and where it actually does.',
      'Interaction Fit is not about whether the robot can physically navigate a new environment — most can. It measures whether the robot\'s behavioral assumptions match the social norms, spatial rhythms, and human expectations of the deployment site. Stopping distance, approach angle, speed modulation, and proximity tolerance are all calibrated for a context. When that context changes, the calibration does not automatically follow.',
      'A robot calibrated for 2.4-meter warehouse aisles, redeployed in a clinical corridor at the same approach speed, reads as aggressive to staff and alarming to patients. The robot is not broken. Its behavioral model was authored for a different environment. The mismatch is Interaction Fit failure — not a technical fault, and not something a firmware update resolves without deliberate re-calibration against the new context.',
      'The distinction between low Interaction Fit and a broken robot matters for how deployers respond. A broken robot gets repaired or replaced. A low-Interaction-Fit robot gets tolerated — complained about, worked around, and eventually sidelined — because the people experiencing it cannot name what is wrong. "It makes people uncomfortable" is not a service ticket. It is an Interaction Fit audit finding.',
      'Deployers moving a robot between environments — even similar ones — should treat the transition as a new deployment, not a relocation. That means re-running the HREF Interaction Fit assessment for the receiving context, re-calibrating behavioral parameters, and running a structured observation period before declaring operational readiness. The machine moved. Its behavioral model did not move with it automatically.',
    ],
  },
]

export function getFieldSignalBySlug(slug: string): FieldSignal | undefined {
  return fieldSignals.find((f) => f.slug === slug)
}

export function getAllFieldSignalSlugs(): string[] {
  return fieldSignals.map((f) => f.slug)
}
