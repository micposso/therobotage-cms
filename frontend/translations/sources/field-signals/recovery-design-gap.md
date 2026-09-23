---
id: 3
slug: recovery-design-gap
essayNumber: '03'
date: 'March 13, 2026'
headline: 'The recovery design gap: what happens after the interaction breaks down.'
refDimension: Recovery Design
title: 'The recovery design gap: what happens after the interaction breaks down.'
excerpt: >-
  Most HRI design stops at the moment of success. Recovery Design asks what the
  robot does — and what it communicates — when the intended interaction fails.
  Most deployed robots have no answer.
---
Most HRI design stops at the moment of success. Recovery Design asks what the robot does — and what it communicates — when the intended interaction fails. Most deployed robots have no answer.

Consider a service robot tasked with delivering medication to a patient room. The door is ajar. The robot cannot determine whether entry is permitted. In the absence of Recovery Design, it waits — no communication, no timeout, no escalation signal. A nurse finds it in the corridor eleven minutes later. The medication is late. No record of the delay exists in the system. The robot fulfilled its technical specification. The interaction failed.

Good Recovery Design defines three things for every failure mode: a signal that communicates failure state to the nearest human in plain terms, a timeout threshold after which the robot escalates or routes around, and a log entry that creates an auditable record of what happened and when. None of these require novel hardware. All three require deliberate design decisions made before deployment.

The cost of absent Recovery Design compounds. A single unresolved interaction is an inconvenience. Thirty unresolved interactions per week, none logged, none escalated consistently, produce a pattern that becomes invisible — absorbed into the ambient frustration of staff without ever surfacing as a solvable problem. The robot is blamed. The deployment is judged as poor. The Recovery Design gap is never named.

For deployers, the practical implication is a pre-launch question that almost no one asks: for each of the ten most likely failure modes in this environment, what does the robot communicate, to whom, and what happens next? If the answer is "we are not sure," Recovery Design is not finished. The robot is not ready.
