import { z } from "zod";

export const CouncilRequestSchema = z.object({
  scenarioId: z.string().optional(),
  url: z.string().url().optional().or(z.literal("")),
});

export const CouncilProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  dimensions: z.string(),
  material: z.string(),
  delivery: z.string(),
  assembly: z.string(),
  fitCheck: z.string(),
  reviewSummary: z.string(),
  imageUrl: z.string(),
  wayfairSignals: z.array(z.string()),
  trustSignals: z.array(z.string()),
});

export const CouncilAgentSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  stance: z.enum(["support", "oppose", "mixed"]),
  color: z.string(),
});

export const DebateTurnSchema = z.object({
  agentId: z.string(),
  text: z.string(),
  targetProductId: z.string().optional(),
  emotion: z.enum(["confident", "skeptical", "excited", "concerned"]),
});

export const CouncilResponseSchema = z.object({
  scenario: z.object({
    id: z.string(),
    title: z.string(),
    shopperGoal: z.string(),
    constraints: z.array(z.string()),
  }),
  products: z.array(CouncilProductSchema).min(1),
  agents: z.array(CouncilAgentSchema).min(1),
  debateTurns: z.array(DebateTurnSchema).min(1),
  verdict: z.object({
    winnerProductId: z.string(),
    decision: z.enum(["buy", "consider", "skip"]),
    headline: z.string(),
    reasons: z.array(z.string()),
    caveats: z.array(z.string()),
    confidence: z.number().min(0).max(100),
  }),
});

export type CouncilRequest = z.infer<typeof CouncilRequestSchema>;
export type CouncilResponse = z.infer<typeof CouncilResponseSchema>;

export type CouncilApiResponse = {
  source: "subconscious" | "openai" | "fallback";
  council: CouncilResponse;
  note?: string;
};
