export const AGENT_VOICE_IDS: Record<string, string> = {
  "style-director": "kPzsL2i3teMYv0FxEYQ6",
  "luxe-curator": "yj30vwTGJxSHezdAGsv9",
  "budget-hawk": "alFofuDn3cOwyoz1i44T",
  "logistics-lead": "yl2ZDV1MzN4HbQJbMihG",
  "review-analyst": "uIZsnBL0YK1S5j69bAih",
};

export function getAgentVoiceId(agentId: string) {
  return AGENT_VOICE_IDS[agentId] ?? AGENT_VOICE_IDS["style-director"];
}
