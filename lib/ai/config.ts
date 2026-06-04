export const COPILOT_DEFAULT_MODEL = "gemini-2.5-flash";
export const COPILOT_PRO_MODEL = "gemini-2.5-pro";
export const COPILOT_EMBEDDING_MODEL = "text-embedding-004";

export type CopilotModel = typeof COPILOT_DEFAULT_MODEL | typeof COPILOT_PRO_MODEL;

export function getCopilotModel() {
  const override = process.env.COPILOT_GEMINI_MODEL?.trim();
  if (override === COPILOT_PRO_MODEL) return COPILOT_PRO_MODEL;
  return COPILOT_DEFAULT_MODEL;
}

export const copilotRetrievalConfig = {
  chunkTokenSize: 800,
  chunkTokenOverlap: 150,
  topK: 5,
};
