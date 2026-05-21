---
compositeScore: 3.0
tier: Functional
dimensions:
  # 1. Signal Clarity
  - score: 3
    summary: Head movement and antenna animation communicate emotional state, but signal vocabulary is entirely developer-defined — no standardized cues exist out of the box.
  # 2. Spatial Legibility
  - score: 4
    summary: Constrained desktop form factor makes movement predictable. Head tracking and base rotation follow clear directional logic; the limited motion envelope works in its favor.
  # 3. Perceived Presence
  - score: 3
    summary: Charming, coherent physical design with readable expressiveness. Behavioral identity is blank-slate by design — persona depends entirely on what the developer loads.
  # 4. Failure Transparency
  - score: 2
    summary: Platform-level failures produce silence or stillness with no user-facing explanation. Error handling is developer-defined; none exists by default.
  # 5. Interaction Fit
  - score: 4
    summary: Precisely matched to its intended audience — developers and researchers working in Python, ROS2, and the Hugging Face ecosystem. Fails hard for non-technical users, by design.
  # 6. Recovery Design
  - score: 2
    summary: Recovery is SSH and terminal-only. The open-source stack empowers developer recovery but provides no path for non-technical users encountering failures.
---
