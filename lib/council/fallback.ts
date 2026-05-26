import type { CouncilScenario } from "./scenarios";
import type { CouncilResponse } from "./schema";

const agents: CouncilResponse["agents"] = [
  {
    id: "style-director",
    name: "Mara",
    role: "Style Director",
    stance: "support",
    color: "#14b8a6",
  },
  {
    id: "luxe-curator",
    name: "Vivian",
    role: "Luxe Curator",
    stance: "support",
    color: "#a855f7",
  },
  {
    id: "budget-hawk",
    name: "Dex",
    role: "Budget Hawk",
    stance: "mixed",
    color: "#f59e0b",
  },
  {
    id: "logistics-lead",
    name: "Priya",
    role: "Logistics Lead",
    stance: "support",
    color: "#6366f1",
  },
  {
    id: "review-analyst",
    name: "Noor",
    role: "Review & Trust Analyst",
    stance: "oppose",
    color: "#f43f5e",
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
        text: `${winner.name} is the best style read. Wayfair's View in Room style check makes this easier to imagine before the shopper commits.`,
      },
      {
        agentId: "luxe-curator",
        targetProductId: risky.id,
        emotion: "excited",
        text: `If we chase the premium feeling, ${risky.name} is the aspirational pick. I love the luxury signal, but I need the room and delivery facts to agree.`,
      },
      {
        agentId: "budget-hawk",
        targetProductId: winner.id,
        emotion: "skeptical",
        text: `Low-end lens: at $${winner.price}, ${winner.name} wins because it buys confidence, not just furniture. The cheaper option saves money but loses presence.`,
      },
      {
        agentId: "logistics-lead",
        targetProductId: winner.id,
        emotion: "confident",
        text: `Fit check: ${winner.dimensions}. This is exactly where Wayfair beats random listings: dimensions, delivery, and assembly details are visible before checkout.`,
      },
      {
        agentId: "review-analyst",
        targetProductId: risky.id,
        emotion: "concerned",
        text: `Trust check: I am asking, is this real, is it a scam, will it fit? The reviews and listing details make ${winner.name} feel safer than ${risky.name}.`,
      },
      {
        agentId: "budget-hawk",
        targetProductId: runnerUp.id,
        emotion: "confident",
        text: `${runnerUp.name} is the budget pressure test. It saves money, but the tradeoff is visible: ${runnerUp.whyItMatters}`,
      },
      {
        agentId: "style-director",
        targetProductId: winner.id,
        emotion: "confident",
        text: `Council vote: ${winner.name}. It uses Wayfair's strengths: visual fit, real dimensions, delivery clarity, assembly context, and review confidence.`,
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
