# Shop Council - AI Shopping Assistants

<div align="center">

**A live AI shopping council that turns furniture uncertainty into a guided, playful buying debate**

[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![ElevenLabs](https://img.shields.io/badge/ElevenLabs-Voice-purple.svg)](https://elevenlabs.io/)

</div>

---

## Overview

Buying furniture online is stressful. Shoppers are  asking a multitude of questions, including

- Will this fit my room?
- Is this listing real or sketchy?
- Can I trust the reviews?
- Will delivery work?
- How annoying is assembly?
- Is the cheaper option actually a trap?

**Shop Council** solves this by turning a vendor-specific product decision into a live AI boardroom debate.

Instead of giving a flat recommendation, five AI agents argue through the tradeoffs in real time. The shopper can interrupt, challenge the council, ask about fit or trust, and hear the agents respond.

The product is designed for retailers and marketplaces where shoppers need more than search results. It can be configured for a specific vendor, such as a furniture retailer or a broad marketplace, and uses that vendor's product details to explain dimensions, room-fit confidence, delivery windows, assembly details, reviews, customer photos, and product-specific buying context.

---

## Key Features

- **Live AI council debate** with five distinct shopping agents
- **Interactive shopper interruptions** during the debate
- **Vendor-aware product reasoning** around fit, delivery, assembly, reviews, and photos
- **Curated blue sofa demo JSON** for reliable hackathon demos
- **Product URL input** for demo realism without depending on scraping
- **ElevenLabs agent voices** mapped per personality
- **Brandable purple/white UI**
- **Compact internal chat thread** so the user does not have to scroll the full page
- **Fallback-first architecture** so the demo still works without live scraping

---

## Agent Council

The council is intentionally playful and opinionated.

- **Mara - Style Director**
  Leads with taste, visual fit, and whether the room feels elevated.

- **Vivienne - Luxury Advocate**
  Pushes for the premium option and the aspirational look.

- **Benji - Budget Realist**
  Defends the lower-cost option and calls out fake savings.

- **Logan - Fit & Delivery Lead**
  Owns measurements, doors, stairs, delivery, and assembly friction.

- **Riley - Review & Trust Analyst**
  Handles "is this real?", customer photos, review signals, and buyer regret.

The agents are prompted to explain why a vendor-specific shopping flow can work better than generic product search: the experience can surface the signals shoppers actually need before buying.

---

## Tech Stack

### Web App

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- App Router API routes

### AI + Orchestration

- Vercel AI SDK structured object generation
- Anthropic Claude support
- Subconscious API support
- OpenAI support
- Zod schemas for strict council JSON
- Deterministic fallback council for reliable demos

### Voice

- ElevenLabs Text-to-Speech
- Five mapped agent voices
- Browser audio element playback
- Voice-aware debate timing so agents do not cut each other off

---

## Setup

### Prerequisites

- Node.js 20+
- npm or pnpm
- Optional: Anthropic API key for live AI chime responses
- Optional: ElevenLabs API key for agent voices

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/HarryJ12/Wayfair_Hack.git
cd Wayfair_Hack
```

2. **Install dependencies**
```bash
npm install
```

3. **Create local environment file**
```bash
cp .env.example .env.local
```

4. **Add optional API keys**
```bash
# Optional live LLM brain
ANTHROPIC_API_KEY=<your_anthropic_key>
ANTHROPIC_MODEL=claude-sonnet-4-5-20250929
COUNCIL_MODEL_PROVIDER=anthropic

# Required for ElevenLabs voices
ELEVENLABS_API_KEY=<your_elevenlabs_key>
```

5. **Run locally**
```bash
npm run dev -- -p 3002
```

6. **Open the app**
```text
http://localhost:3002
```

---

## Environment Variables

```bash
# Optional live model providers
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-sonnet-4-5-20250929
OPENAI_API_KEY=
OPENAI_MODEL=
SUBCONSCIOUS_API_KEY=
COUNCIL_MODEL_PROVIDER=

# Voice
ELEVENLABS_API_KEY=
```

The app works without live scraping because the main demo uses curated vendor-style product JSON.

ElevenLabs voices require `ELEVENLABS_API_KEY`.

---

## Voice Mapping

```text
Mara      → kPzsL2i3teMYv0FxEYQ6
Vivienne  → yj30vwTGJxSHezdAGsv9
Benji     → alFofuDn3cOwyoz1i44T
Logan     → yl2ZDV1MzN4HbQJbMihG
Riley     → uIZsnBL0YK1S5j69bAih
```

Voice playback waits for the current ElevenLabs audio to finish before advancing to the next agent. When voice is off, the debate advances on a timer.

---

## Project Structure

```text
Wayfair_Hack/
├── app/
│   ├── api/
│   │   ├── council/          (initial council generation)
│   │   ├── council/chime/    (shopper interruption responses)
│   │   └── voice/            (ElevenLabs TTS proxy)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── council-app.tsx       (main app state + controls)
│   ├── council-board.tsx     (sofas, agents, chat, interrupt UI)
│   ├── scenario-picker.tsx   (legacy scenario picker)
│   └── verdict-panel.tsx     (legacy verdict panel)
├── lib/
│   └── council/
│       ├── fallback.ts       (deterministic demo council)
│       ├── model.ts          (LLM provider selection)
│       ├── normalize.ts      (schema-safe response cleanup)
│       ├── prompt.ts         (agent council prompts)
│       ├── scenarios.ts      (curated product JSON)
│       ├── schema.ts         (Zod schemas + TS types)
│       ├── url-ingest.ts     (demo URL mapping)
│       └── voices.ts         (agent voice IDs)
└── docs/
    └── DEMO_SCRIPT.md
```

---

## Data Flow

### Run Council

```text
User pastes product URL + edits goal/constraints
    ↓
Run Council
    ↓
POST /api/council
    ↓
Curated vendor product JSON
    ↓
CouncilResponse schema
    ↓
Animated council UI
```

### Shopper Interrupts

```text
Shopper types interruption
    ↓
Message appears immediately as "You"
    ↓
POST /api/council/chime
    ↓
LLM or fallback generates short agent replies
    ↓
Agents continue from shopper context
```

### Voice Playback

```text
Voice on
    ↓
Current agent turn
    ↓
POST /api/voice
    ↓
ElevenLabs MP3
    ↓
Browser audio player
    ↓
Next agent only starts after audio ends
```

---

## Demo Flow

1. Paste or keep the demo product URL.
2. Keep the shopper goal focused on fit, trust, delivery, and value.
3. Click **Voice on** if ElevenLabs is configured.
4. Click **Run Council**.
5. Let Mara open the debate.
6. Interrupt with a prompt like:
```text
I have a narrow staircase. Is this going to fit or am I cooked?
```
7. Show the council pivoting to the shopper's concern.

---

## Why Vendor-Specific Shopping

Shop Council is built around a simple insight:

Furniture shopping is not just search. It is confidence-building.

A vendor-specific experience can expose furniture-specific signals that generic search often buries or flattens:

- dimensions
- room fit
- delivery windows
- assembly details
- reviews
- customer photos
- product context

Shop Council makes those signals conversational, memorable, and easier to act on. The same pattern can be configured for a retailer, a marketplace, or a category-specific shopping experience.

---

## License

Copyright © 2026 Shop Council. All rights reserved.

---

<div align="center">

**Built during a Boston Tech Week agent hackathon**

</div>
