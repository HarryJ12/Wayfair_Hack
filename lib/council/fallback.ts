import type { CouncilScenario } from "./scenarios";
import type { CouncilChime, CouncilResponse } from "./schema";

const agents: CouncilResponse["agents"] = [
  {
    id: "style-director",
    name: "Mara",
    role: "Style Director",
    stance: "support",
    color: "#ffffff",
  },
  {
    id: "luxe-curator",
    name: "Vivienne",
    role: "Luxury Advocate",
    stance: "support",
    color: "#d8b4fe",
  },
  {
    id: "budget-hawk",
    name: "Benji",
    role: "Budget Realist",
    stance: "mixed",
    color: "#b36ad9",
  },
  {
    id: "logistics-lead",
    name: "Logan",
    role: "Fit & Delivery Lead",
    stance: "support",
    color: "#9f4cc5",
  },
  {
    id: "review-analyst",
    name: "Riley",
    role: "Review & Trust Analyst",
    stance: "oppose",
    color: "#f3e8ff",
  },
];

export function buildFallbackCouncil(scenario: CouncilScenario): CouncilResponse {
  const [first, second, third] = scenario.products;
  const winner = first;
  const runnerUp = second ?? first;
  const risky = third ?? runnerUp;

  return {
    scenario: {
      id: scenario.id,
      title: scenario.title,
      shopperGoal: scenario.shopperGoal,
      constraints: scenario.constraints,
    },
    products: scenario.products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      dimensions: product.dimensions,
      material: product.material,
      delivery: product.delivery,
      assembly:
        product.assembly ??
        "Check Wayfair assembly details before ordering.",
      fitCheck:
        product.fitCheck ??
        `Use Wayfair's dimensions section to compare ${product.dimensions} against the room before buying.`,
      reviewSummary: product.reviewSummary,
      imageUrl: product.imageUrl,
      wayfairSignals:
        product.wayfairSignals ??
        ["Dimensions section", "Delivery estimate", "Customer reviews"],
      trustSignals:
        product.trustSignals ??
        ["Review pattern", "Clear product details", "Marketplace trust cues"],
    })),
    agents,
    debateTurns: [
      {
        agentId: "style-director",
        targetProductId: winner.id,
        emotion: "excited",
        text: `I am opening with ${winner.name}. Wayfair gives room-fit confidence; Amazon gives tiny thumbnails and emotional support checkout.`,
      },
      {
        agentId: "luxe-curator",
        targetProductId: risky.id,
        emotion: "excited",
        text: `${risky.name} is the drama pick. Gorgeous, but Wayfair's dimensions stop luxury from becoming hallway furniture.`,
      },
      {
        agentId: "budget-hawk",
        targetProductId: winner.id,
        emotion: "skeptical",
        text: `$${winner.price} is not cheap-cheap, but Wayfair shows delivery, reviews, and photos. That beats mystery-couch roulette.`,
      },
      {
        agentId: "logistics-lead",
        targetProductId: winner.id,
        emotion: "confident",
        text: `Fit before vibes: ${winner.dimensions}. Wayfair tells us doors, delivery, and assembly before the staircase starts acting important.`,
      },
      {
        agentId: "review-analyst",
        targetProductId: risky.id,
        emotion: "concerned",
        text: `Real-or-scam check: Wayfair has reviews, customer photos, and specs. Random marketplace listings make me squint.`,
      },
      {
        agentId: "budget-hawk",
        targetProductId: runnerUp.id,
        emotion: "confident",
        text: `${runnerUp.name} saves money and ships compact. Good if the room is tiny and the wallet is loud.`,
      },
      {
        agentId: "style-director",
        targetProductId: winner.id,
        emotion: "confident",
        text: `No final gavel. Use Wayfair's room fit, delivery, assembly notes, reviews, and photos; then you choose.`,
      },
    ],
    verdict: {
      winnerProductId: winner.id,
      decision: "buy",
      headline: `Buy ${winner.name}`,
      reasons: [
        winner.whyItMatters,
        `Wayfair confidence checks are built into the flow: ${[
          ...(winner.wayfairSignals ?? []),
          ...(winner.trustSignals ?? []),
        ]
          .slice(0, 3)
          .join(", ")}.`,
        `It stays inside the key constraints: ${scenario.constraints.slice(0, 2).join(", ")}.`,
        `Reviews support the use case: ${winner.reviewSummary}`,
      ],
      caveats: [
        winner.risk,
        "Use the dimensions section and View in Room flow before ordering.",
      ],
      confidence: 86,
    },
  };
}

export function buildFallbackChime(
  council: CouncilResponse,
  message: string,
): CouncilChime {
  const normalized = message.toLowerCase();
  const winner =
    council.products.find(
      (product) => product.id === council.verdict.winnerProductId,
    ) ?? council.products[0];
  const budgetPick =
    council.products.reduce((lowest, product) =>
      product.price < lowest.price ? product : lowest,
    ) ?? winner;
  const premiumPick =
    council.products.reduce((highest, product) =>
      product.price > highest.price ? product : highest,
    ) ?? winner;

  const focus = normalized.includes("scam") || normalized.includes("real")
    ? "trust"
    : normalized.includes("fit") || normalized.includes("dimension")
      ? "fit"
      : normalized.includes("cheap") ||
          normalized.includes("budget") ||
          normalized.includes("expensive")
        ? "budget"
        : "general";

  const opener =
    focus === "trust"
      ? `Good interruption. Wayfair helps here because reviews, customer photos, and specs beat marketplace guesswork.`
      : focus === "fit"
        ? `Good interruption. Fit comes first: ${winner.dimensions}. Wayfair makes the room math visible.`
        : focus === "budget"
          ? `Good interruption. If price rules, ${budgetPick.name} has to prove savings beat regret.`
          : `Good interruption. The council pivots to your concern now. Nobody gets to monologue through the shopper.`;

  return {
    debateTurns: [
      {
        agentId: "review-analyst",
        targetProductId: winner.id,
        emotion: focus === "trust" ? "confident" : "concerned",
        text: opener,
      },
      {
        agentId: "budget-hawk",
        targetProductId: budgetPick.id,
        emotion: "skeptical",
        text: `Benji recalculates: $${budgetPick.price} is tempting, but cheap only wins if fit and reviews do not betray us.`,
      },
      {
        agentId: "luxe-curator",
        targetProductId: premiumPick.id,
        emotion: "excited",
        text: `Vivienne still likes ${premiumPick.name}, but Wayfair's delivery and room details decide whether luxury behaves.`,
      },
      {
        agentId: "logistics-lead",
        targetProductId: winner.id,
        emotion: "confident",
        text: `Logan says measure first. Wayfair gives dimensions and delivery context; Amazon-style guessing gets couches stuck.`,
      },
    ],
    verdict: council.verdict,
    note: `Shopper interrupted with: "${message}"`,
  };
}
