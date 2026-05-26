import { generateObject } from "ai";
import { buildFallbackChime, buildFallbackCouncil } from "@/lib/council/fallback";
import { getCouncilModelConfig } from "@/lib/council/model";
import { normalizeCouncilChime } from "@/lib/council/normalize";
import { buildChimePrompt } from "@/lib/council/prompt";
import { getScenario } from "@/lib/council/scenarios";
import {
  CouncilChimeRequestSchema,
  CouncilChimeSchema,
  type CouncilChimeApiResponse,
} from "@/lib/council/schema";

export const maxDuration = 60;

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = CouncilChimeRequestSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Message is required before the council can respond." },
      { status: 400 },
    );
  }

  const scenario = getScenario(parsed.data.scenarioId);
  const council = parsed.data.council ?? buildFallbackCouncil(scenario);
  const fallback = buildFallbackChime(council, parsed.data.message);
  const modelConfig = getCouncilModelConfig();

  if (!modelConfig) {
    return Response.json({
      source: "fallback",
      chime: fallback,
      note: "No live model key configured. Returned fallback council response.",
    } satisfies CouncilChimeApiResponse);
  }

  try {
    const result = await generateObject({
      model: modelConfig.model,
      schema: CouncilChimeSchema,
      prompt: buildChimePrompt(council, parsed.data.message),
    });

    return Response.json({
      source: modelConfig.source,
      chime: normalizeCouncilChime(result.object, fallback, council),
    } satisfies CouncilChimeApiResponse);
  } catch (error) {
    return Response.json({
      source: "fallback",
      chime: fallback,
      note:
        error instanceof Error
          ? `Live model chime failed: ${error.message}`
          : "Live model chime failed. Returned fallback council response.",
    } satisfies CouncilChimeApiResponse);
  }
}
