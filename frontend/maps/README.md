# NYC Metro Robotics Map

`/metronyc-robotics-map` is a native Next.js page using the shared `Nav`,
`PageHero`, `Footer`, and `MediaImage` components and the site color tokens.
The main `/robotics-map` page links here. `/robotics-map/nyc-metro` redirects here.

## Source files

- Page: `src/app/(english)/metronyc-robotics-map/page.tsx`
- Interactive UI: `src/components/MetroRoboticsMap/`
- Researched entries and categories: `src/data/metro-robotics.json`
- Geographic features and source attribution: `src/data/metro-geometry.json`
- Filtering rules: `src/lib/metro-robotics.ts`
- 50×50 PNG logos, downloaded originals, and provenance: `public/logos/`

The directory has 48 entries across NYC, Nassau/Suffolk counties, Connecticut,
and New Jersey, with 18 primary categories. The Festo Didactic facility is an
additional location, not a separate parent company. Research date: November 16,
2026. All entries retain address sources and evidence labels. Coordinates are
approximate street positions, not surveyed building locations.

Category, location, and company search combine with AND. Exact region aliases
include NYC, LI, NJ, and CT. An exact Long Island filter covers Nassau/Suffolk;
Long Island City stays in NYC. Filters and the selected company persist locally.
The SVG map supports pan, zoom, nearby-location clusters, and keyboard marker
selection; the directory provides another way to select every entry.

The Robot Age is Education, Human Friendly Robotics is Construction, and Tuesday
Labs is Humanoid robots. The Robot Age's marker is intentionally an approximate
point in Elmhurst, Queens. Office/facility, contact/reported-address, and
approximate-area markers remain distinct.

## Logos

`public/logos/sources.json` records each downloaded brand asset, its source, and
the final 50×50 PNG. Most assets are official company website marks or icons.
Festo is sourced from Wikimedia Commons (originally a Festo brochure), and
Skyline Robotics from its public company-directory profile. Logos retain their
own brand colors while the map interface uses The Robot Age palette.

Regenerate the PNGs from the preserved originals:

```text
node scripts/prepare-metro-logos.mjs
node scripts/publish-images.mjs --publish
```

Run these from `frontend`. The preparation script uses Sharp (provided by Next)
and produces a review contact sheet under `output/metro-logo-research/`.
ICO originals have accompanying PNG conversions for Sharp. The image publisher
verifies all public R2 objects before updating `src/lib/image-assets.json`.
Commit the local assets, provenance, URL manifest, and consuming code together.

The original standalone export remains at `public/maps/nyc-metro.html`, with its
source fragment at `maps/nyc-metro.fragment.html`, for archival reference.
It no longer serves the native page route. Edit the native data/UI for updates.

Validate the native route's combined/empty filters, Long Island distinction,
shared locations, source links, local-state restoration, keyboard use, mobile
layout, logos, and production build before publishing updates.
