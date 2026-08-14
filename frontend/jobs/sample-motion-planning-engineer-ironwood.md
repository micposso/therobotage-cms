---
slug: sample-motion-planning-engineer-ironwood
title: Motion Planning Engineer
company: ironwood-robotics
role_family: controls-motion
seniority: mid
employment_type: full-time
remote_type: hybrid
state: PA
city: Pittsburgh
posted_at: 2026-08-10
apply_url: https://example.com/careers/motion-planning-engineer
salary_min: 150000
salary_max: 195000
salary_period: year
tags: [MoveIt, trajectory optimization, C++, manipulation]
summary: Plan collision-free arm trajectories in cluttered bins where the scene changes between the plan and the grasp.
---

## What the role actually is

Sample listing for local development. You write the planner that decides how a seven-degree-of-freedom arm reaches into a bin without hitting the four things it is not trying to pick. Replanning latency is the whole game: the scene is stale the moment perception hands it over.

## What you would work on

- Cut planning time for cluttered bin picks so the arm is not the bottleneck in the cell
- Build the fallback behavior for when no collision-free path exists at all
- Work directly with the perception team on what the planner needs the scene to guarantee

## What they are asking for

- Has implemented sampling-based or optimization-based planners on real hardware, not only in simulation
- Reads and writes production C++
- Understands why a plan that is optimal on paper can be unusable on a real arm

## Why this one is worth a look

Manipulation in unstructured environments is where the remaining hard problems live, and Ironwood works on real customer bins rather than benchmark datasets. Hybrid means genuinely hybrid here: the hardware is in Pittsburgh and you will be in front of it.
