import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";
import { subconsciousModel } from "@/lib/subconscious";
import type { CouncilSource } from "./schema";

export type CouncilModelConfig = {
  source: Exclude<CouncilSource, "fallback">;
  model: LanguageModel;
};

export function getCouncilModelConfig(): CouncilModelConfig | null {
  const providerPreference = process.env.COUNCIL_MODEL_PROVIDER;
  const anthropicModelId =
    process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-5-20250929";
  const openaiModelId = process.env.OPENAI_MODEL;

  if (
    process.env.ANTHROPIC_API_KEY &&
    (!providerPreference || providerPreference === "anthropic")
  ) {
    return {
      source: "anthropic",
      model: createAnthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      })(anthropicModelId),
    };
  }

  if (
    process.env.SUBCONSCIOUS_API_KEY &&
    (!providerPreference || providerPreference === "subconscious")
  ) {
    return {
      source: "subconscious",
      model: subconsciousModel,
    };
  }

  if (
    process.env.OPENAI_API_KEY &&
    openaiModelId &&
    (!providerPreference || providerPreference === "openai")
  ) {
    return {
      source: "openai",
      model: createOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      }).chat(openaiModelId),
    };
  }

  return null;
}
