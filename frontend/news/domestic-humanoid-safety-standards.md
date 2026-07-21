---
slug: domestic-humanoid-safety-standards
title: "Home humanoid safety has a relationship problem."
category: NEWS
date: July 1, 2026
excerpt: Domestic humanoids are moving toward real homes faster than safety standards can define what safe behavior means.
headerImage: /images/news/domestic-humanoid-safety-standards-header.jpg
thumbnailImage: /images/news/domestic-humanoid-safety-standards-thumb.jpg
author: The Robot Age Editorial Team
---

Domestic humanoid safety is no longer a question of whether the robot can avoid hitting someone. It is becoming a question of whether the whole relationship stays safe when the robot, the human, and the room keep changing.

[IEEE Spectrum reported](https://spectrum.ieee.org/domestic-humanoid-robot-safety-standards) that ISO is updating the 12-year-old safety requirements behind ISO 13482, the standard historically aimed at personal care robots. The update matters because home robots are moving from research platforms and carefully staged demos toward products meant for real families, older adults, caregivers, visitors, and children.

The hard part is that a home is not a workcell. A robot in a factory can be bounded by floor markings, trained operators, fixed tasks, controlled lighting, and known procedures. A domestic humanoid enters a room with pets, clutter, wet floors, loose clothing, toys, stairs, tight hallways, changing furniture, cognitive variability, and people who did not consent to become robot operators.

## The safety envelope is relational

Jae-Seong Lee, a technology policy researcher at South Korea's Electronics and Telecommunications Research Institute, frames the central gap clearly in the IEEE interview: human-robot interaction is bidirectional. The robot changes what the person does. The person changes what the robot perceives and does next. Safety emerges from that loop, not from the robot alone.

That is a different design brief from impact limits. A domestic humanoid can be mechanically compliant and still unsafe if it encourages a frail user to overreach, blocks a caregiver's path, misreads a child's play as a command, follows a person too closely in a narrow kitchen, or creates confusion about who is in control during an assistive task.

The risk is not limited to injury. Socially assistive robots in homes may track health, routines, mood, speech, and daily behavior. A [Loughborough University release](https://www.lboro.ac.uk/media-centre/press-releases/2025/july/new-rules-needed-keep-home-care-robots-safe/) on home care robots points to safety, privacy, trust, consent, training, complaint handling, and continuous monitoring as live governance problems. The home robot is a physical device, a data collector, and a social actor at the same time.

## Existing standards cover pieces, not the home

[ISO/FDIS 13482](https://www.iso.org/standard/83498.html) now describes safety requirements for service robots used in personal and professional or commercial settings, excluding industrial and medical robots. That scope is useful, but the IEEE piece argues that the proposed update still leaves major questions in advisory language rather than enforceable tests.

Industrial robot standards are more mature because industrial robots had a clearer world to regulate. [ANSI/A3 R15.06-2025](https://www.automate.org/robotics/safety/robot-safety-standard-documents), the U.S. adoption path for ISO 10218, addresses industrial robots and robot systems. ISO/TS 15066 adds guidance for collaborative robot applications where people and robot arms may share space. These standards give manufacturers and integrators a vocabulary for guarding, speed, separation, risk assessment, and system integration.

Mobile robot standards cover another slice. ANSI/RIA R15.08 and ISO 3691-4 address industrial mobile robots, automated guided vehicles, and mobile behavior in factories and warehouses. They matter because a humanoid is not just a manipulator. It moves. It navigates around people. It can carry objects, reach across paths, and change the layout of risk as it crosses the room.

But the home humanoid does not fit neatly into any one bucket. It is mobile like an industrial mobile robot, manipulative like a robot arm, socially present like a companion robot, and physically unstable in ways that fixed arms and wheeled platforms are not. [A3's humanoid safety discussion](https://www.automate.org/robotics/blogs/safety-by-design-how-humanoid-robots-must-evolve-to-depart-the-walled-garden) notes a specific problem with default emergency-stop assumptions: cutting power to a legged robot can create a new hazard if the robot falls.

## OSHA shows the workplace version of the gap

The U.S. workplace rulebook is not ready to absorb domestic humanoids either. [OSHA says](https://www.osha.gov/robotics/standards) there are currently no specific OSHA standards for the robotics industry. Its robotics page points instead to related rules for walking-working surfaces, occupational noise, personal protective equipment, lockout/tagout, machine guarding, electrical safety, and state-plan standards.

Those rules matter for warehouses, hospitals, labs, and care facilities. They also show how patchwork the near future will be. A humanoid in a logistics facility may be evaluated through industrial robot, mobile robot, machine guarding, and lockout/tagout lenses. A similar body in a home may fall under consumer product safety, privacy law, disability services, product liability, insurance requirements, and voluntary certification.

For product teams, that means "safe enough" will not be a single pass-fail question. It will require evidence across operating domains: who the robot is safe around, which rooms it can enter, which users it can assist, what it does when confused, how teleoperation is disclosed, how it logs incidents, and when it must stop asking the user to adapt.

## The practical risks are ordinary

The most important domestic risks will look mundane. A robot that backs up while carrying laundry may trip a child sitting on the floor. A caregiver may assume the robot has seen a walker when it has not. A user with dementia may treat a prompt as instruction rather than suggestion. A pet may move under the robot during a turn. A kitchen spill may turn a normal step into a fall event.

Loose clothing, blankets, charging cords, toys, rugs, thresholds, and open cabinet doors are not edge cases. They are the baseline condition of domestic robotics. A standard that tests a humanoid in a clean room with healthy adults is not testing the thing buyers are being sold.

The emotional layer adds another failure mode. If a robot speaks with confidence, follows a person, reminds them to take medication, or offers companionship, users may treat its behavior as more capable than it is. UX design becomes safety design. The robot has to communicate uncertainty, limitations, handoff points, and failure states without shifting hidden operational burden onto the person least able to carry it.

## The missing test is safe behavior over time

The standards gap is not that no one knows robots can injure people. The gap is that current standards struggle to define safe relational behavior over time. A domestic humanoid may be safe in a lab trial, then become risky after a furniture change, a software update, a new caregiver, a child's visit, or a shift in the user's health.

That pushes safety toward ongoing assurance. Product teams will need scenario libraries, incident reporting, household onboarding, safe teleoperation indicators, privacy controls, maintenance rules, and user feedback loops. Regulators and insurers will need ways to ask whether the robot remained safe after deployment, not just whether it passed a pre-market checklist.

The next home-robot standard should make one assumption explicit: the human is part of the system. Once that is admitted, the design work changes. Safety is no longer only a property of the machine. It is a property of the machine, the person, the room, and the interaction between them.
