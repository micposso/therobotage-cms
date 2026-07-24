---
slug: var-offside-robot
title: "Did a robot help erase 17 World Cup goals?"
category: OPINION
date: July 24, 2026
excerpt: "At the 2026 World Cup, 17 goals ruled offside reopened the robot question: when does machine perception become part of the game?"
headerImage: /images/news/var-offside-robot-referee-header.jpg
thumbnailImage: /images/news/var-offside-robot-referee-thumb.jpg
author: The Robot Age Editorial Team
---

Did a robot help erase 17 World Cup goals? The honest answer is no if "robot" means a conventional ISO-defined machine that performs locomotion, manipulation, or positioning. The more interesting answer is maybe, if "robot" now includes the distributed sensing and decision-support infrastructure that makes a football pitch machine-readable.

## A robot is not just the shape

The popular image of a robot is a visible machine: a humanoid, a warehouse arm, a delivery rover, a quadruped. The International Federation of Robotics points to [ISO 8373](https://ifr.org/standardisation), where a robot is a programmed, actuated mechanism with a degree of autonomy that performs locomotion, manipulation, or positioning. That definition fits many machines without human faces.

VAR fails the conventional ISO test. The current robotics definition centers locomotion, manipulation, or positioning; VAR primarily senses, computes, visualizes, and communicates. Human officials perform the consequential action. That makes VAR better understood as a distributed cyber-physical perception and decision-support system, using capabilities familiar to autonomous robotics: sensing, state estimation, temporal synchronization, and human-machine interaction.

That distinction is the article's premise, not a loophole. VAR is not a secret humanoid referee hiding in the video room. It is a case study in robotics becoming environmental: the stadium becomes the body, the camera network becomes the eyes, the connected ball supplies timing data, software estimates state, and officials become the action layer.

## VAR is a sensing machine for the pitch

VAR is often described as video review, but FIFA's semi-automated offside technology is closer to a field-scale perception system. At Qatar 2022, FIFA said the setup used [12 dedicated tracking cameras](https://inside.fifa.com/innovation/world-cup-2022/semi-automated-offside-technology) mounted under the stadium roof to follow the ball and up to 29 data points on each player, 50 times per second. The cameras are fixed around the stadium rather than roaming through it, but their combined view lets the system watch the pitch as a single instrument. The official Al Rihla match ball added an inertial measurement unit inside the ball, sending data to the video operation room 500 times per second.

At the 2026 World Cup, that infrastructure became more visible. [TechRadar reported](https://www.techradar.com/tech/exclusive-the-emotion-is-doubled-its-not-reduced-the-worlds-most-famous-referee-insists-var-hasnt-killed-the-joy-of-world-cup-goal-celebrations) that VAR itself was run by Hawk-Eye Innovations on Lenovo workstations, while FIFA and Lenovo used player-scanning and AI systems around the tournament's officiating stack. Collina's own defense of the system was revealing: technology could help with offside and goal-line decisions, but it still could not assess pushing, pulling, or other contact by itself.

That matters because offside is not judged when the attacker receives the ball. It is judged at the instant the ball is played by a teammate. The hard problem is synchronization: where was every relevant body part at the exact kick point? The ball sensor narrows the kick moment. The cameras reconstruct player positions. Artificial intelligence combines the two streams and proposes an offside alert for officials to verify.

## Humans still own the decision

FIFA is careful to call the system semi-automated because video match officials still validate the output. The VAR team manually checks the automatically selected kick point and the automatically drawn offside line before the referee is informed. If the officials disagree with the proposed kick point or line, FIFA says they can use existing manual tools instead.

That distinction is important. The [IFAB VAR protocol](https://www.theifab.com/laws/latest/video-assistant-referee-var-protocol/) still says the final decision belongs to the referee, and VAR assists only in defined match-changing situations such as goal/no goal, penalty/no penalty, red-card incidents, mistaken identity, and the newer competition option for clearly incorrect corner kicks. The machine measures. The officials decide whether the measurement applies to the law.

## The numbers changed the sport's emotional rhythm

The 2026 number is the hook, but it needs careful wording. The Canadian Premier League, while explaining its FIFA-backed daylight offside trial, said [17 goals disallowed for offside](https://www.cplsoccer.com/news/how-daylight-offside-rule-would-have-changed-the-world-cup) at the World Cup up to the Round of 32 would more than likely have stood under the daylight rule. That is not an official FIFA full-tournament count of VAR interventions. It is still the clearest published number around the offside controversy: 17 celebrated goals turned into no-goals because the player was measured offside under the current law.

Other reporting shows how the number lived on the field. The [Los Angeles Times](https://www.latimes.com/sports/soccer/story/2026-07-12/how-var-became-2026-world-cups-biggest-villain) described more than 100 VAR interventions through the end of the Round of 16 and cited Iran's Shoja Khalilzadeh being ruled a toe offside on a goal that would have changed the knockout picture. [Peoples Gazette](https://gazettengr.com/2026-world-cup-goals-ruled-offside-by-var-in-first-round/) separately listed first-round goals overturned for offside after VAR review, including Algeria against Argentina, Spain against Saudi Arabia, Iran against Belgium, and Iran against Egypt.

## Sensor-assisted precision creates a human compliance problem

Players were trained for the assistant referee's eye for more than a century. They learned the rhythm of the line, the hesitation of the flag, and the practical margin between clever timing and visible cheating. Semi-automated offside reduces some of that visual uncertainty. A shoulder, knee, or boot that was once unseeable can now become the reason a goal disappears.

That changes coaching. Strikers and attacking midfielders will need to train against offside traps as measured states, not only as visual cues. Defensive lines will treat synchronization as a technology-facing tactic. Analysts will review body lean, acceleration timing, pass-release frames, and run-shape data with the same seriousness they already bring to expected goals or pressing triggers.

## The new skill is playing for the sensor

Football training already includes video analysis, GPS vests, biometric load tracking, and opponent models. VAR adds another lesson: how to play in ways that comply with machine-level measurement. A forward may need to delay a run by a fraction of a second. A passer may need to release earlier. A defender may learn that a perfectly coordinated step is now more valuable because the system can document it.

The law itself still contains human judgment. Interfering with play, obstructing an opponent, deliberate play, deflections, and legally relevant body parts are not solved by geometry alone. The human art does not disappear. It moves upstream into anticipation, timing, body control, and the ability to stay creative inside a higher-resolution enforcement environment.

## Sports will not stay purely human

The deeper shift is that sports are becoming human performances inside machine-readable environments. Goal-line technology already turned the goal mouth into a binary sensor problem. Semi-automated offside turns attacking movement into skeletal tracking. Experimental AI referee-support research is exploring foul recognition and sanction recommendations, but subjective contact remains far from production-grade autonomous refereeing.

That does not make athletes less human. It makes some rules enforceable at a resolution humans were not built to perceive. The practical question for every sport is no longer whether machines should enter the game. They are already there. The question is which forms of human judgment, ambiguity, and rhythm are worth protecting from measurement.

The next generation of elite footballers will not only learn the offside law. They will learn how a machine-readable pitch sees the law, then decide how much of their human game can survive inside it.
