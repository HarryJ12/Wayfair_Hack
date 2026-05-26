# Shop Council

Shop Council is a two-hour hackathon app for the Beat The Clock Agent Hack at Wayfair HQ.

The demo: a user selects a curated furniture-shopping scenario or pastes a Wayfair URL, then an AI "boardroom" of shopping agents debates the choice and produces a final recommendation. The council should guide shoppers through the questions that make online furniture buying scary: is this real, is this a scam, will it fit my room, will delivery work, and will assembly be painful?

The main product angle is that Wayfair is better for this decision because product pages expose practical confidence signals: dimensions, room visualization, delivery windows, assembly details, reviews, customer photos, and trust badges when available.

## Current Repo Status

This repo has already been scaffolded from `hack-webapp-starter`.

Already created:
- `app/api/council/route.ts` - fallback-first council API with optional Subconscious orchestration.
- `components/council-app.tsx` - main Shop Council screen.
- `components/scenario-picker.tsx` - preset scenario selector.
- `components/council-board.tsx` - product cards, agent cards, animated debate transcript.
- `components/verdict-panel.tsx` - final recommendation.
- `lib/council/scenarios.ts` - three curated Wayfair-style scenarios.
- `lib/council/schema.ts` - Zod schema and TypeScript response contract.
- `lib/council/prompt.ts` - orchestrator prompt.
- `lib/council/fallback.ts` - deterministic fallback debate.
- `.env.example` - required environment shape.

The app should run even without an API key because `/api/council` returns fallback JSON when no live model key is configured.

Latest backend behavior:
- Claude is the preferred live LLM brain when `ANTHROPIC_API_KEY` is set.
- Subconscious still works when `SUBCONSCIOUS_API_KEY` is set.
- OpenAI works only when both `OPENAI_API_KEY` and `OPENAI_MODEL` are set.
- `COUNCIL_MODEL_PROVIDER` can force `anthropic`, `subconscious`, or `openai`.
- If a pasted URL contains words like `sofa`, `desk`, `office`, `dining`, or `table`, the API maps it to the closest curated scenario.
- If URL mapping or live LLM fails, fallback mode still returns a complete debate.

## Exact Starter Repo Decision

Use `subconscious-systems/hack-webapp-starter` as the primary repo.

Why:
- It already gives us a Next.js app, a working UI, an API route, Subconscious API wiring, streaming responses, Tailwind, TypeScript, and deployable web structure.
- It lets one person work on UI while another works on orchestration/backend in the same repo.
- It minimizes setup friction. For this demo, the web experience is the product.

Do not use `hack-cloudflare-workers-starter` as the primary repo. Use it only as a reference or stretch integration.

Do not use `hack-cli-starter` for the product. Use it only to understand the ReAct/tool loop pattern if needed.

Skip iOS entirely unless someone gives a finished iOS starter and the team already has an iOS demo path. For this concept, iOS is a distraction.

## Repo Scout Summary

### `hack-webapp-starter`

Already included:
- Next.js app router
- React 19
- Tailwind CSS
- `/api/chat` route
- Subconscious model provider in `lib/subconscious.ts`
- Agent definitions in `lib/agents/index.ts`
- Tool examples in `lib/tools/index.ts`
- Chat UI in `components/chat-app.tsx`
- Image upload support
- AI SDK `ToolLoopAgent`
- Subconscious skill docs under `.agents/skills/subconscious-dev`

Use this as the base.

### `hack-cloudflare-workers-starter`

Already included:
- Cloudflare Worker
- Hono API routes
- Static dashboard
- KV storage for config/run history
- Cron/webhook/API triggers
- Client-side ReAct loop
- Mock `search_catalog`
- Basic `fetch_url`

Important correction: this repo does not include turnkey browser driving or scraping. It has normal fetch tooling and Cloudflare Worker plumbing. If the event gives Browser Rendering docs or bindings, treat that as a stretch add-on.

Use only if we finish the core app early.

### `hack-cli-starter`

Already included:
- Terminal REPL
- MCP client
- Filesystem/weather tool examples
- Structured JSON loop
- Nice reference architecture for tool calling

Do not build the demo here. It will not look good enough for a 60-second video.

## Backend Only?

No. We should not build backend-only.

The debate is the product, so we need a visual web surface. But we should not spend the first hour inventing frontend plumbing. The starter already gives us the shell. Our actual work is:

1. Replace generic chat with a Shop Council demo flow.
2. Add one backend route that returns structured council JSON.
3. Add curated product/scenario data.
4. Animate/render the council debate.
5. Add browser-native speech if time allows.

Backend is the core logic. Frontend is the showmanship layer. Both must exist, but the frontend should be lightweight and built on the starter.

## Fastest Architecture

Use one Next.js app.

```text
User selects preset or pastes URL
        |
        v
Next.js UI
        |
        v
POST /api/council
        |
        v
Single orchestrator LLM call through Subconscious
        |
        v
Strict JSON:
  scenario
  products
  agents[]
  debateTurns[]
  verdict
  confidence
        |
        v
Animated council UI + final recommendation
```

No real distributed agents. The "agents" are simulated by one orchestrator call that writes the full debate script.

## Minimum Viable Product That Can Still Win

The absolute minimum:
- Three curated Wayfair-style scenarios.
- One "Run Council" button.
- Optional live model call that returns structured JSON.
- Five agents with distinct personalities:
  - Style Director: room fit, taste, View in Room confidence.
  - Luxe Curator: high-end/premium advocate.
  - Budget Hawk: low-end/value advocate.
  - Logistics Lead: dimensions, delivery, assembly, doorway fit.
  - Review & Trust Analyst: reviews, badges, scam check, buyer regret.
- Animated debate transcript with speaker cards.
- Final verdict with winner, reasons, objections, and "buy / consider / skip".
- Browser-native speech for 1 or 2 lines if time remains.

This is enough for a compelling 60-second video.

## Mock vs Live Data

Use mock data first.

Mock:
- Product title
- Price
- Dimensions
- Material
- Delivery estimate
- Review summary
- Pros/cons
- Scenario constraints

Live URL ingestion is a stretch only after the demo works. If we add it, use a fallback:
- Try URL parse/fetch.
- If it fails, map to a curated scenario.
- Never let live scraping block the demo.

## Sponsor Tooling Worth Using

Use:
- Subconscious API for the orchestrator LLM call.
- The included Subconscious skill/docs already copied into this repo.
- Baseten only indirectly if Subconscious routes through sponsor-hosted inference, unless the event hands us a ready endpoint.
- Cloudflare only as a stretch for URL fetch/browser tooling if the core app is done.

Skip:
- Browser extension.
- Distributed multi-agent framework.
- MCP unless a tool is already ready.
- ElevenLabs.
- Raw Playwright setup.
- Complex scraping pipeline.
- Custom database.
- Auth.
- Payments/cart integration.

## Exact APIs Needed

Required:
- None. The MVP works with curated fallback data.

Optional, only if sponsors provide them or the MVP is already working:
- `SUBCONSCIOUS_API_KEY` - optional sponsor-stack live model.
- `ANTHROPIC_API_KEY` and optional `ANTHROPIC_MODEL` - recommended live LLM brain if we use Claude.
- `OPENAI_API_KEY` and `OPENAI_MODEL` - optional live model fallback if we do not get Subconscious access.
- `CLOUDFLARE_API_TOKEN` - only for Cloudflare deploy/browser tooling stretch.
- `CLOUDFLARE_ACCOUNT_ID` - only for Cloudflare deploy/browser tooling stretch.
- `BASETEN_API_KEY` or a Baseten Gateway endpoint/key - only if direct Baseten access is provided separately from Subconscious.
- Official Wayfair product/catalog API endpoint and key - only if Wayfair provides one during the event.
- `ELEVENLABS_API_KEY` - not recommended for MVP; browser speech is already included.

Not needed for the current plan:
- Claude key.
- OpenAI key.
- Database credentials.
- Auth provider credentials.

## Browser Speech vs ElevenLabs

Use browser-native speech.

Reason:
- Zero API setup.
- Works locally.
- Good enough for a video.
- ElevenLabs adds key setup, latency, and failure risk.

Implementation target:
- Use `window.speechSynthesis`.
- Speak only the current highlighted debate turn or the final verdict.
- Add a mute toggle.

## Intended App Structure

Keep this simple:

```text
app/
  api/
    council/
      route.ts          # POST endpoint for council orchestration
  page.tsx              # renders Shop Council app

components/
  council-app.tsx       # main demo UI
  council-board.tsx     # agent cards + debate animation
  scenario-picker.tsx   # preset scenarios
  verdict-panel.tsx     # final recommendation

lib/
  council/
    scenarios.ts        # curated product/scenario JSON
    schema.ts           # zod schema for council output
    prompt.ts           # orchestrator prompt
    fallback.ts         # deterministic fallback debate if API fails
  subconscious.ts       # existing provider
```

Keep the existing starter files until replaced. Do not add a second app.

## Exact Council Roles

These are the locked v2 roles after PM feedback:

1. Style Director
   - Name in fallback: Mara.
   - Optimizes for aesthetics, taste, room fit, visual coherence, and Wayfair's View in Room / room visualization value.

2. Luxe Curator
   - Name in fallback: Vivian.
   - Argues for the high-end option, premium feel, better materials, and the aspirational home outcome.

3. Budget Hawk
   - Name in fallback: Dex.
   - Argues for the low-end/value option, price discipline, hidden costs, discount logic, and whether the recommendation is financially sane.

4. Logistics Lead
   - Name in fallback: Priya.
   - Owns dimensions, delivery, assembly, returns, doorways, stairs, clearance, and whether the product will actually fit.

5. Review & Trust Analyst
   - Name in fallback: Noor.
   - Owns reviews, customer photos, badges, listing confidence, "is this real?", "is this a scam?", and buyer regret.

Do not remove:
- Style Director
- Budget Hawk
- Luxe Curator
- Logistics Lead
- Review & Trust Analyst

This set maps cleanly to the demo story: high-end vs low-end, style confidence, fit/logistics confidence, and trust/scam confidence.

## Council JSON Contract

The backend should return this shape:

```ts
type CouncilResponse = {
  scenario: {
    id: string;
    title: string;
    shopperGoal: string;
    constraints: string[];
  };
  products: Array<{
    id: string;
    name: string;
    price: number;
    dimensions: string;
    material: string;
    delivery: string;
    reviewSummary: string;
  }>;
  agents: Array<{
    id: string;
    name: string;
    role: string;
    stance: "support" | "oppose" | "mixed";
    color: string;
  }>;
  debateTurns: Array<{
    agentId: string;
    text: string;
    targetProductId?: string;
    emotion: "confident" | "skeptical" | "excited" | "concerned";
  }>;
  verdict: {
    winnerProductId: string;
    decision: "buy" | "consider" | "skip";
    headline: string;
    reasons: string[];
    caveats: string[];
    confidence: number;
  };
};
```

If the Subconscious call fails, return a curated fallback response with the same shape. The UI should never be blank.

## Parallel Work Split

Use `main` as the shared base branch after this scaffold is pushed.

### Person A / This Computer

Owns the framework and backend contract.

Files:
- `app/api/council/route.ts`
- `lib/council/scenarios.ts`
- `lib/council/schema.ts`
- `lib/council/prompt.ts`
- `lib/council/fallback.ts`
- `components/council-app.tsx`
- `README.md`
- `AGENTS.md`

Tasks:
- Keep the app runnable.
- Ensure fallback JSON always works.
- Wire an optional model key only if one is available.
- Tighten prompt and schema.
- Add or edit curated scenarios.
- Keep API response shape stable.

### Person B / Teammate Agent

Owns demo polish and optional stretch work. Start from the pushed scaffold.

Recommended branch:

```bash
git checkout -b ui-polish-and-stretch
```

Primary files to edit:
- `components/council-board.tsx`
- `components/verdict-panel.tsx`
- `components/scenario-picker.tsx`
- `app/globals.css`

Tasks:
- Improve the boardroom visual presentation.
- Improve animation timing and speaker highlighting.
- Improve mobile layout.
- Add better product imagery if available.
- Add one memorable debate moment per scenario.
- Improve browser-native speech pacing.
- Help write and rehearse the 60-second video script.

Stretch files, only after the demo works:
- `lib/council/url-ingest.ts`
- `app/api/council/route.ts`

Stretch tasks:
- Add safe URL ingestion.
- Map a pasted Wayfair URL to a curated fallback scenario if extraction fails.
- Explore Cloudflare browser tooling only if sponsor docs/API access are available.

### Merge Rule

Person B should avoid changing:
- `lib/council/schema.ts`
- `app/api/council/route.ts`

unless explicitly coordinating first. That keeps merge conflicts small.

## Two-Hour Build Order

Demo script:
- Use [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md) for the 60-second recording flow.

### Before the event

1. Get `SUBCONSCIOUS_API_KEY`.
2. Confirm Node 20+ and `pnpm`.
3. Run the starter locally.
4. Prepare 3 curated scenarios and product JSON.
5. Draft the 60-second demo script.
6. Decide who owns UI and who owns backend.

### During the event

0-10 min:
- Pull repo.
- `pnpm install`.
- Create `.env.local`.
- Run `pnpm dev`.

10-25 min:
- Create `lib/council/scenarios.ts`.
- Create `lib/council/schema.ts`.
- Create `lib/council/fallback.ts`.

25-45 min:
- Create `POST /api/council`.
- Make it return fallback JSON first.
- Then wire Subconscious call if key works.

45-75 min:
- Replace generic chat screen with `CouncilApp`.
- Add scenario picker.
- Render agent cards and debate turns.
- Render verdict.

75-95 min:
- Add animation timing.
- Add browser-native speech toggle.
- Add loading and error fallback states.

95-110 min:
- Polish visual density.
- Practice recording path.
- Lock one curated scenario for the final video.

110-120 min:
- Record 60-second demo.
- Do not add new features.

## If We Only Have 90 Productive Minutes

Build first:
1. Preset scenario picker.
2. Fallback council JSON.
3. Animated council UI.
4. Final verdict panel.
5. Subconscious orchestrator call.

Do not touch:
- Live Wayfair URL scraping.
- Cloudflare browser tooling.
- ElevenLabs.
- MCP.
- Deploy complexity.

## Biggest Risks

- Subconscious key or model latency blocks the demo.
- Structured output breaks.
- UI takes longer than expected.
- Live scraping fails on Wayfair pages.
- Team spends too long making the architecture "real".

Mitigations:
- Fallback JSON always works.
- One route, one call, one schema.
- Curated scenarios first.
- Local demo is acceptable for the video.
- Cut speech before cutting verdict clarity.

## Highest ROI Polish

- Agent names and distinct stances.
- Speaker highlight animation.
- Final verdict that feels decisive.
- One funny but useful interruption.
- Price/dimensions callouts.
- Confidence meter.
- Browser speech for the final verdict.

## Setup

```bash
pnpm install
cp .env.example .env.local
# optional: edit .env.local and set a live model key
pnpm dev
```

Open `http://localhost:3000`.

## Environment

```bash
# No key required for MVP.

# Optional live model:
SUBCONSCIOUS_API_KEY=...
ANTHROPIC_API_KEY=...
ANTHROPIC_MODEL=claude-sonnet-4-5-20250929
OPENAI_API_KEY=...
OPENAI_MODEL=...
COUNCIL_MODEL_PROVIDER=anthropic

# Optional voice stretch:
ELEVENLABS_API_KEY=...
```

## Optional Subconscious Skill

The repo already includes the copied Subconscious skill docs from the starter. If another local agent needs the skill installed globally, run:

```bash
npx skills add https://github.com/subconscious-systems/skills --skill subconscious-dev
```

## Final Principle

Make the council feel alive first. Make live scraping real only if the council already works.
