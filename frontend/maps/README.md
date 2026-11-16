# NYC and metro robotics map

`/metronyc-robotics-map` serves the exported map from `public/maps/nyc-metro.html`
through a Next.js rewrite. The main `/robotics-map` page links to this regional view.
The previous `/robotics-map/nyc-metro` URL redirects to the new page.

The map has 48 entries across NYC, Nassau/Suffolk counties, Connecticut, and New
Jersey. All 18 primary categories and address/coordinate evidence are embedded in
`nyc-metro.fragment.html`. No live geocoder or backend is required. D3 7.9.0 loads
from jsDelivr; geographic data is embedded. No website image assets were added.

Category and location searches combine with AND. Location search supports region,
borough, city, county, and ZIP text plus NYC, LI, NJ, and CT aliases. An exact
Long Island search covers Nassau/Suffolk; Long Island City remains in NYC.

The Robot Age is Education, Human Friendly Robotics is Construction, and Tuesday
Labs is Humanoid robots, as specified by the user. The Robot Age's marker is an
approximate point in Elmhurst, Queens. Office/facility, contact/reported-address,
and approximate-area markers remain distinct. Research date: November 16, 2026.

Edit the fragment and regenerate the standalone document with the Visualize
skill's export helper; commit both files together:

```text
python -X utf8 <visualize-skill>/scripts/render.py maps/nyc-metro.fragment.html public/maps/nyc-metro.html --force --title "NYC & Metro Robotics Map — The Robot Age"
```

Only `window.openai.widgetState` and `setWidgetState` are used in the fragment;
the standalone wrapper stores filters and selection in browser-local storage.
Validate the served export, including combined/empty filters, shared locations,
source links, state restoration, and mobile layout, before publishing updates.
