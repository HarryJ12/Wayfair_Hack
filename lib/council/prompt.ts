import type { CouncilScenario } from "./scenarios";
import type { CouncilResponse } from "./schema";

export function buildCouncilPrompt(
  scenario: CouncilScenario,
  url?: string,
  urlNote?: string,
) {
  return `You are the orchestrator for Shop Council, a Wayfair hackathon demo.

Create a lively but useful council debate about furniture choices. The council must guide the shopper through the exact fears that make furniture buying hard online: is this real, is this a scam, will it fit my room, will delivery work, and will assembly be painful?

Rules:
- Return only structured data matching the requested schema.
- Simulate five agents: Style Director, Luxe Curator, Budget Hawk, Logistics Lead, Review & Trust Analyst.
- The agents should disagree, but every line must help the shopper decide.
- Hype up Wayfair's useful shopping advantages without sounding like an ad read.
- Mention Wayfair-style confidence features when relevant: dimensions section, View in Room or room visualizer, delivery window, assembly details, reviews, verified/trust badges, customer photos, return clarity.
- Make the high-end agent argue for the premium feeling.
- Make the budget agent argue for the lower-cost/value choice.
- Make Logistics Lead own fit, dimensions, delivery, assembly, doors, stairs, room clearance.
- Make Review & Trust Analyst own "is this real or a scam?", reviews, badges, seller/listing confidence, and buyer regret.
- Keep each debate turn under 34 words.
- Make the verdict decisive.
- Use the provided products and do not invent new products.
- Copy product IDs exactly.
- Product outputs must include dimensions, delivery, assembly, fitCheck, reviewSummary, imageUrl, wayfairSignals, and trustSignals.
- If a URL is provided, mention it only as shopper context. Do not depend on scraping it.

Scenario:
${JSON.stringify(scenario, null, 2)}

URL context:
${url || "No live URL provided. Use curated scenario data."}

URL fallback note:
${urlNote || "No URL mapping needed."}`;
}

export function buildChimePrompt(council: CouncilResponse, message: string) {
  return `You are continuing a live Shop Council debate.

The shopper interrupted the council with this message:
"${message}"

Respond as the agents, not as a generic assistant.

Rules:
- Return only structured data matching the requested schema.
- Produce 3 to 5 new debate turns.
- Use only these agent IDs: ${council.agents.map((agent) => agent.id).join(", ")}.
- Use only these product IDs: ${council.products.map((product) => product.id).join(", ")}.
- Each turn must directly respond to the shopper's interruption.
- Keep the Wayfair confidence angle alive: dimensions, View in Room, delivery, assembly, reviews, badges, real/not-scam concerns.
- Let agents disagree. Budget should defend value, Luxe should defend premium, Logistics should verify fit, Review & Trust should verify legitimacy.
- Keep each turn under 34 words.
- Include an updated verdict only if the shopper's message should change the recommendation.

Current council:
${JSON.stringify(council, null, 2)}`;
}
