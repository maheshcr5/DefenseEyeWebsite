import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  COPILOT_EMBEDDING_MODEL,
  getCopilotModel,
  type CopilotModel,
} from "./config";

let client: GoogleGenerativeAI | null = null;

export function getGeminiClient() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim();
  if (!apiKey) return null;
  if (!client) client = new GoogleGenerativeAI(apiKey);
  return client;
}

export function getGeminiStatus() {
  return {
    configured: Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim()),
    model: getCopilotModel(),
    embeddingModel: COPILOT_EMBEDDING_MODEL,
  };
}

export function getGeminiTextModel(modelName?: CopilotModel) {
  const gemini = getGeminiClient();
  if (!gemini) return null;
  return gemini.getGenerativeModel({ model: modelName || getCopilotModel() });
}

export async function embedText(text: string) {
  const gemini = getGeminiClient();
  if (!gemini) return null;
  const model = gemini.getGenerativeModel({ model: COPILOT_EMBEDDING_MODEL });
  const result = await model.embedContent(text);
  return result.embedding.values;
}
