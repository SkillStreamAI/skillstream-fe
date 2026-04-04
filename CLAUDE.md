# SkillStream AI — Frontend

React dashboard for the SkillStream AI platform. Generates hierarchical audio learning roadmaps powered by AWS Bedrock, Polly, Step Functions, and DynamoDB. Deployed to AWS Amplify (auto-deploys on push to main).

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Runtime | React 19 |
| Deployment | AWS Amplify (Git-connected, SSR) |
| Backend | AWS Lambda Function URLs |

---

## Project Structure

```
app/                    # Next.js App Router pages
  layout.tsx            # Root layout — AuthProvider + Navbar + Footer
  page.tsx              # Landing page
  login/page.tsx        # Mock auth (sign-in / sign-up toggle)
  generator/page.tsx    # Topic input → Lambda → roadmap card grid
  roadmaps/page.tsx     # Lists all roadmaps from Content Lambda
  roadmap/[id]/page.tsx # Roadmap detail view
  player/page.tsx       # Podcast player — episodes from Content Lambda
  dashboard/page.tsx    # Auth-guarded user dashboard

components/
  ui/                   # Button, Input, Card
  layout/               # Navbar, Footer
  auth/                 # AuthForm
  roadmap/              # LevelBadge, RoadmapCard, RoadmapGrid, TopicInput
  player/               # AudioPlayer, EpisodeList
  analytics/            # GoogleAnalytics (SPA-aware GA4 page tracking)

lib/
  types.ts              # All shared TypeScript interfaces
  lambda.ts             # Typed fetch wrappers for all Lambda endpoints
  auth-context.tsx      # Mock auth (localStorage, any credentials work)
```

---

## Environment Variables

Set all variables in **Amplify Console → App → Environment variables**.

After adding or changing variables, trigger a new build — existing deployments are not updated automatically.

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_LAMBDA_CONTENT_URL` | GET → `ContentRoadmap[]` — all roadmaps + episodes |
| `NEXT_PUBLIC_LAMBDA_GENERATE_ROADMAP_URL` | POST `{topic}` → `{roadmapId, title, nodes[]}` |
| `NEXT_PUBLIC_LAMBDA_GET_EPISODES_URL` | GET → `{episodes[]}` |
| `NEXT_PUBLIC_LAMBDA_GET_PROGRESS_URL` | GET `?userId=x` → `{completedEpisodes[], savedRoadmaps[]}` |
| `NEXT_PUBLIC_LAMBDA_TRACK_PROGRESS_URL` | POST `{episodeId, completed}` → `{success}` |
| `NEXT_PUBLIC_LAMBDA_TRENDS_AGENT_URL` | POST → trending topic suggestions from Strands Agent |
| `NEXT_PUBLIC_SITE_URL` | Full production URL (e.g. `https://main.XXXXXXXX.amplifyapp.com`) — used for sitemap and OG meta |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 measurement ID (e.g. `G-XXXXXXXXXX`) — optional |

**Active Lambda:**
- `NEXT_PUBLIC_LAMBDA_CONTENT_URL` = `https://hscm4lingztfovu6e32xm5cale0oprpc.lambda-url.us-east-1.on.aws/`
  - CDK output key: `SkillstreamAiStack.ContentApiUrl`
  - Method: `GET`
  - Returns: array of roadmaps with nested episodes (see `ContentRoadmap` in `lib/types.ts`)

---

## Lambda Response Handling

`getContent()` in [lib/lambda.ts](lib/lambda.ts) handles two possible response shapes from Lambda Function URLs:

```
Shape 1 — Direct array (standard Function URL):
  [{id, topic, title, description, episodes[]}]

Shape 2 — Lambda envelope (if Lambda returns {statusCode, body}):
  {statusCode: 200, body: "[{...}]"}   ← body is a JSON string
```

Both shapes are detected and unwrapped automatically.

---

## Auth

Mock only — any email/password combination works. `User` object is persisted to `localStorage` under key `skillstream_user`. Replace with Amazon Cognito when ready.

- `lib/auth-context.tsx` — `AuthProvider`, `useAuth()` hook
- `loading` flag bridges SSR hydration gap (localStorage unavailable server-side)
- Dashboard (`/dashboard`) redirects to `/login` when unauthenticated

---

## Design System

Dark gradient theme. All CSS utilities are defined in [app/globals.css](app/globals.css) — **not** in a `tailwind.config.js` (Tailwind v4 has no config file).

| Class | Description |
|---|---|
| `.gradient-text` | Amber gradient background-clip text |
| `.gradient-border` | 1px border via `padding: 1px` wrapper |
| `.hero-gradient` | Dark radial amber glow for landing hero |
| `.glass` | Glassy navbar — `backdrop-blur` + dark bg |

Accent palette: `#e8a020` (amber) · `#f5c547` (amber-light)

---

## Tailwind v4 Gotchas

- No `tailwind.config.js` — custom tokens go in `@theme { }` inside `globals.css`
- Multi-step gradient borders cannot be a single utility — use `.gradient-border` wrapper
- Arbitrary values still work: `bg-[#e8a020]`, `text-[#9e9792]`, etc.

---

## Next.js 16 Gotchas

- Dynamic route `params` in async Server Components is `Promise<{id: string}>` — always `await params`
- `'use client'` components (like `AuthProvider`) can be children of Server Component layouts
- `useRouter`, `usePathname` require `'use client'`
- `pt-16` on `<main>` offsets the fixed 64px navbar

---

## CI / CD

**AWS Amplify** handles CI/CD natively — no GitHub Actions required.

- Connect your repo in **Amplify Console → New app → Host web app**
- Amplify auto-deploys on every push to `main` (production) and creates preview deployments for pull requests
- Build config is defined in `amplify.yml` at the repo root

**SPA rewrite rule** (set in Amplify Console → App settings → Rewrites and redirects):

| Source | Target | Type |
|---|---|---|
| `/<*>` | `/index.html` | `404-200` |

The type **must** be `404-200` — not 301 or 302.

---

## Dev Commands

```bash
npm run dev        # start dev server (reads .env.local)
npm run build      # production build
npx tsc --noEmit   # type check only
```

---

## CORS

Lambda Function URLs must return these headers to accept requests from Amplify and localhost:

```
Access-Control-Allow-Origin: https://main.XXXXXXXX.amplifyapp.com
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

The active Content Lambda already returns `Access-Control-Allow-Origin: *`.

Read ai-docs/seo-llmo-guide.md for SEO/LLMO practices.

Read ai-docs/aws-spa-deployment-guide.md for AWS SPA deployment.

Read ai-docs/google-analytics-guide.md for Google Analytics 4 implementation.

Read ai-docs/web-accessibility-guide.md for web accessibility (WCAG 2.2).

Read ai-docs/web-performance-guide.md for web performance and Core Web Vitals.

---

## Productization TODO

- Review every user-facing text on the site and replace technical explanations with concise product copy.
- Remove development-oriented details about tooling, architecture, and implementation from public pages.
- Clean up page titles, headers, buttons, and descriptions so the site feels polished and product-ready.
- Add or revise the site's accessibility statement to reflect inclusive design commitments.
- Ensure all messaging is smooth, customer-focused, and aligned with the product story.
- Verify the final copy is consistent across landing, roadmap, player, and dashboard pages.
