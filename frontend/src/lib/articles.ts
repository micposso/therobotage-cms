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
    id: 8,
    slug: 'hugging-face-robot-app-store',
    category: 'NEWS',
    date: 'May 7, 2026',
    headline: 'Open-source robotics gets an app store — and the price is the argument.',
    image: '/images/news/reachy-mini-app-store.png',
    body: [
      'Hugging Face launched an app store for its Reachy Mini robot this week — 200 apps already available, device prices starting at $299, and a CEO who built one of those apps (an office receptionist) in under two hours. The numbers are modest. The implication isn\'t. This is the first genuinely open, genuinely accessible entry point into hands-on human-robot interaction for people who aren\'t roboticists.',
      'Open hardware plus open software plus an open application layer creates conditions that closed platforms cannot replicate. Closed platforms produce products. Open ones distribute the materials — and when the materials are open, practitioners, researchers, and nontechnical builders can all work from the same starting point and share what they find. Hugging Face\'s CEO said it plainly: the goal is to make sure that building for AI isn\'t limited to a few people in Silicon Valley. The app store is how that argument becomes a structure.',
      'Real hands-on HRI has required, until now, a research lab, a warehouse deployment, or an enterprise contract. A $299 robot that fits on a kitchen counter changes who gets to build genuine intuition about how robots behave near people — how they respond to proximity, ambient sound, unexpected interaction. That intuition cannot be built from a spec document or a product demo. It requires contact with the machine.',
      'The four launch apps — baby monitor, distraction tracker, cooking assistant, office receptionist — are not technically impressive. That is the point. Each one is intimate, contextual, and defined entirely by the human situation it lives inside. The people best equipped to design these interactions well are UX researchers, product managers, and operations leads who understand the situations — not robotics engineers who understand the hardware.',
      'Ten thousand Reachy Mini devices are in customers\' hands or in transit, with 3,000 shipped in a single week. That is large enough to generate a kind of distributed practitioner knowledge robotics currently lacks. Every person who builds an app, breaks a workflow, and figures out why is developing robot literacy the only way it reliably works: through direct, repeated contact with the machine in a real context.',
      'The democratization conversation in robotics has mostly been about cost — who can afford a robot, not who gets to learn from one. The Reachy Mini app store suggests the harder problem is making robots useful to people who didn\'t build them, and open platforms are how that happens. The first HRI most designers, researchers, and product managers will ever shape firsthand may not start on a warehouse floor. It may start on a kitchen counter.',
    ],
  },
  {
    id: 7,
    slug: 'the-familiar-hri-design-brief',
    category: 'OPINION',
    date: 'May 5, 2026',
    headline: 'Colin Angle\'s new robot pet is a lesson in expectation management',
    image: '/images/news/therobotage-house-pet-robots.png',
    body: [
      'Colin Angle — who co-founded iRobot and put the Roomba into 40 million homes — unveiled his next robot this week: a four-legged AI companion called the Familiar. It has doe eyes, bear-cub ears, and touch-sensitive fur. It makes animal sounds but doesn\'t speak. It follows you room to room and adapts its behavior over time by learning from what people say around it. And it was deliberately designed to look like nothing you\'ve ever owned. That last decision is the one worth paying attention to.',
      'The Familiar is four-legged, bulldog-sized, with doe eyes and bear-cub ears — not a dog, not a cat, not a human. Angle made that a design constraint, not an aesthetic preference. Every social robot that models itself on a known creature inherits the full weight of human expectation for that creature: a robot dog that doesn\'t fetch, greet, or follow commands the way a dog does will feel broken, even if it works exactly as designed. The Familiar sidesteps that failure mode entirely. There is no prior version for it to disappoint.',
      'Maja Matarić — who has spent 25 years on socially assistive robotics — got down on the floor and hugged the Familiar within minutes of seeing it. Her word for what made it work was "vulnerable." A robot that appears to need something from you is a fundamentally different object than one that performs at you. Sustained engagement in human-robot interaction doesn\'t come from capability display — it comes from perceived relationship. The Familiar was designed for that dynamic, not for demo-floor impressiveness.',
      'Angle\'s target users are retired people who want companionship but are deterred from pet ownership by the fear and obligation of care. That isn\'t a demographic reached for emotional resonance. It\'s a specific, underserved demand: the desire for the relationship without the dependency risk. Operations leads and product managers in healthcare and senior living should read this as a deployment signal — the Familiar\'s design intent maps directly onto assisted living environments and mental health support contexts where human staff carry unsustainable emotional load.',
      'The US Census Bureau projects that by 2050, the population aged 65 and older will reach 83.7 million — nearly double the 43.1 million counted in 2012, and representing roughly one in five Americans. By that point, all surviving baby boomers will be 85 or older. That is a large, identifiable group growing into exactly the conditions Angle is designing for.',
      'Six months ago, Angle says, he couldn\'t have built this. The capability that changed wasn\'t locomotion or materials — it was the AI\'s ability to understand ambient speech and adapt behavior over time. Before generative AI, a robot\'s behavioral range was fixed at manufacture. The Familiar accumulates a relationship. That shift — from static performance to adaptive companionship — is the difference between a toy and a presence.',
      'Marc Raibert, Cynthia Breazeal, and Maja Matarić — the Familiar\'s advisors — share one position: skepticism toward humanoid robots that can\'t yet perform useful physical work. Their alignment isn\'t incidental. Angle built an advisory structure that validates the product\'s core thesis: that the human side of the interaction is where the real design work lives. The Familiar may or may not succeed commercially. But the decisions behind it — form factor chosen to eliminate expectation mismatch, vulnerability as an engagement mechanism, a specific demographic selected for unmet need — read less like product development and more like an applied HRI research program.',
    ],
  },
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
      'Program update — October 2026: this earlier framework article is not a current course-availability announcement. Explore RPDP and RDP on the Academy page for current professional learning pathways.',
    ],
  },
  {
    id: 2,
    slug: 'rlp-module-1-1-live',
    category: 'ARCHIVE',
    date: 'March 28, 2026',
    headline: "Archived program announcement: current learning pathways",
    image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=1200&q=80',
    body: [
      "Program update — October 2026. The module availability and credential offer previously described here are no longer part of the current public catalog.",
      "Start with Robot Literacy for foundational understanding, experience real robots through Live Robot Lab, or explore the Academy’s professional pathways: Product Design for Robots (RPDP) and Robot Deployment Practitioner (RDP).",
      "See the Academy for current curricula, planned dates, and interest lists. An interest-list signup does not reserve a seat. Existing learners can sign in to access their learning records."
],
  },
  {
    id: 3,
    slug: 'summit-nyc-call-for-speakers',
    category: 'SUMMIT',
    date: 'March 20, 2026',
    headline: 'Summit announcement: contact us for current event information',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
    body: [
      "Event update — October 2026. The application deadline and speaker benefits previously announced on this page are no longer being advertised as current offers.",
      "For current Summit plans or a speaking inquiry, contact The Robot Age through the Connect page. An inquiry does not confirm a speaking slot or event registration.",
      "For current learning programs, explore Robot Literacy, Live Robot Lab, RPDP, and RDP."
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
    category: 'ARCHIVE',
    date: 'March 7, 2026',
    headline: "Archived credential announcement: program information under review",
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80',
    body: [
      "Editorial update — October 2026. The credential-completion and workplace-outcome claims previously published at this URL have been withdrawn from public promotion pending verification.",
      "This page is not evidence of outcomes for RPDP or RDP. The current public offerings are Robot Literacy, Live Robot Lab, Product Design for Robots (RPDP), and Robot Deployment Practitioner (RDP).",
      "Visit the Academy for current professional program information. Existing learner records and previously issued credentials are not renamed by this catalog update."
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
      'It also reframes what robot literacy means for non-engineers. The goal is not to understand how the robot works at a technical level. It is to understand what the robot is doing well enough to know when it is going wrong — and to have the communication skills and organisational standing to do something about it.',
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
