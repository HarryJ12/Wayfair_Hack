import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { buildFallbackCouncil } from "@/lib/council/fallback";
import { buildCouncilPrompt } from "@/lib/council/prompt";
import { getScenario } from "@/lib/council/scenarios";
import {
  CouncilRequestSchema,
  CouncilResponseSchema,
  type CouncilApiResponse,
} from "@/lib/council/schema";
import { subconsciousModel } from "@/lib/subconscious";

export const maxDuration = 60;

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = CouncilRequestSchema.safeParse(body);
  const requestData = parsed.success ? parsed.data : {};
  const scenario = getScenario(requestData.scenarioId);
  const fallback = buildFallbackCouncil(scenario);
  const openaiModelId = process.env.OPENAI_MODEL;
  const modelConfig = process.env.SUBCONSCIOUS_API_KEY
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
    } satisfies CouncilApiResponse);
  }

  try {
    const result = await generateObject({
      model: modelConfig.model,
      schema: CouncilResponseSchema,
      prompt: buildCouncilPrompt(scenario, requestData.url || undefined),
    });

    return Response.json({
      source: modelConfig.source,
      council: result.object,
    } satisfies CouncilApiResponse);
  } catch (error) {
    return Response.json({
      source: "fallback",
      council: fallback,
      note:
        error instanceof Error
          ? `Subconscious call failed: ${error.message}`
          : "Subconscious call failed. Returned curated fallback debate.",
    } satisfies CouncilApiResponse);
  }
}
