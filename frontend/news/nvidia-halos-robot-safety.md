---
slug: nvidia-halos-robot-safety
title: "NVIDIA Halos exposes a state-level robot safety gap"
category: NEWS
date: June 24, 2026
excerpt: States already regulate delivery robots and autonomous vehicles. Construction and workplace robots are still waiting for their safety playbook.
headerImage: /images/news/nvidia-halos-robot-safety-header.jpg
thumbnailImage: /images/news/nvidia-halos-robot-safety-thumb.jpg
author: The Robot Age Editorial Team
---

NVIDIA Halos for Robotics arrives before most states know how they want to regulate robots at work. [Announced on June 22](https://nvidianews.nvidia.com/news/nvidia-announces-halos-for-robotics-the-industrys-first-full-stack-safety-system-for-physical-ai), the system connects AI compute, sensor data, safety software, outside-in perception, and inspection into one architecture for physical AI systems operating around people. In the United States, that makes Halos less interesting as a product launch and more interesting as a preview of what state-level robot safety could become.

States have already started regulating robots when they look like transportation. [Virginia authorized personal delivery devices](https://law.lis.virginia.gov/vacode/title46.2/chapter8/section46.2-908.1%3A1/) on sidewalks and crosswalks in 2017, and its current statute sets rules for speed, identification, right of way, and insurance. [Colorado's 2020 cargo-robot law](https://leg.colorado.gov/bills/sb20-092) requires monitoring and control, brakes, identifying information, lights for night use, speed limits, and at least $100,000 in insurance. [Maryland's 2021 framework](https://cav.mdot.maryland.gov/personal-delivery-devices/) adds emergency response plans, 30-day local notice, equipment requirements, and compliance with local laws.

That body of law is narrow. Personal delivery device rules usually deal with sidewalks, crosswalks, shoulders, weight limits, speed limits, human oversight, insurance, and who yields to whom. The Pedestrian and Bicycle Information Center's [legislative tracker](https://www.pedbikeinfo.org/resources/resources_details.php?id=5314) notes that PDD operations are largely left to individual states, with laws focused on operating limits, areas of operation, human oversight, and right of way. Those are useful pieces, but they do not answer what a humanoid should prove before entering a construction site, factory floor, hospital corridor, or warehouse aisle.

Construction is the clearest gap. [OSHA says](https://www.osha.gov/robotics/standards) there are currently no specific OSHA standards for the robotics industry, and its robotics page points instead to related general-industry rules such as machine guarding, lockout/tagout, walking-working surfaces, noise, and personal protective equipment. [State-plan states](https://www.osha.gov/cmaa/standards) can set standards that are at least as effective as federal OSHA, and sometimes more stringent, but the current safety structure is still written around hazards rather than around mobile embodied AI.

That is why Halos matters for states. NVIDIA's stack includes IGX Thor compute, Holoscan Sensor Bridge, Halos OS, Halos Core, and the open source [Outside-In Safety Blueprint](https://github.com/NVIDIA/halos-outside-in-safety/tree/develop/), which uses facility cameras and AI perception to help manage robot behavior from the environment's point of view. A robot entering a worksite should not be making every safety decision from its own body alone, especially when workers, forklifts, lifts, vehicles, and temporary barriers move through the same space.

The inspection layer is the part state agencies should notice. NVIDIA says its Halos AI Systems Inspection Lab is an ANAB-accredited program for functional and AI safety, with certification bodies including TUV Rheinland, UL Solutions, TUV SUD, exida, SGS, and CertX involved in the path to third-party certification. If states begin writing rules for commercial service robots, construction robots, or humanoids, they will need more than a vendor's safety claim. They will need test records, operating domains, remote-operation rules, incident procedures, and inspection evidence.

Agility Robotics is the first public test case. The company plans to integrate NVIDIA IGX Thor and Halos Core into Digit's safe human-detection system and use the inspection lab as it prepares safety-related software, AI components, and cybersecurity protections against standards including IEC 61508, ISO 13849, and ISO/IEC TR 5469. Digit already has industrial customers named by NVIDIA, including Amazon, GXO, Schaeffler, and Toyota Motor Manufacturing Canada, which puts the safety question squarely inside commercial workplaces rather than on a sidewalk.

Massachusetts shows another direction state law may take. Its [pending responsible robotics bill](https://www.billtrack50.com/billdetail/1859450) focuses on weaponized robots, threats, harassment, physical restraint, law-enforcement use, warrants, and public documentation. That is a civil-rights frame, not a workplace-safety frame, but it signals the same shift: states are beginning to define unacceptable robot behavior before a federal robot law exists.

The likely state playbook will borrow from all of these pieces. Delivery-robot laws show how states define operating domains, speed limits, insurance, human oversight, local notice, and emergency response. OSHA and state plans provide the workplace hazard baseline. Voluntary standards such as ANSI/A3 R15.06 and ANSI/RIA R15.08 give manufacturers, integrators, and operators a technical vocabulary for industrial and mobile robot safety. Halos adds a commercial inspection architecture that could make those obligations easier to document.

The practical implication for product teams is direct: US robot deployment will not be governed by one clean federal rulebook. It will be assembled state by state, use case by use case, from transportation law, workplace safety, local permitting, insurance, civil-rights concerns, and third-party safety evidence. Halos does not solve that patchwork. It gives robot companies one more way to prove they are ready to work inside it.

*Header and card images: NVIDIA / Agility Robotics.*
