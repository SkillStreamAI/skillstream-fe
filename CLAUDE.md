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
| Animation | motion/react (Framer Motion) |
| State | Zustand (`lib/player-store.ts`) |
| Deployment | AWS Amplify (Git-connected, SSR) |
| Backend | AWS Lambda Function URLs |

---

## Project Structure

```
app/                          # Next.js App Router pages
  layout.tsx                  # Root layout — ThemeProvider + AccessibilityProvider + AuthProvider + Navbar + Footer + MiniPlayer + AccessibilityMenu
  page.tsx                    # Landing page (hero, how-it-works, features — all glass-panel)
  login/page.tsx              # Mock auth (sign-in / sign-up toggle)
  generator/page.tsx          # Topic input → Lambda → roadmap generation
  roadmaps/page.tsx           # Lists all roadmaps as GlassRoadmapPanel accordions
  roadmap/[id]/page.tsx       # Roadmap detail view (single GlassRoadmapPanel)
  player/page.tsx             # Episode list — all roadmaps
  player/[courseId]/page.tsx  # Course player — CoursePlayer + EpisodeList; supports ?autoplay=true
  agents/page.tsx             # AI Agents dashboard (Trend Discovery + Content Lifecycle)
  about/page.tsx              # About page
  privacy/page.tsx            # Privacy Policy
  terms/page.tsx              # Terms of Use
  api/audio/route.ts          # Server-side proxy — streams S3 audio (avoids CORS)
  api/trends/route.ts         # Server-side proxy — calls Trends Agent Lambda
  globals.css                 # All Tailwind v4 tokens + custom CSS utilities + theme vars + a11y overrides
  sitemap.ts                  # Dynamic sitemap

components/
  ui/                         # Button, Input (all use CSS vars — theme-aware)
  layout/                     # Navbar (glass, theme toggle), Footer (3-col with links)
  auth/                       # AuthForm (glass-panel)
  roadmap/                    # GlassRoadmapPanel, LevelBadge, TopicInput
  player/                     # CoursePlayer, EpisodeList, MiniPlayer, AudioPlayer
  accessibility/              # AccessibilityMenu (floating widget — font size, motion, contrast)
  agent/                      # TrendingSuggestions
  analytics/                  # GoogleAnalytics (SPA-aware GA4 page tracking)

lib/
  types.ts                    # All shared TypeScript interfaces
  lambda.ts                   # Typed fetch wrappers for all Lambda endpoints
  auth-context.tsx            # Mock auth (localStorage under 'skillstream_user')
  theme-context.tsx           # ThemeProvider + useTheme — 'light' | 'dark' | 'system'
  accessibility-context.tsx   # AccessibilityProvider + useA11y — font size, reduce motion, high contrast
  player-store.ts             # Zustand store — audio queue, playback state, controls
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

## Theme System

Three-way theme toggle: **Light / System / Dark**. System (OS preference) is the default.

- `lib/theme-context.tsx` — `ThemeProvider`, `useTheme()` — stores `'light' | 'dark' | 'system'` in `localStorage` under `skillstream_theme`
- Applied as `data-theme="light"` or `data-theme="dark"` on `<html>`
- CSS: dark theme in `:root`, light in `html[data-theme="light"]` and `@media (prefers-color-scheme: light) { html:not([data-theme="dark"]) }`
- **FOUC prevention**: inline `<script>` in `<head>` reads localStorage and sets `data-theme` before first paint
- Theme toggle lives in `Navbar` (always visible, desktop + mobile)

---

## Accessibility System

Floating `AccessibilityMenu` button (bottom-right corner, above MiniPlayer when audio is active).

- `lib/accessibility-context.tsx` — `AccessibilityProvider`, `useA11y()` — stores prefs in `localStorage` under `skillstream_a11y`
- State: `{ fontSize: 'normal' | 'large' | 'larger', reduceMotion: boolean, highContrast: boolean }`
- Applied as CSS classes on `<html>`: `a11y-large-text`, `a11y-larger-text`, `a11y-reduce-motion`, `a11y-high-contrast`
- **FOUC prevention**: inline `<script>` in `<head>` (via `A11Y_FOUC_SCRIPT` exported from context) applies classes before first paint
- Panel: `role="dialog"`, `aria-modal`, focus trap, Escape to close
- Existing a11y infrastructure: skip-to-main-content link, `aria-label` / `aria-pressed` / `aria-expanded` throughout, `:focus-visible` outline (`3px solid var(--amber)`), `@media (prefers-reduced-motion)` in CSS

---

## Locale / i18n System

Two-locale toggle: **English (EN)** and **Hebrew (HE)** with full RTL layout support for Hebrew.

- Library: `next-intl` (without i18n routing — no URL prefixes, routes stay as-is)
- Locale stored in `NEXT_LOCALE` cookie (read server-side by `i18n/request.ts`)
- `app/layout.tsx` reads the cookie via `getLocale()` and sets `lang` and `dir` on `<html>` server-side — no FOUC script needed
- `NextIntlClientProvider` in root layout passes messages to all client components
- Language switcher (`LanguageSwitcher` in Navbar) sets cookie + calls `router.refresh()`

### Key files

| File | Purpose |
|---|---|
| `i18n/routing.ts` | `locales`, `defaultLocale`, `RTL_LOCALES` |
| `i18n/request.ts` | next-intl server config — reads `NEXT_LOCALE` cookie, loads messages |
| `messages/en.json` | English master dictionary |
| `messages/he.json` | Hebrew translations (same keys) |

### Translation usage

**Server Component:**
```tsx
import { getTranslations } from 'next-intl/server';
const t = await getTranslations('roadmaps');
return <h1>{t('title')}</h1>;
```

**Client Component:**
```tsx
'use client';
import { useTranslations } from 'next-intl';
const t = useTranslations('roadmaps');
return <h1>{t('title')}</h1>;
```

**Interpolation:** `t('episodesCount', { n: 5 })` → `"5 episodes"` (ICU plural syntax in JSON)

### Message namespaces

`nav`, `theme`, `footer`, `landing`, `roadmaps`, `agents`, `player`, `auth`, `topicInput`, `trends`, `common`

### RTL CSS

`[dir="rtl"]` selectors in `app/globals.css`. The `navbar-links` class on the desktop nav links `<div>` triggers flex-direction reversal. Audio seek inputs use `.mini-player-progress` with `direction: ltr` to keep scrubbing left-to-right in Hebrew mode.

### Adding a new locale

1. Add the locale code to `locales` in `i18n/routing.ts` and `RTL_LOCALES` if needed
2. Create `messages/<locale>.json` with all keys from `messages/en.json`
3. Add a button to `LOCALE_OPTIONS` in `Navbar.tsx`

---

## Design System

Dark/light glass morphism theme. All CSS utilities in [app/globals.css](app/globals.css) — **no** `tailwind.config.js` (Tailwind v4).

### Key CSS classes

| Class | Description |
|---|---|
| `.glass-panel` | Apple glass effect — `backdrop-filter: blur(24px) saturate(160%)`, specular inset highlight, semi-transparent border |
| `.glass-row` | Episode row inside a glass panel — subtle top border + hover bg |
| `.glass` | Navbar — `backdrop-filter` + theme-aware bg |
| `.hero-gradient` | Radial amber glow background for page heroes |
| `.gradient-text` | Amber gradient background-clip text |
| `.a11y-large-text` | Font scale 112% (user preference) |
| `.a11y-larger-text` | Font scale 125% (user preference) |
| `.a11y-reduce-motion` | Disables all animations/transitions |
| `.a11y-high-contrast` | High-contrast colour overrides |

### CSS custom properties (key vars)

All colours are CSS variables — **never use hardcoded hex** for UI colours. Always use `var(--token)`.

| Token | Dark value | Light value |
|---|---|---|
| `--background` | `#0d0c0c` | `#e4e1dc` |
| `--surface` | `#161414` | `#f2efea` |
| `--surface-2` | `#1e1c1c` | `#d8d4ce` |
| `--border` | `#2c2828` | `#ccc8c0` |
| `--text-1` | `#f5f0eb` | `#1a1714` |
| `--text-2` | `#9e9792` | `#6b6460` |
| `--text-3` | `#7a7470` | `#a89f98` |
| `--amber` | `#e8a020` | `#b86e00` |

Body background: multi-stop fixed gradient blobs (purple/amber/indigo) in dark; softer in light — gives `backdrop-filter` something to blur through.

### Badge colours (solid, not translucent)

Use solid vivid colours with white/black text — **not** `bg-emerald-950/50 text-emerald-400` patterns (green-on-dark fails in light mode).

- Ready/live/running: `bg-emerald-500 text-white`
- Pending: `bg-amber-400 text-black`
- LevelBadge: `bg-teal-500`, `bg-blue-500`, `bg-purple-500`, `bg-rose-500` — all `text-white`

---

## Audio Player

Zustand store at `lib/player-store.ts` — `usePlayerStore()`.

- `MiniPlayer` — fixed bottom bar, always visible when a track is loaded
- `CoursePlayer` — full player card on `/player/[courseId]`; keyboard shortcuts (Space, ←→ seek, ↑↓ volume)
- Audio served via `/api/audio?url=...` server proxy (avoids S3 CORS issues)
- Autoplay: navigate to `/player/[courseId]?autoplay=true` to start playback immediately on load

---

## Tailwind v4 Gotchas

- No `tailwind.config.js` — custom tokens go in `@theme { }` inside `globals.css`
- Use CSS variable arbitrary values: `text-[var(--text-1)]`, `bg-[var(--surface)]` — not hardcoded hex
- `group-hover:line-clamp-none` works for expand-on-hover text
- `backdrop-filter` only renders visibly when the element has a colourful background behind it

---

## Next.js 16 Gotchas

- Dynamic route `params` is `Promise<{id: string}>` — use `use(params)` in client components, `await params` in server components
- `'use client'` components can be children of Server Component layouts
- `useRouter`, `usePathname`, `useSearchParams` require `'use client'`
- `pt-16` on `<main>` offsets the fixed 64px navbar; `pb-20` reserves space for MiniPlayer

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
