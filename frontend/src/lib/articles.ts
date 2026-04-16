export interface Article {
  id: number
  slug: string
  category: string
  date: string
  headline: string
  image: string
  body: string[]
}

export const articles: Article[] = [
  {
    id: 1,
    slug: 'human-readiness-framework',
    category: 'RESEARCH',
    date: 'April 2, 2026',
    headline: 'The Human Readiness Framework: a scoring rubric for real-world robot deployment',
    image: 'https://images.unsplash.com/photo-0E_vhMVqL9g?w=1200&q=80',
    body: [
      'Most robot deployments fail not because the robot breaks — but because the humans around it weren\'t ready. The machine works. The context doesn\'t. This is the gap the Human Readiness Framework is designed to close.',
      'Developed through fieldwork across logistics, healthcare, and hospitality environments, the HRF is a scoring rubric that evaluates an organisation\'s readiness to deploy robotic systems along five dimensions: spatial legibility, staff orientation, process alignment, failure tolerance, and feedback loops.',
      'Each dimension is scored from 1 to 5, producing a composite readiness score that teams can use before, during, and after deployment. A score below 12 indicates high risk of adoption failure — not technical failure. The robot will function. The people around it won\'t know what to do.',
      'The framework is deliberately non-technical. It was designed to be administered by product managers, experience designers, and operations leads — not robotics engineers. The questions it asks are about people, not machines: Do staff know what to do when the robot stops? Do customers understand what the robot is for? Is there a clear path for reporting a bad interaction?',
      'Early pilots using the HRF showed a 34% reduction in escalation events during the first 90 days of deployment. Teams that scored high on "feedback loops" — meaning they had structured ways to collect and act on frontline observations — outperformed low-scoring peers on nearly every adoption metric.',
      'The HRF is available as part of the REP curriculum and will be published in full as an open research tool later this year.',
    ],
  },
  {
    id: 2,
    slug: 'rlp-module-1-1-live',
    category: 'CERTIFICATION',
    date: 'March 28, 2026',
    headline: 'RLP Module 1.1 is live: foundations of robotic literacy for practitioners',
    image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=1200&q=80',
    body: [
      'Module 1.1 — Foundations of Robotic Literacy — is now live and available to all registered learners. It is the first module of the Robotics Experience Practitioner (REP) certification, and it is free to complete.',
      'The module covers three core areas: what robots actually are (not the sci-fi version), how they perceive and act in physical environments, and why the human decisions made around them matter more than the machines themselves.',
      'It takes approximately two hours to complete and requires no prior technical knowledge. By the end, learners will be able to describe the basic architecture of a robotic system in plain language, identify the key moments where human-robot interaction is most likely to break down, and explain why robotic literacy matters for non-engineering roles.',
      'The module is structured around three lessons: Machines & Misconceptions, Perception & Action, and The Human Layer. Each lesson includes reading, a short video, and a reflection prompt. Learners who complete all three receive a digital certificate of completion.',
      'Module 1.2 — Human-Robot Interaction — is in development and expected to open for enrolment later this quarter. Registered learners will be notified when it launches.',
    ],
  },
  {
    id: 3,
    slug: 'summit-nyc-call-for-speakers',
    category: 'SUMMIT',
    date: 'March 20, 2026',
    headline: 'The Robot Age Summit comes to NYC this fall — call for speakers now open',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
    body: [
      'The Robot Age Summit is coming to New York City this fall. It is a one-day gathering for designers, strategists, researchers, and leaders who are shaping what human-robot experience actually looks like — and the call for speakers is now open.',
      'We are looking for practitioners, not theorists. People who have deployed robots in real environments, designed around their limitations, researched how humans actually behave near them, or made consequential decisions about where and how they get used.',
      'Talks are 20 minutes. We are not interested in demos, product announcements, or predictions about what robots will do in 2040. We want honest accounts of what is happening now — what worked, what didn\'t, and what you wish you had known.',
      'Topics we are actively seeking include: failure and recovery design in robotic environments, research methods for studying human-robot behaviour, organisational change management around robot adoption, and experience design for shared human-robot spaces.',
      'The summit will be capped at 200 attendees. It is designed to be a room where real conversations happen — not a conference hall full of keynotes.',
      'Applications to speak close on May 15. Submit a 200-word abstract and a short bio via the form on the Summit page. Speakers receive complimentary registration and travel support for those coming from outside the tri-state area.',
    ],
  },
  {
    id: 4,
    slug: 'automation-anxiety-vs-readiness',
    category: 'RESEARCH',
    date: 'March 14, 2026',
    headline: 'Automation anxiety vs. automation readiness: what the data actually shows',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80',
    body: [
      'Two narratives dominate the public conversation about robots and work. The first is anxiety: robots are coming for jobs, and there is nothing to be done. The second is denial: robots will create more jobs than they displace, so stop worrying. Both are wrong in the same way — they treat the outcome as inevitable rather than designed.',
      'A survey of 1,400 workers across manufacturing, logistics, and healthcare found that anxiety about automation correlates more strongly with a lack of information than with actual job risk. Workers who reported high anxiety were not necessarily in roles most exposed to automation. They were in roles where no one had talked to them about what was changing.',
      'Readiness, by contrast, correlated strongly with two factors: whether workers felt they understood what the robots in their environment were doing, and whether they had been involved in any part of the deployment process. Understanding and participation — not job security — were the primary predictors of positive adaptation.',
      'This has direct implications for how organisations communicate about robot adoption. The instinct is often to minimise concern by emphasising job creation statistics. The data suggests a different approach works better: explain the robot, involve the people, and create structured ways for frontline workers to surface problems.',
      'Automation anxiety is largely a design failure. It is what happens when deployment is done to people rather than with them. The good news is that it is fixable — and the fix does not require technical expertise. It requires communication, participation, and honest acknowledgement of what is changing and why.',
    ],
  },
  {
    id: 5,
    slug: 'first-rep-workplace',
    category: 'NEWS',
    date: 'March 7, 2026',
    headline: 'Inside the first workplace to earn a Robot Age Practitioner designation',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80',
    body: [
      'A mid-sized logistics facility in Columbus, Ohio has become the first workplace to earn a collective Robot Age Practitioner designation — meaning that a critical threshold of its operational staff have completed the REP certification and demonstrated applied readiness through the Robot Readiness Audit.',
      'The facility operates a mixed human-robot environment across two warehouse floors. Collaborative mobile robots handle inventory movement; humans manage exceptions, quality checks, and anything requiring contextual judgment. It is exactly the kind of environment the REP was designed for.',
      'The designation process took six months. It began with a cohort of eight staff members — including two shift supervisors, a facilities manager, and five floor operatives — enrolling in the REP certification. All eight completed it. Six passed the audit on their first attempt.',
      'What changed as a result? According to the facility director, the clearest shift was in how problems get reported and escalated. Before the programme, incidents involving the robots were often underreported because staff weren\'t sure whether what they\'d observed was significant. After completing the certification, they had a shared vocabulary and a clearer sense of what constituted a reportable event.',
      'The facility is now piloting a peer-mentorship model in which certified practitioners onboard new staff into the mixed environment. It is an early example of what institutional robotic literacy looks like in practice — and it did not require a single engineer.',
    ],
  },
  {
    id: 6,
    slug: 'soft-skills-hard-skills-robotic-workflows',
    category: 'RESEARCH',
    date: 'February 28, 2026',
    headline: 'Soft skills are the hard skills now: reframing human value in robotic workflows',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80',
    body: [
      'The phrase "soft skills" has always carried a faint air of apology — as though the things that make us effective with other humans are somehow less rigorous than technical competencies. In robotic workflows, that hierarchy inverts completely.',
      'Robots are, by current standards, extraordinarily good at repeatable physical tasks and extraordinarily bad at ambiguity, exception handling, and social context. The human value in a mixed human-robot environment is almost entirely concentrated in exactly the capacities that "soft skills" describes: judgment, communication, adaptability, and the ability to recognise when a situation has moved outside the parameters the system was designed for.',
      'Research across ten deployment sites found that the workers who added the most value in human-robot environments were consistently those with strong situational awareness, clear communication habits, and comfort with ambiguity — not those with the most technical knowledge about the robots themselves.',
      'This has significant implications for hiring, training, and organisational design. If the human contribution in a robotic workflow is primarily about judgment and exception handling, then the skills worth developing and rewarding are not technical ones. They are the ones that organisations have historically treated as secondary.',
      'It also reframes what robotic literacy means for non-engineers. The goal is not to understand how the robot works at a technical level. It is to understand what the robot is doing well enough to know when it is going wrong — and to have the communication skills and organisational standing to do something about it.',
      'The hardest skill in a robotic workplace is knowing when to override the machine. That is not a technical skill. It is a human one.',
    ],
  },
]

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug)
}

export function getAllSlugs(): string[] {
  return articles.map((a) => a.slug)
}
