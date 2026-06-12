---
compositeScore: 2.33
tier: Developing
dimensions:
  # 1. Signal Clarity
  - score: 2
    summary: The front LED stays green regardless of state, there is no sound signaling, and the robot's condition is legible only through the operator app.
  # 2. Spatial Legibility
  - score: 2
    summary: No movement intent or deceleration cues exist, so bystanders cannot predict its path, and front-only camera and LiDAR coverage leaves sensing gaps that produce collisions with objects.
  # 3. Perceived Presence
  - score: 3
    summary: Honest, coherent machine identity — clearly a robot rather than a fake dog, with no tail or face — and non-threatening as a single unit, but the identity is thin and a group of four or five would read as menacing.
  # 4. Failure Transparency
  - score: 2
    summary: Leg calibration drifts silently while powered off and a miscalibrated restart is never surfaced by the robot, so failure knowledge lives with handlers rather than the machine.
  # 5. Interaction Fit
  - score: 3
    summary: Remote control with live HD feed, full autonomy, and loadable 3D scans fit the trained-operator patrol context well, but bystanders have no interaction channel at all.
  # 6. Recovery Design
  - score: 2
    summary: Recovery from calibration drift is manual and unguided — handlers must already know the recalibration procedure because the robot offers no path back.
---
