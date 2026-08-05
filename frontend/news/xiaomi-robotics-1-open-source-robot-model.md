---
slug: xiaomi-robotics-1-open-source-robot-model
title: "Xiaomi just made the robot model itself part of the open-source race."
category: ANALYSIS
date: August 5, 2026
excerpt: "Xiaomi-Robotics-1 turns open-source robotics into an infrastructure argument: shared models can help labs, developers, and smaller manufacturers move faster than closed product stacks."
headerImage: /images/news/xiaomi-robotics-open-source-header.png
thumbnailImage: /images/news/xiaomi-robotics-open-source-thumb.png
author: The Robot Age Editorial Team
---

Xiaomi's robotics group has open-sourced [Xiaomi-Robotics-1](https://github.com/XiaomiRobotics/Xiaomi-Robotics-1), a vision-language-action foundation model trained for mobile manipulation. The release matters because it is not only another impressive robot demo. It is a bet that the base model for robotics can become shared infrastructure.

The timing is sharp. On July 30, Google DeepMind introduced [Gemini Robotics 2](https://deepmind.google/blog/gemini-robotics-2-brings-whole-body-intelligence-to-robots/), a new physical AI stack for whole-body control, dexterous manipulation, on-device adaptation, and multi-robot collaboration. A few days later, Xiaomi pushed in the opposite direction commercially: instead of showing only a private partner system, it put a robot foundation model into public developer channels.

That contrast is becoming one of the defining tensions in robotics. China is increasingly treating open models, open weights, and open datasets as a way to accelerate an ecosystem. Many American companies are building powerful robotics models inside closed product stacks, partner programs, or first-party robot businesses. One approach distributes capability. The other concentrates capability around products.

## What Xiaomi released

The [Xiaomi-Robotics-1 repository](https://github.com/XiaomiRobotics/Xiaomi-Robotics-1) describes XR-1 as a robot foundation model trained on more than 100,000 hours of real-world manipulation trajectories. It uses a vision-language-action architecture designed for out-of-the-box mobile manipulation in unseen environments and faster adaptation to new tasks.

The training recipe follows the pattern now familiar from large language models: broad pre-training first, then post-training for alignment. Xiaomi says XR-1 was pre-trained on 100,000-plus hours of embodiment-free UMI manipulation data across more than 1,700 household, commercial, industrial, and outdoor scenarios. It was then post-trained on more than 10,000 hours of cross-embodiment robot data.

The practical claim is not that a downloaded model suddenly makes any robot useful. Robotics does not work that way. Cameras must be calibrated, action spaces must match, latency must be controlled, safety systems must be built, and every deployment still has to survive the real world. The meaningful claim is narrower and more important: a team should not have to start from a blank policy every time it changes the task, gripper, room, object set, or robot body.

Xiaomi also points to benchmark results across RoboCasa, RoboCasa365, VLABench, and RoboDojo, and says XR-1 ranked first on RoboCasa365 and RoboDojo as of July 15, 2026. Benchmarks are not deployment proof, but they give outside teams something to reproduce, contest, and improve. That is exactly what open robotics needs.

## How it compares with Google DeepMind

Google DeepMind's Gemini Robotics 2 is the more ambitious system at the frontier. DeepMind says it enables full humanoid control from feet to fingertips, improved dexterity, teamwork between robots, and adaptation to new robot bodies with only a few hours of data. Its embodied reasoning model, [Gemini Robotics ER 2](https://blog.google/innovation-and-ai/models-and-research/google-deepmind/gemini-robotics-er-2/), is framed as the high-level brain: it understands video, tracks task progress, plans multi-step workflows, calls tools, and hands off execution to lower-level robot controllers.

The developer story is different. [Google's robotics API documentation](https://ai.google.dev/gemini-api/docs/robotics-overview) makes Gemini Robotics ER 2 available through the Gemini API and AI Studio, including standard and streaming preview endpoints. The broader Gemini Robotics 2 action model and on-device model remain closer to an early-access partner path. Google's [model card](https://deepmind.google/models/model-cards/gemini-robotics-er-2/) describes API distribution and usage terms, not an open-weight release that outside labs can freely inspect, fork, or fine-tune.

That does not make Google's approach wrong. Robotics is safety-sensitive, hardware-dependent, and expensive to validate. A controlled release can protect quality, manage risk, and support serious partners. But it does mean the adoption path is gated. Developers can build with exposed reasoning endpoints, but they are not being handed the full underlying robotics stack.

Xiaomi is making a different ecosystem argument. If the model weights, code, benchmarks, and deployment path are available, then smaller labs, universities, component manufacturers, and independent robotics teams can test the model on their own embodiments. They can publish failures. They can adapt it to niche hardware. They can compare it against competing systems without waiting for a business development conversation.

## China's open robotics strategy is getting clearer

Xiaomi-Robotics-1 is not an isolated signal. Xiaomi previously released [Xiaomi-Robotics-0](https://huggingface.co/papers/2602.12684), an open-source VLA model focused on real-time execution. Its Hugging Face organization now lists Xiaomi-Robotics-1 models, Xiaomi-Robotics-0 variants, and the Xiaomi-Robotics-U0 world foundation model collection. Alibaba's DAMO Academy has published [RynnBrain](https://arxiv.org/abs/2602.14979), described as an open-source embodied foundation model family for spatial-temporal understanding, reasoning, planning, and VLA transfer. AgiBot has released [AGIBOT WORLD 2026](https://agibot-world.com/), an open-source embodied AI dataset initiative built around real-world robotics data.

The pattern is not simply "China open, America closed." Meta, NVIDIA, Hugging Face, universities, and open robotics communities in the United States and Europe all contribute heavily to open AI and robotics. But in commercial humanoids and embodied AI, the center of gravity is diverging. Chinese companies appear increasingly willing to publish model assets and datasets as ecosystem accelerants. American robotics companies often keep the core model layer private because the model is tied directly to a product, a fleet, or a vertically integrated robotics business.

For adoption, that distinction matters. Robots are not like chatbots, where a team can swap one API for another over a weekend. A robot model has to be integrated with cameras, hands, wheels, arms, batteries, middleware, safety cases, facilities, and people. The more closed the model layer is, the harder it is for third parties to understand why a robot behaves the way it does or adapt it to local constraints.

Open models do not solve robotics. They change who gets to work on the unsolved parts.

## Why openness helps robotics adoption

The biggest benefit of an open robot foundation model is not ideology. It is operational surface area. More teams can test the same model in more environments, on more hardware, with more failure cases than any single company can stage internally.

That matters because robotics failure is local. A model that works in a pristine lab may fail in a hotel corridor, a restaurant back room, a warehouse aisle, or a home with bad lighting and inconsistent object placement. Open releases let researchers and practitioners publish those mismatches. They also let the community develop adapters, evaluation scripts, safety wrappers, and deployment recipes around a common base.

Open models also reduce the entry cost for robotics builders outside the largest companies. A startup building a specialized inspection robot, a university lab studying handoff behavior, or a manufacturer testing a new gripper can begin with an existing foundation model rather than collecting a full training corpus from scratch. That does not remove the need for real-world data, but it can move the early work from "can we train anything at all?" to "how well does this transfer to our task?"

There is also a human-robot interaction benefit. When more teams can inspect, adapt, and evaluate the model, the design conversation gets broader. UX researchers, product managers, safety researchers, and operations teams can begin asking how the system represents uncertainty, when it asks for help, how it recovers, what progress looks like, and where the human should remain in control. Closed systems tend to expose those questions only after product behavior has already hardened.

## The risk is pretending open means deployable

The open-source label deserves scrutiny. A robotics release can include code without useful weights, weights without training data, training claims without reproducible evaluation, or a license that limits practical use. Xiaomi-Robotics-1 is more useful because the public release points to code, Hugging Face resources, benchmark evaluation, and deployment materials. Even so, teams should inspect the actual license, model files, data availability, hardware assumptions, and deployment requirements before treating it as a foundation for a product.

Open models also introduce safety questions. More access means more experimentation, including low-quality integration. In robotics, low-quality integration can damage property or injure people. The answer is not to retreat entirely into closed systems. It is to make evaluation, safety wrappers, emergency stops, logs, simulation tests, and deployment constraints just as shareable as the model itself.

That is where Xiaomi's release will be judged. The headline is the model. The ecosystem value will come from whether outside teams can reproduce its results, adapt it to new robots, report failures honestly, and build safer deployment practices around it.

## The real race is the robotics platform layer

Google DeepMind is pushing the frontier of embodied reasoning and whole-body intelligence. Xiaomi is pushing open-source robotics toward a foundation-model platform. Those are not the same move.

Google's system shows what high-end robotics intelligence may become: a reasoning layer that understands physical scenes, tracks progress, coordinates multiple robots, and drives complex bodies through partner hardware. Xiaomi's release shows how robotics capability might spread: through open weights, common benchmarks, reusable deployment code, and an expanding community of labs and builders.

The adoption question is no longer only which model performs best in a demo. It is which model gives the broader market enough access to learn, adapt, govern, and trust robots in ordinary environments.

If China keeps releasing usable open robotics models while American robotics companies keep their most important systems locked inside their own products, the gap may not show up first in benchmark scores. It may show up in diffusion. More people will be able to build, test, teach, and criticize the open systems. That is how an ecosystem compounds.

Robotics will still need excellent closed products. But the field also needs shared foundations. Xiaomi-Robotics-1 is a sign that the base layer of robot intelligence may not belong only to the companies selling the robots.
