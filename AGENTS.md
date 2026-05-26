# Agent Instructions For Shop Council

This repo is the single source of truth for the Wayfair hackathon project.

Primary starter: `subconscious-systems/hack-webapp-starter`.

Do not switch the app to Cloudflare Workers, CLI, iOS, browser extensions, or a distributed multi-agent framework unless the human explicitly asks.

## Product Goal

Build "Shop Council": a Wayfair furniture-shopping boardroom where simulated AI agents debate product choices and produce a final recommendation.

The hackathon deliverable is a polished 60-second video demo. Optimize for reliability, speed, and showmanship.

## Exact Council Roles

- Style Director / Mara: taste, room fit, visual coherence, View in Room confidence.
- Luxe Curator / Vivian: high-end advocate, premium feel, aspirational home outcome.
- Budget Hawk / Dex: low-end/value advocate, price discipline, hidden costs.
- Logistics Lead / Priya: dimensions, delivery, assembly, returns, doorway fit.
- Review & Trust Analyst / Noor: reviews, badges, customer photos, scam check, buyer regret.

Do not remove these five roles without human approval. The product story depends on high-end vs low-end, style, logistics/fit, and trust/scam confidence.

## Build Rules

- Use the existing Next.js app.
- Keep the backend in this repo.
- Use one orchestrator LLM call to simulate the council.
- Return strict structured JSON.
- Always include deterministic fallback JSON.
- Use curated product/scenario data before live URL ingestion.
- Use browser-native `speechSynthesis` if voice is added.
- Do not add ElevenLabs unless the MVP is complete.
- Do not add auth, database, cart, checkout, extension, or complex scraping.

## APIs

No key is required for the MVP. The app must work with curated fallback data.

Optional keys: `SUBCONSCIOUS_API_KEY`, `OPENAI_API_KEY` plus `OPENAI_MODEL`, `ELEVENLABS_API_KEY`, Cloudflare account/token, Baseten direct key or gateway URL, official Wayfair product API key. Do not add optional integrations until fallback and core UI are working.

## Target File Structure

```text
app/api/council/route.ts
app/page.tsx
components/council-app.tsx
components/council-board.tsx
components/scenario-picker.tsx
components/verdict-panel.tsx
lib/council/scenarios.ts
lib/council/schema.ts
lib/council/prompt.ts
lib/council/fallback.ts
lib/subconscious.ts
```

## First Implementation Pass

1. Create curated scenarios in `lib/council/scenarios.ts`.
2. Create Zod schemas and TypeScript types in `lib/council/schema.ts`.
3. Create a deterministic fallback response in `lib/council/fallback.ts`.
4. Create `POST /api/council` that accepts `{ scenarioId?: string, url?: string }`.
5. First return fallback JSON. Then add the Subconscious call.
6. Replace the starter chat UI with a council UI.
7. Add animation and final verdict.

## Council Agents

Use these five agents:

- Style Director: room fit, aesthetic coherence, taste, View in Room.
- Luxe Curator: premium option, high-end feel, better materials.
- Budget Hawk: low-end/value option, price, hidden costs.
- Logistics Lead: dimensions, delivery, assembly, returns, actual fit.
- Review & Trust Analyst: durability, reviews, badges, scam check, buyer regret.

They should disagree, interrupt lightly, and converge on a recommendation.

## Cut List

Cut these immediately if time is tight:

- Live Wayfair scraping.
- Cloudflare browser tooling.
- ElevenLabs.
- MCP.
- Any second backend.
- Any production database.

## Definition Of Done

The app is good enough when:

- `pnpm dev` starts successfully.
- User can choose a preset scenario.
- Council debate renders without relying on a live scrape.
- Final verdict is clear and useful.
- If Subconscious fails, fallback output still renders.
- The team can record a convincing 60-second demo.

## Parallel Ownership

This computer owns framework/backend:

- `app/api/council/route.ts`
- `lib/council/*`
- `components/council-app.tsx`
- `README.md`
- `AGENTS.md`

Teammate agent should focus on UI polish/stretch:

- `components/council-board.tsx`
- `components/verdict-panel.tsx`
- `components/scenario-picker.tsx`
- `app/globals.css`
- optional `lib/council/url-ingest.ts`

Avoid changing `lib/council/schema.ts` or API response shape from the teammate branch unless coordinating first.
