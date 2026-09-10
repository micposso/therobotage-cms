export const definition = 'The Robot Age’s Robot Literacy framework is a practical framework for understanding what robots can do, how humans and robots should interact, and what changes when robots become part of society.'

export const framework = [
  {
    title: 'READ',
    scale: 'Understand the robot',
    question: 'Understand the robot.',
    headerQuestions: [],
    description: 'What can it do? What can it sense? How autonomous is it? What data does it collect or transmit? Where are its limits?',
    topics: ['Capabilities', 'Sensing', 'Autonomy', 'Data', 'Limitations'],
    example: 'A delivery robot pauses at a crossing. Is it waiting for a clear path, following a rule, or waiting for help from a remote operator? The pause alone does not tell you.',
    deeper: [
      ['Look beyond appearances', 'Cameras capture images; microphones capture sound; LiDAR uses light to estimate distances. Other sensors may measure depth, location or contact. A visible sensor is a clue, not proof of what the robot understands or records.'],
      ['Ask who is in control', 'A robot may follow fixed rules, use AI to read a situation, act independently within limits, or be controlled remotely. Human supervision and autonomy can coexist. Ask which tasks it can do on its own and when a person steps in.'],
      ['Follow the information', 'What might it know about you? Is sensor information recorded, stored or transmitted elsewhere? What can it miss? Ask the operator what happens when sensing, connectivity or movement fails.'],
    ],
  },
  {
    title: 'RELATE',
    scale: 'Interact with robots',
    question: 'Interact with robots.',
    headerQuestions: [],
    description: 'How should robots behave around people? How should people behave around robots? What creates trust, healthy boundaries, clear communication and responsible interaction?',
    principle: '',
    topics: ['Trust', 'Communication', 'Boundaries', 'Human control', 'Responsibility'],
    example: 'Someone blocks a delivery robot for fun; another person helps it find a clear route. Both actions affect the people waiting for it and everyone sharing the sidewalk.',
    deeper: [
      ['Reciprocal responsibility', 'People can expect safe, understandable robot behavior. In turn, blocking, kicking, damaging or deliberately confusing a robot can disrupt a service or put people at risk. Helping or protecting it may also have consequences: follow operator guidance rather than assuming it is safe to touch or move.'],
      ['Recognize the relationship', 'People may name a robot, trust it or become attached to it. A friendly voice or familiar behavior can encourage us to attribute human qualities to a machine. Consider emotional boundaries, dependency and appropriate supervision without assuming the robot has feelings.'],
      ['Keep difficult questions open', 'Increasing autonomy may prompt questions about machine agency, moral consideration and responsibilities toward robots. These are questions to reason about, not evidence that today’s robots have human rights.'],
    ],
  },
  {
    title: 'COEXIST',
    scale: 'Live with robots',
    question: 'Live with robots.',
    headerQuestions: [],
    description: 'What happens when robots become part of workplaces, schools, homes and public spaces? Who benefits, who is affected and who remains responsible?',
    topics: ['Privacy', 'Work', 'Accessibility', 'Governance', 'Accountability', 'Society'],
    example: 'A hospital introduces a supply-delivery robot. Its route, sensors and operating rules affect patients, visitors, cleaners and clinicians—not just the team that ordered it.',
    deeper: [
      ['Privacy includes bystanders', 'Cameras, microphones, location systems, LiDAR, depth and environmental sensors may gather information about people who never chose to interact. What is sensed, recorded and stored? Is processing local or remote? Who owns the data and can access it? Is it sent to another organization over a wireless connection? Can a bystander opt out?'],
      ['Culture & representation', 'Robots are designed within culture and understood through culture. Appearance, gender, voice, language and racial representation can reinforce stereotypes. Does the design suggest authority, servitude, military power or caregiving? How might cultural symbolism and social expectations change its meaning across communities?'],
      ['Work is more than job replacement', 'Which tasks are automated and which jobs change? Who supervises and maintains the robot? Can it augment workers? Who benefits from productivity, what new roles emerge, and who picks up the work when automation fails?'],
      ['Accessibility & inclusion', 'Can a wheelchair user pass safely? Can a blind person understand its movement or someone who cannot hear receive its warnings? Does it support different speech patterns, languages, bodies and behaviors? Ask whether it creates access or a new barrier.'],
      ['Governance & accountability', 'Who owns, operates, supervises and maintains it? Who controls its data, can stop it and remains responsible if something goes wrong? What rules govern its behavior, and who investigates an incident? These questions matter to communities and policymakers as well as operators.'],
      ['Emerging robot status · a future-facing question', 'As robots develop more autonomy, persistent memory, identity, agency, reasoning, social relationships or self-preservation behavior, society may revisit how to classify them: property, product, agent, worker, companion, legal entity or something new? These capabilities do not by themselves establish rights or moral status. The framework helps people recognize and reason about the question without prescribing an answer.'],
    ],
  },
] as const

export const applications = [
  {
    audience: 'For Schools',
    title: 'Prepare students to understand robots, not simply use them.',
    description: 'The Robot Age’s Robot Literacy framework gives educators and students a shared language for discussing robots beyond coding or robotics engineering: capabilities, sensing, privacy, appropriate interaction, human responsibility and the role robots may play in society.',
    questions: ['What does this robot actually understand?', 'What information can it collect?', 'How should children interact with it?', 'When should a teacher or other human remain in control?'],
    cta: 'Experience the Live Robot Lab',
    href: '/live-robot-lab',
  },
  {
    audience: 'For Organizations',
    title: 'Make better decisions about when, where and how robots should be deployed.',
    description: 'The Robot Age’s Robot Literacy framework helps leaders, workers, designers and technology teams examine capabilities, human interaction, workflow changes, privacy, accessibility, risk and accountability before treating robotics as simply a technology purchase or engineering concern.',
    questions: ['Should a robot perform this task?', 'How will employees or customers interact with it?', 'What happens when it fails?', 'Who remains responsible?'],
    cta: 'Explore Robot Literacy Consulting',
    href: '#inquiry',
  },
  {
    audience: 'For Individuals & Society',
    title: 'Build the knowledge needed to live and work alongside robots.',
    description: 'The Robot Age’s Robot Literacy framework gives professionals, students and the public a way to examine robots entering workplaces, public spaces and everyday life without needing to code or build robots, while understanding questions involving privacy, employment, accessibility, governance and human responsibility.',
    questions: ['What should I know when I encounter a robot?', 'What can it perceive about me?', 'How could robots change my profession?', 'What rules and expectations should society develop?'],
    cta: 'Build Your Robot Literacy',
    href: '/learn/rep',
  },
] as const

export const exercise = [
  ['What sensors can you identify?', 'Look for lenses and other sensor housings. A camera may capture images; a distance sensor may help locate obstacles. Some sensors are hidden, and appearance cannot establish the full set of capabilities.'],
  ['Can it see you?', 'It might detect an obstacle or a person without recognizing who you are. Detection is not the same as understanding your intentions. Do not assume that a robot has noticed you or will yield.'],
  ['Is it recording?', 'Sensing does not necessarily mean recording. You cannot tell from a camera alone. Look for a notice or ask the operator what is recorded, stored and retained.'],
  ['Is it autonomous—or remotely controlled?', 'It may navigate on its own, receive occasional human assistance, or be driven remotely. Ask when a human takes over and whether the robot makes that change clear.'],
  ['Where might its data go?', 'Information may be processed on the robot or sent to remote systems. Ask who receives it, who can access it and whether bystanders have a way to opt out.'],
  ['What happens if you step into its path?', 'It might slow down, stop, reroute or fail to detect you. Do not step into its path to test it. Give it space and use operator guidance if it blocks access or appears stuck.'],
] as const

export const decisions = [
  ['Capability', 'Can the robot reliably perform the task?', 'Look for evidence in the actual setting, including unusual conditions and the limits of its operation.'],
  ['Need', 'Does the task benefit from embodiment or mobility?', 'Ask what being physically present adds. Compare a robot with a simpler tool, software or a change to the service.'],
  ['People', 'How will humans interact with it?', 'Include users, workers and bystanders. Plan communication, boundaries, supervision and a way to get human help.'],
  ['Privacy', 'What information must it perceive or collect?', 'Distinguish information needed to operate from information retained. Ask about access, transmission and meaningful choices for bystanders.'],
  ['Risk', 'What happens if it fails?', 'Consider physical harm, interrupted services and recovery. Identify who can stop it and how people can continue without it.'],
  ['Accessibility', 'Who could be excluded?', 'Review movement, warnings, language and communication with people who have different access needs.'],
  ['Work', 'How does it change human roles?', 'Involve affected workers. Consider supervision, maintenance, training, workload and who shares the benefits.'],
  ['Accountability', 'Who remains responsible?', 'Name the owner, operator and incident contact. Define who monitors outcomes, investigates problems and can change or end the deployment.'],
] as const

export const useCases = [
  { industry: 'Education', scenario: 'A robot enters an elementary-school classroom', robot: 'Support a teacher-led learning activity.', human: 'Set learning goals, supervise children and offer a human alternative.', read: 'What can it actually perceive and understand?', relate: 'How should children interact with it, and how should it behave around children?', coexist: 'What information is collected? What expectations might children develop about intelligent machines?' },
  { industry: 'Retail', scenario: 'A robot scans shelves while people shop', robot: 'Check stock and flag gaps.', human: 'Verify findings, help shoppers and keep aisles accessible.', read: 'Can it distinguish products from people, and what does it record?', relate: 'How does it signal its route and yield to a shopper?', coexist: 'Can bystanders avoid its sensors? Does it change staff workload or access to the store?' },
  { industry: 'Hospitality', scenario: 'A hotel robot brings a guest fresh towels', robot: 'Transport an order to a room.', human: 'Prepare the delivery and handle requests the robot cannot meet.', read: 'Can it use the elevator independently? When does an operator help?', relate: 'Are arrival signals understandable without hearing or seeing them?', coexist: 'What guest or location data is retained? Who helps when the delivery fails?' },
  { industry: 'Logistics', scenario: 'Mobile robots share a warehouse with workers', robot: 'Move goods between work areas.', human: 'Coordinate tasks, maintain equipment and handle exceptions.', read: 'Where can it operate, and how does it detect obstacles?', relate: 'Can workers predict its movement and safely stop the system?', coexist: 'Who benefits from productivity? Does work become safer, more demanding or differently supervised?' },
  { industry: 'Healthcare', scenario: 'A robot carries supplies through a hospital', robot: 'Transport materials along an agreed route.', human: 'Set priorities, keep care decisions with staff and respond to incidents.', read: 'What does it sense in corridors, and when does it need help?', relate: 'How does it yield to patients, mobility aids and urgent care?', coexist: 'How are patient privacy, accessibility and service continuity protected?' },
  { industry: 'Workplace', scenario: 'A collaborative robot joins an assembly team', robot: 'Assist with a defined physical task.', human: 'Set up the task, monitor work and manage exceptions.', read: 'What are its movement limits and safeguards for this task?', relate: 'How do people coordinate a handoff and know it is safe to approach?', coexist: 'What training and new roles are needed? Who is accountable if a safeguard fails?' },
  { industry: 'Public spaces', scenario: 'A delivery robot uses a busy sidewalk', robot: 'Carry an order through a shared public route.', human: 'Operate the service, provide support and keep public access open.', read: 'Is it navigating itself or receiving remote help?', relate: 'Can pedestrians predict its route? How can people report an obstruction without interfering?', coexist: 'Who approved the route? Can wheelchair users pass, and what choices do bystanders have about data?' },
  { industry: 'Home', scenario: 'A social robot becomes part of a household', robot: 'Offer conversation, reminders or shared activities.', human: 'Set boundaries, manage permissions and supervise use.', read: 'When is it listening, what does it remember and where is that information stored?', relate: 'How might people become attached? When should a person take over?', coexist: 'Can visitors decline recording? How does it affect care, dependency and household relationships?' },
] as const

export const audiences = [
  ['Students & Educators', 'Prepare learners to understand robots, ask informed questions and discuss their place in everyday life.'],
  ['Workers & Professionals', 'Understand how robots may change workflows, responsibilities and workplaces.'],
  ['Designers & Technologists', 'Design responsible, usable and accessible human–robot experiences.'],
  ['Leaders & Organizations', 'Evaluate when robotics makes sense and what responsible deployment requires.'],
  ['Communities & the Public', 'Understand robots entering shared spaces and services, and participate in decisions about their use.'],
] as const

export const faqs = [
  ['What is Robot Literacy?', `${definition} The Robot Age organizes its evolving educational framework into READ, RELATE and COEXIST.`],
  ['Is Robot Literacy a robotics engineering course?', 'No. It focuses on understanding robots in everyday life and making informed judgments about them. You can explore sensors and autonomy without designing hardware or studying engineering.'],
  ['Do I need programming experience?', 'No. Start with observation and plain-language questions. The framework is for the general public as well as students, educators, professionals, designers, technologists and policymakers.'],
  ['How is Robot Literacy different from AI literacy?', 'AI literacy helps people understand intelligent digital systems. Robot Literacy extends that understanding into physical environments, where sensing, movement and interaction can affect bodies, shared spaces and people who never chose to use the system.'],
  ['Why does privacy matter with robots?', 'A robot’s sensors may gather information about users and bystanders. Knowing that it has a camera does not tell you whether it records, stores or transmits images. Robot Literacy helps people ask about these distinctions and who controls the information.'],
  ['Why does Robot Literacy consider how people treat robots?', 'Human behavior affects the people around a robot and those who depend on its work. Blocking, damaging, helping or becoming attached to a robot can all have consequences. Reciprocal responsibility means examining both sides of an interaction without assuming a robot has feelings.'],
  ['Do robots have rights?', 'Robot Literacy does not claim that today’s robots possess legal or moral rights. It introduces an open question: could increasingly autonomous and socially integrated robots prompt future debates about moral consideration, responsibility and legal status? The aim is to help people reason about those debates, not settle them.'],
  ['Can Robot Literacy be taught in schools?', 'Yes. Observation, discussion and supervised activities can introduce the framework at different ages. Educators can connect it to digital literacy, design, citizenship and critical thinking, with suitable privacy and supervision arrangements.'],
  ['Is Robot Literacy appropriate for companies?', 'Yes. Teams can use it to examine workflows, human interaction, accessibility, privacy and accountability before and during a deployment. It supports informed decisions across technical and nontechnical roles.'],
  ['Can The Robot Age run an in-person program?', 'Yes. Live Robot Lab and workshops offer opportunities to observe and interact with real robots. Use the organization inquiry form to discuss location, audience, availability and program scope.'],
  ['What robots are used?', 'Programs feature Unitree Go2 Pro and Reachy Mini. The Robot Age’s Robot Literacy framework is hardware-agnostic: its questions also apply to humanoids, quadrupeds, social robots, autonomous mobile robots, cobots and emerging robotic systems.'],
  ['Can organizations partner with The Robot Age?', 'Yes. We welcome conversations about curriculum, research, workshops and real-world learning with educators, institutions and robotics organizations. Select Curriculum Partnership in the inquiry form to start a conversation.'],
] as const
