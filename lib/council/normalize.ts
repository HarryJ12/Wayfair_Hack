import type { CouncilResponse } from "./schema";

export function normalizeCouncilResponse(
  generated: CouncilResponse,
  fallback: CouncilResponse,
): CouncilResponse {
  const agentIds = new Set(fallback.agents.map((agent) => agent.id));
  const productIds = new Set(fallback.products.map((product) => product.id));

  const debateTurns = generated.debateTurns
    .filter((turn) => agentIds.has(turn.agentId))
    .map((turn) => ({
      ...turn,
      targetProductId:
        turn.targetProductId && productIds.has(turn.targetProductId)
          ? turn.targetProductId
          : undefined,
      text: turn.text.trim(),
    }))
    .filter((turn) => turn.text.length > 0);

  const generatedWinnerValid = productIds.has(generated.verdict.winnerProductId);
  const generatedConfidence = Number.isFinite(generated.verdict.confidence)
    ? Math.round(generated.verdict.confidence)
    : fallback.verdict.confidence;

  return {
    scenario: fallback.scenario,
    products: fallback.products,
    agents: fallback.agents,
    debateTurns: debateTurns.length > 0 ? debateTurns : fallback.debateTurns,
    verdict: {
      winnerProductId: generatedWinnerValid
        ? generated.verdict.winnerProductId
        : fallback.verdict.winnerProductId,
      decision: generated.verdict.decision,
      headline: generated.verdict.headline.trim() || fallback.verdict.headline,
      reasons:
        generated.verdict.reasons.length > 0
          ? generated.verdict.reasons.map((reason) => reason.trim()).filter(Boolean)
          : fallback.verdict.reasons,
      caveats:
        generated.verdict.caveats.length > 0
          ? generated.verdict.caveats.map((caveat) => caveat.trim()).filter(Boolean)
          : fallback.verdict.caveats,
      confidence: Math.max(0, Math.min(100, generatedConfidence)),
    },
  };
}
