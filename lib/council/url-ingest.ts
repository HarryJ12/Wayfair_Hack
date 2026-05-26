import { DEFAULT_SCENARIO_ID } from "./scenarios";

export const DEMO_WAYFAIR_URL =
  "https://www.wayfair.com/furniture/sb1/blue-sofas-c413892-a2471~5246.html?redir=blue+sofa&rtype=9";

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

    if (text.includes("blue") && (text.includes("sofa") || text.includes("sofas"))) {
      return {
        scenarioId: "wayfair-blue-sofa-page",
        note: "Demo mode: using curated JSON for the Wayfair blue sofa page instead of scraping live results.",
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
        scenarioId: "wayfair-blue-sofa-page",
        note: "Demo mode: URL looked like a sofa page, so using curated Wayfair sofa JSON instead of scraping live results.",
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
