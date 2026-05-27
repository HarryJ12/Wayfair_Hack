import { generateObject } from "ai";
import { buildFallbackCouncil } from "@/lib/council/fallback";
import { getCouncilModelConfig } from "@/lib/council/model";
import { normalizeCouncilResponse } from "@/lib/council/normalize";
import { buildCouncilPrompt } from "@/lib/council/prompt";
import { getScenario, type CouncilScenario } from "@/lib/council/scenarios";
import {
  CouncilRequestSchema,
  CouncilResponseSchema,
  type CouncilApiResponse,
} from "@/lib/council/schema";
import { ingestWayfairUrl } from "@/lib/council/url-ingest";

export const maxDuration = 60;

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = CouncilRequestSchema.safeParse(body);
  const requestData = parsed.success ? parsed.data : {};
  const url = requestData.url?.trim();
  const urlIngest = url ? await ingestWayfairUrl(url) : null;
  const baseScenario = getScenario(urlIngest?.scenarioId ?? requestData.scenarioId);
  const scenario: CouncilScenario = {
    ...baseScenario,
    shopperGoal: requestData.shopperGoal?.trim() || baseScenario.shopperGoal,
    constraints: requestData.constraints?.length
      ? requestData.constraints
          .map((constraint) => constraint.trim())
          .filter(Boolean)
      : baseScenario.constraints,
  };
  const fallback = buildFallbackCouncil(scenario);
  const modelConfig = getCouncilModelConfig();

  if (!requestData.live) {
    return Response.json({
      source: "fallback",
      council: fallback,
      note:
        requestData.sourceLabel?.trim() ||
        "Curated Wayfair blue sofa JSON loaded for the live demo.",
      urlNote: urlIngest?.note,
    } satisfies CouncilApiResponse);
  }

  if (!modelConfig) {
    return Response.json({
      source: "fallback",
      council: fallback,
      note:
        "No live model key configured. Returned the curated no-API Shop Council demo.",
      urlNote: urlIngest?.note,
    } satisfies CouncilApiResponse);
  }

  try {
    const result = await generateObject({
      model: modelConfig.model,
      schema: CouncilResponseSchema,
      prompt: buildCouncilPrompt(scenario, url || undefined, urlIngest?.note),
    });

    return Response.json({
      source: modelConfig.source,
      council: normalizeCouncilResponse(result.object, fallback),
      urlNote: urlIngest?.note,
    } satisfies CouncilApiResponse);
  } catch (error) {
    return Response.json({
      source: "fallback",
      council: fallback,
      note:
        error instanceof Error
          ? `Live model call failed: ${error.message}`
          : "Live model call failed. Returned curated fallback debate.",
      urlNote: urlIngest?.note,
    } satisfies CouncilApiResponse);
  }
}
