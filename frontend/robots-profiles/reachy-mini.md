---
slug: reachy-mini
title: Reachy Mini
manufacturer: "Pollen Robotics / Hugging Face"
category: Robot Profile
type: Desktop Companion Robot
country: France
priceRange: "$299–$449"
yearIntroduced: 2025
autonomy: Platform-Configurable
industry: "Education / Research"
image: /images/robots/reachy-mini/hero.png
description: "An open-source desktop robot from Pollen Robotics and Hugging Face — a low-cost embodied AI platform for developers, educators, and researchers."
deploymentBoxes:
  - label: Operational Context
    title: Desktop research and development
    body: >-
      The robot sits on a desk or table, interacting at close range with one or a few people. It is not a mobile platform — it does not navigate or roam. Most interactions happen in developer workspaces, classrooms, or research labs, typically at seated eye level. The Wireless version can be moved between locations; the Lite version stays tethered to a host computer.
  - label: User Population
    title: Developers, researchers, and educators
    body: >-
      Primary users are technically proficient — developers working in Python and ROS2, AI/ML researchers exploring embodied interaction, and educators building robotics or AI curricula. Non-technical users, including students and demo audiences, encounter the robot as bystanders or in guided interactions. Their experience depends entirely on what the primary user has built into the robot.
  - label: Friction Points
    title: Early platform, opaque failures
    body: >-
      Documentation is incomplete and APIs are still shifting between releases. Non-developer users hit a wall immediately — there is no onboarding layer for end users. When things fail, the robot goes silent. Nothing communicates what went wrong or what to do next. The gap between a configured, expressive robot and a freshly unboxed one is enormous and falls entirely on the developer to bridge.
  - label: Field Observations
    title: Small motion, strong attribution
    body: >-
      Even with limited degrees of freedom, users project significant intent onto the robot. Antenna movement and head orientation alone were sufficient for observers to attribute curiosity, acknowledgment, and attentiveness — consistent with findings in low-DoF social robotics research. The "Pixar lamp" effect is real: timing and direction of motion matter more than mechanical complexity. When the robot speaks and looks toward the user simultaneously, perceived presence jumps noticeably.
gallery: []
---

Reachy Mini is a compact, open-source desktop robot built by Pollen Robotics and brought into the Hugging Face ecosystem following the company's 2025 acquisition. At 28 cm tall and starting at $299, it is the most accessible entry point into embodied AI development — a physical interface for LLMs, voice agents, and multimodal AI workflows. Its six-degree-of-freedom head, rotating base, wide-angle camera, and four-microphone array give AI models a body to inhabit. Two versions exist: the Lite, wired and requiring a host computer, and the Wireless, which runs a Raspberry Pi 5 onboard and operates on battery. The human experience of interacting with Reachy Mini is largely what the developer makes it — but the platform's openness, deep Hugging Face ecosystem integration, and explicitly AI-native SDK make it one of the most consequential developer robotics launches in years.
