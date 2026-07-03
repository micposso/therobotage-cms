# Robot quiz photos

Drop the "What Robot Are You?" quiz photos in this folder. Each file is served at
`/robots/<slug>.jpg` and is picked up automatically by the quiz result card, the
gallery thumbnails, and the LinkedIn OpenGraph image — no code change needed.

Use these exact filenames (JPG):

- `unitree-g1.jpg`
- `optimus.jpg`
- `figure-03.jpg`
- `atlas.jpg`
- `unitree-go2.jpg`
- `reachy-mini.jpg`
- `neo.jpg`
- `digit.jpg`
- `stretch.jpg`

Notes:
- Roughly square images work best (the gallery thumbnail crops to a circle and the
  card/OG image crops to a tile — both use center-cover).
- Until a file exists, that robot shows a branded monogram / "photo coming soon"
  placeholder, so partial sets are fine.
- The filename must match the robot's `slug` in `src/lib/quizRobots.ts`. If you have
  PNGs instead of JPGs, either convert them or change that robot's `photo` field.
