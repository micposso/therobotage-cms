export const concepts = [
  { title: 'Understand', description: 'How robots work, what they can do and where their limitations are.', items: ['What makes a system a robot?', 'How does a robot perceive its environment?', 'What capabilities are truly autonomous?'] },
  { title: 'Interact', description: 'How people communicate, collaborate and share environments with robots.', items: ['Communication and social cues', 'Movement and shared spaces', 'Trust'] },
  { title: 'Evaluate', description: 'How to assess robot capabilities, autonomy, safety and suitability for a task.', items: ['Capability and reliability', 'Supervision and environment', 'Risk'] },
  { title: 'Apply', description: 'How robots can be responsibly introduced into real-world environments.', items: ['Workflows and deployment', 'People and infrastructure', 'Outcomes'] },
]

export const framework = [
  { title: 'Foundations', description: 'What robots are, major robot categories and how robotics differs from traditional software and AI.', items: ['Physical systems · Sensing · Computation', 'Actuation · Autonomy · Robot categories'] },
  { title: 'Perception & Sensors', description: 'How robots perceive environments using cameras, LiDAR, microphones, force sensors and other sensing systems.', items: ['Sensor capabilities · Sensor fusion · Environmental conditions'] },
  { title: 'Intelligence & Autonomy', description: 'How robots interpret information, make decisions, follow instructions and operate at different levels of autonomy.', items: ['Decision-making · Human control · Supervision'] },
  { title: 'Human-Robot Interaction', description: 'How people communicate, collaborate, build trust and share physical environments with robots.', items: ['Behavior · Feedback · Shared spaces'] },
  { title: 'Safety, Ethics & Governance', description: 'Physical safety, privacy, accessibility, accountability and emerging questions around robotics regulation.', items: ['Risk · Inclusion · Responsibility'] },
  { title: 'Deployment & Application', description: 'How robots move from demonstrations into real workplaces, schools, businesses and public environments.', items: ['Workflows · Infrastructure · Outcomes'] },
]

export const audiences = [
  {
    label: 'Education', title: 'Preparing students for embodied AI',
    description: 'Students need more than the ability to use AI tools. They need to understand machines that can perceive environments, make decisions and physically interact with the world.',
    outcomes: ['Understand sensors, perception and movement', 'Recognize different levels of robot autonomy', 'Practice safe human-robot interaction', 'Explore robotics careers', 'Discuss ethical and social implications'],
    formats: ['Robot Literacy Curriculum', 'Live Robot Lab', 'Educator Workshops'],
  },
  {
    label: 'Business & Product', title: 'Understanding when robots actually solve a business problem',
    description: 'Organizations increasingly need people who can evaluate robots without being robotics engineers.',
    outcomes: ['Identify viable robotics use cases', 'Compare capabilities and limitations', 'Understand deployment requirements', 'Evaluate human-robot workflows', 'Ask better questions of robotics vendors'],
    formats: ['Executive Workshop', 'Team Training', 'Robot Deployment Workshop'],
  },
  {
    label: 'Designers & Technologists', title: 'Designing experiences beyond screens',
    description: 'Robotics introduces new interaction problems involving movement, space, behavior, autonomy, trust and physical safety.',
    outcomes: ['Human-robot interaction principles', 'Robot behavior and feedback', 'Multimodal interaction', 'Spatial UX', 'Accessibility and inclusive robotics', 'Robot experience evaluation'],
    formats: ['Robot Experience Design Workshops', 'Robot Lab', 'Professional Training'],
  },
  {
    label: 'Workforce', title: 'Working alongside increasingly capable machines',
    description: 'Robot Literacy can help workers understand what robots can do, what they cannot do, and how human roles change when intelligent machines enter the workplace.',
    outcomes: ['Recognize robot capabilities', 'Understand safe interaction', 'Identify collaborative tasks', 'Understand automation versus augmentation', 'Develop practical robotics vocabulary'],
    formats: ['Introductory Robot Literacy', 'Workforce Workshops', 'Hands-on Robot Demonstrations'],
  },
]

export const modules = [
  {
    title: 'Robotics Foundations', objective: 'Understand the major components and categories of modern robots.',
    questions: ['What makes a machine a robot?', 'What is the difference between automation and autonomy?', 'What separates industrial, service, mobile and humanoid robots?'],
    activity: 'Compare several robots and identify their intended environments and capabilities.', deliverable: 'Robot Capability Profile',
  },
  {
    title: 'Perception & Sensors', objective: 'Understand how robots gather information about the physical world.',
    questions: ['What can different robot sensors detect?', 'Why do robots combine multiple sensors?', 'What environmental conditions affect perception?'],
    activity: 'Map the sensors of a robot and identify what information each provides.', deliverable: 'Robot Perception Map',
  },
  {
    title: 'Intelligence & Autonomy', objective: 'Understand how robot decision-making differs across levels of autonomy.',
    questions: ['Who is making each decision: a person or the robot?', 'When does the robot need human supervision?', 'What happens when a task falls outside its capabilities?'],
    activity: 'Evaluate several robot behaviors and determine the level of human control involved.', deliverable: 'Autonomy Assessment',
  },
  {
    title: 'Human-Robot Interaction', objective: 'Understand how robot behavior affects human interpretation, trust and collaboration.',
    questions: ['How does a robot communicate its intentions?', 'Which signals help people interpret robot behavior?', 'How can people share space with a robot?'],
    activity: 'Observe or interact with a robot and document communication signals and behavioral cues.', deliverable: 'Human-Robot Interaction Analysis',
  },
  {
    title: 'Safety, Ethics & Governance', objective: 'Identify physical, ethical, social, accessibility and governance concerns associated with robot use.',
    questions: ['Who could be affected by this deployment?', 'What safety, privacy and accessibility concerns need review?', 'Who is accountable when something goes wrong?'],
    activity: 'Evaluate a proposed robotics deployment from multiple stakeholder perspectives.', deliverable: 'Safety & Ethics Review',
  },
  {
    title: 'Deployment & Application', objective: 'Understand what is required to move from a robot demonstration to a viable deployment.',
    questions: ['Is robotics appropriate for this problem?', 'What infrastructure and human support are required?', 'How will the team evaluate outcomes?'],
    activity: 'Select a real-world problem and evaluate whether robotics is an appropriate intervention.', deliverable: 'Robot Deployment Proposal',
  },
]

export const useCases = [
  { industry: 'Education', scenario: 'A robot enters an elementary-school classroom.', robot: 'Demonstration and interactive learning.', human: 'Educators structure the experience and help students interpret robot capabilities correctly.', question: 'How should children understand robot intelligence, safety and autonomy?' },
  { industry: 'Retail', scenario: 'A mobile robot assists customers inside a store.', robot: 'Navigation, information and customer assistance.', human: 'Employees manage exceptions and higher-value customer interactions.', question: 'When is a robot more useful than a kiosk or employee?' },
  { industry: 'Hospitality', scenario: 'A service robot delivers items inside a hotel.', robot: 'Autonomous delivery within a structured environment.', human: 'Staff coordinate service requests and resolve exceptions.', question: 'How should people communicate with a robot operating in shared spaces?' },
  { industry: 'Logistics', scenario: 'Autonomous mobile robots move goods in a warehouse.', robot: 'Material transportation.', human: 'Workers coordinate tasks, supervise operations and handle exceptions.', question: 'How do people safely coordinate tasks with autonomous machines?' },
  { industry: 'Healthcare', scenario: 'Robots assist staff with transport or monitoring tasks.', robot: 'Operational assistance.', human: 'Healthcare professionals retain clinical judgment and responsibility.', question: 'What should humans understand about privacy, reliability and responsibility?' },
  { industry: 'Workplace', scenario: 'A company evaluates a humanoid robot for repetitive physical work.', robot: 'Potential physical task automation.', human: 'Teams define workflows, safety requirements and supervision.', question: 'Which capabilities are actually autonomous and which still require human supervision?' },
]

export const journey = [
  ['Discover', 'Recognize where robots are entering society and industry.'],
  ['Understand', 'Learn the systems that allow robots to sense, think and act.'],
  ['Interact', 'Experience how humans and robots communicate and share environments.'],
  ['Evaluate', 'Assess capabilities, limitations, risks and suitability.'],
  ['Apply', 'Connect robotics capabilities to meaningful problems.'],
  ['Deploy', 'Understand the organizational, technical and human requirements of real-world implementation.'],
]

export const partners = [
  ['Schools & Districts', 'Introduce age-appropriate Robot Literacy and support educators.'],
  ['Universities', 'Connect curriculum, interdisciplinary learning and research.'],
  ['Companies', 'Build shared understanding across teams evaluating or working with robots.'],
  ['Robotics Organizations', 'Contribute practical knowledge and opportunities for hands-on learning.'],
  ['Researchers & Educators', 'Help develop learning resources and evaluate educational approaches.'],
  ['Community Organizations', 'Make robotics education accessible through public learning experiences.'],
]

export const robotPlatforms = [
  { title: 'Unitree Go2 Pro', label: 'UNITREE GO2 PRO IMAGE', items: ['Locomotion', 'Spatial perception', 'Sensors', 'Robot behavior', 'Physical safety', 'Human-robot interaction'] },
  { title: 'Reachy Mini', label: 'REACHY MINI IMAGE', items: ['Social robotics', 'Conversational interaction', 'Expressive movement', 'Vision', 'AI integration', 'Human-robot communication'] },
  { title: 'Future Robot Platform', label: 'MORE ROBOTS / FUTURE PLATFORM', description: 'The Robot Literacy framework is designed to apply across robot categories, manufacturers and physical form factors.' },
]

export const faqs = [
  ['What is Robot Literacy?', 'Robot Literacy is the ability to understand how robots perceive, make decisions, interact with people and operate in the real world.'],
  ['Who is Robot Literacy for?', 'Students, educators, professionals, designers, workers and organizations preparing for embodied AI.'],
  ['Do participants need programming experience?', 'No. Introductory programs focus on observation, discussion and practical understanding.'],
  ['Is this a robotics engineering course?', 'The focus is understanding, interacting with and evaluating robots. It does not require participants to build or program them.'],
  ['Can Robot Literacy be taught in schools?', 'Yes. Learning objectives and activities can be adapted to different ages and educational settings.'],
  ['Can The Robot Age run an in-person program?', 'Live Robot Lab offers in-person experiences in the NYC Metro Area. Contact us to discuss your location, audience and availability.'],
  ['What robots are used during hands-on programs?', 'Live Robot Lab features Unitree Go2 Pro and Reachy Mini. The platforms and activities for your program are confirmed during planning.'],
  ['Can organizations develop a customized program?', 'Contact us to discuss learning goals, audience, format and how the framework could support your organization.'],
  ['How can robotics companies or universities partner with The Robot Age?', 'Use the form to express interest in curriculum partnerships, research collaboration, sponsorship or other educational initiatives.'],
]
