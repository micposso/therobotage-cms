# THEROBOTAGE — Setup

## Project Structure

```
THEROBOTAGE/
├── package.json          ← root scripts to run both together
├── frontend/             ← Next.js (App Router, TypeScript, Tailwind)
│   ├── src/lib/strapi.ts ← typed Strapi API client (strapiGet / strapiPost)
│   ├── src/app/page.tsx  ← starter home page
│   └── .env.local        ← NEXT_PUBLIC_STRAPI_URL + STRAPI_API_TOKEN
└── backend/              ← Strapi v5 (SQLite by default)
```

## Running the project

```bash
npm run dev        # runs both frontend and backend in parallel
# or individually:
npm run dev:cms    # Strapi on http://localhost:1337
npm run dev:web    # Next.js on http://localhost:3000
```

## First-time setup

1. Run `npm run dev:cms` and visit `http://localhost:1337/admin` to create your admin account.
2. Build content types in the Strapi admin (Content-Type Builder).
3. Generate an API token in **Settings → API Tokens**, then paste it into `frontend/.env.local`:
   ```
   STRAPI_API_TOKEN=your_token_here
   ```
4. Use `strapiGet<T>("/your-collection")` in your Next.js pages to fetch content.

## Fetching content in Next.js

```ts
import { strapiGet } from "@/lib/strapi";

const data = await strapiGet<{ data: MyType[] }>("/articles");
```

Both `strapiGet` and `strapiPost` are available from `@/lib/strapi`.
