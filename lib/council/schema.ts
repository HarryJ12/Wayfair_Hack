import { z } from "zod";

export const CouncilSourceSchema = z.enum([
  "subconscious",
  "anthropic",
  "openai",
  "fallback",
]);

export const CouncilRequestSchema = z.object({
  scenarioId: z.string().optional(),
  url: z.string().optional(),
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

export const CouncilVerdictSchema = z.object({
  winnerProductId: z.string(),
  decision: z.enum(["buy", "consider", "skip"]),
  headline: z.string(),
  reasons: z.array(z.string()),
  caveats: z.array(z.string()),
  confidence: z.number().min(0).max(100),
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
  verdict: CouncilVerdictSchema,
});

export const CouncilChimeRequestSchema = z.object({
  message: z.string().min(1),
  scenarioId: z.string().optional(),
  council: CouncilResponseSchema.optional(),
});

export const CouncilChimeSchema = z.object({
  debateTurns: z.array(DebateTurnSchema).min(1),
  verdict: CouncilVerdictSchema.optional(),
  note: z.string().optional(),
});

export type CouncilSource = z.infer<typeof CouncilSourceSchema>;
export type CouncilRequest = z.infer<typeof CouncilRequestSchema>;
export type CouncilResponse = z.infer<typeof CouncilResponseSchema>;
export type CouncilChime = z.infer<typeof CouncilChimeSchema>;

export type CouncilApiResponse = {
  source: CouncilSource;
  council: CouncilResponse;
  note?: string;
  urlNote?: string;
};

export type CouncilChimeApiResponse = {
  source: CouncilSource;
  chime: CouncilChime;
  note?: string;
};
