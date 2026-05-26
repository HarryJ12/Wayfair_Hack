import { DEFAULT_SCENARIO_ID } from "./scenarios";

export type UrlIngestResult = {
  scenarioId: string;
  extractedTitle?: string;
  note: string;
};

export async function ingestWayfairUrl(url: string): Promise<UrlIngestResult> {
  const normalized = url.trim();

  if (!normalized) {
    return {
      scenarioId: DEFAULT_SCENARIO_ID,
      note: "No URL provided. Using default curated scenario.",
    };
  }

  try {
    const parsed = new URL(normalized);
    const text = `${parsed.pathname} ${parsed.search}`.toLowerCase();

    if (text.includes("desk") || text.includes("office")) {
      return {
        scenarioId: "remote-work-desk",
        note: "URL looked like an office product. Mapped to curated desk scenario.",
      };
    }

    if (text.includes("dining") || text.includes("table")) {
      return {
        scenarioId: "family-dining-table",
        note: "URL looked like a dining product. Mapped to curated table scenario.",
      };
    }

    if (text.includes("sofa") || text.includes("couch") || text.includes("sectional")) {
      return {
        scenarioId: "tiny-apartment-sofa",
        note: "URL looked like a sofa product. Mapped to curated sofa scenario.",
      };
    }

    return {
      scenarioId: DEFAULT_SCENARIO_ID,
      note: "URL was accepted, but no product type was clear. Using default curated scenario.",
    };
  } catch {
    return {
      scenarioId: DEFAULT_SCENARIO_ID,
      note: "URL could not be parsed. Using default curated scenario.",
    };
  }
}
