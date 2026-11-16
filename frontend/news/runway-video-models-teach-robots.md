---
slug: runway-video-models-teach-robots
title: "Runway is teaching video models to move robots."
category: RESEARCH
date: November 16, 2026
excerpt: "Why a video company is building robot models, and how to explore what robots predict, learn, and get wrong without owning one."
headerImage: /images/news/runway-video-models-teach-robots-header.png
thumbnailImage: /images/news/runway-video-models-teach-robots-thumb.png
author: The Robot Age Editorial Team
---

Runway's move into robotics builds on a problem its video models already work on: predicting how a scene changes over time. Its Praxis-1 release gives designers, educators, and curious observers a way to examine the connection between that prediction and a robot's next movement. The useful starting point is an ordinary task: moving a mug onto a tray.

On November 11, Runway released Praxis-1's model weights and inference and fine-tuning code under Apache 2.0. The release makes the learned parameters available for others to run and adapt. It also provides a timely opportunity to learn what a world action model does, where it struggles, and what exploring one actually requires. [Runway's release announcement](https://runway.com/news/company-news/praxis-1-is-now-available) describes the available materials.

## Video gives robot learning a starting point

Video contains sequences of physical events: hands approaching objects, lids opening, tools changing position. Producing a convincing continuation requires a model to capture patterns across those events. Runway's stated research bet is that this experience can supply a useful starting point for robot control, where collecting demonstrations on physical machines is expensive. Its [Praxis-1 introduction](https://runway.com/research/introducing-praxis-1) connects that bet directly to its earlier video and world-model work.

That explains the technical reason a video-generation company would enter robotics. The same scene can be approached from two directions: what might the next few frames show, and what movement could bring about the intended result? A world model predicts changes in an environment. A world action model connects prediction with commands a robot can execute.

The connection has limits. A convincing clip alone cannot establish that a robot knows how to grip a particular mug. For a learner, the interesting question is where visual prediction ends and physical evidence begins: what was observed, what was generated, and what actually happened when the machine moved?

## Prediction becomes a short sequence of movements

Praxis-1 takes an instruction, camera observations, and the robot's current pose. Its video model predicts the upcoming scene; a separate action component uses internal video features to produce movements. It normally works in 1.6-second chunks, then receives fresh observations for the next call. Runway describes this loop in its [technical report](https://runway.com/research/praxis-1-video-pretraining-to-robot-control).

For our mug example, the instruction specifies the desired result. The camera establishes the visible starting situation. The predicted sequence represents a possible continuation, while the action output directs the gripper. Watching the next observation lets a learner compare the intended result with the changed scene. The example is a way to read the process, not a claim about a particular test.

Training and responding are different processes. Changing an instruction changes the input to a trained model. Fine-tuning changes learned parameters using additional examples. Runway's [training guide](https://github.com/runwayml/praxis-1-oss/blob/main/praxis/train/README.md) describes separate procedures for adapting to a new robot setup and learning a new task on an already supported setup. Seeing a robot adjust its movement does not, by itself, show that its model has learned a lasting new skill.

## Start with observation in your browser

The first learning exercise requires only the public demonstrations in Runway's research pages. Choose a clip with a visible instruction. Pause before the movement and write down three things: the target object, the requested destination, and the evidence that would count as completion. Then watch the attempt and check those expectations against what is visible.

This is an observation exercise we propose for readers. Notice whether the camera lets you see the grasp, whether the object reaches the destination, and whether the clip shows it remaining there after release. Record anything the video leaves uncertain. A selected demonstration can illustrate a behavior; estimating reliability requires repeated attempts and their outcomes.

For an educator, the same clip can become a group exercise. Ask learners to describe the task independently, then compare their descriptions. Differences expose assumptions a human makes automatically: which mug matters, whether its orientation matters, and when the task should be considered finished. No model installation is needed to practice that analysis.

## Simulation lets you compare attempts

Running the model is a more technical step. The [reference repository](https://github.com/runwayml/praxis-1-oss) documents a standard quick start requiring Python, CUDA, and a GPU with at least 80 GB of memory. Smaller, quantized variants have their own hardware requirements. Open weights provide access to the model; they do not make every version practical on an everyday laptop.

A technically supported workshop can use the supplied MuJoCo simulation to explore tabletop tasks without a physical arm. Its [simulation guide](https://github.com/runwayml/praxis-1-oss/blob/main/praxis/sim/README.md) describes a live browser view and recorded runs. An instructor or developer must first configure the software and compute behind that view. It is a browser window onto a running experiment, not a ready-made public chatbot.

Our suggested experiment is to keep a supported task and starting conditions fixed, then compare two instructions that describe the same goal with different specificity. Repeat the comparison across several starting conditions. Record the target chosen, completed steps, and failures. Ask whether clearer language helped consistently, and keep the unsuccessful attempts in the record.

## A physical robot adds another layer

Hardware experiments require a model adapted to the actual setup. The [Praxis-1 base model card](https://huggingface.co/runwayml/praxis-1-base) explicitly says its base checkpoint cannot operate as a robot policy as supplied: it lacks the robot-specific action components. Downloading that checkpoint is a starting point for adaptation, rather than a complete controller for any arm.

For a school, makerspace, or design studio, a supervised session with a robotics instructor is a practical next step. The learning objective can remain modest: compare one supported task in simulation and on hardware, document the differences, and identify what the cameras, gripper, and workspace contribute. Buying a robot is unnecessary for the earlier observation exercises.

## The failures teach the most useful lesson

Runway reports that Praxis-1 can select similar-looking objects incorrectly, struggles with vague instructions, and has difficulty completing several steps from one prompt. These are limitations reported by the model's creators, not results from our own testing. They make specificity, task boundaries, and completion checks useful subjects for readers to investigate. [Reported limitations](https://runway.com/research/praxis-1-video-pretraining-to-robot-control)

The article's exercises are proposals for learning, not experiments we have run. Their purpose is to build a habit that transfers beyond Praxis-1: describe the requested behavior, observe the evidence, and separate a plausible prediction from a completed physical task.

Start with one instruction, one visible outcome, and a record of what the robot actually did.

*Header and preview: AI-generated editorial illustrations of an imagined robot-learning setup, not photographs of Runway hardware or experimental results.*
