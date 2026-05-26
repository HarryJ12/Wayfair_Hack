import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { buildFallbackCouncil } from "@/lib/council/fallback";
import { normalizeCouncilResponse } from "@/lib/council/normalize";
import { buildCouncilPrompt } from "@/lib/council/prompt";
import { getScenario } from "@/lib/council/scenarios";
import {
  CouncilRequestSchema,
  CouncilResponseSchema,
  type CouncilApiResponse,
} from "@/lib/council/schema";
import { ingestWayfairUrl } from "@/lib/council/url-ingest";
import { subconsciousModel } from "@/lib/subconscious";

export const maxDuration = 60;

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = CouncilRequestSchema.safeParse(body);
  const requestData = parsed.success ? parsed.data : {};
  const url = requestData.url?.trim();
  const urlIngest = url ? await ingestWayfairUrl(url) : null;
  const scenario = getScenario(urlIngest?.scenarioId ?? requestData.scenarioId);
  const fallback = buildFallbackCouncil(scenario);
  const openaiModelId = process.env.OPENAI_MODEL;
  const anthropicModelId =
    process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-5-20250929";
  const providerPreference = process.env.COUNCIL_MODEL_PROVIDER;
  const modelConfig = process.env.ANTHROPIC_API_KEY &&
    (!providerPreference || providerPreference === "anthropic")
      ? {
          source: "anthropic" as const,
          model: createAnthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
          })(anthropicModelId),
        }
    : process.env.SUBCONSCIOUS_API_KEY &&
        (!providerPreference || providerPreference === "subconscious")
      ? {
          source: "subconscious" as const,
          model: subconsciousModel,
        }
    : process.env.OPENAI_API_KEY && openaiModelId
      ? {
          source: "openai" as const,
          model: createOpenAI({
            apiKey: process.env.OPENAI_API_KEY,
          }).chat(openaiModelId),
        }
      : null;

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
