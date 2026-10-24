import OpenAI from "openai";

let client: OpenAI | null = null;

function getClient() {
  if (!process.env.NICRRON_API_KEY) throw new Error("NICRRON_API_KEY is not set");
  client ??= new OpenAI({
    baseURL: process.env.NICRRON_BASE_URL ?? "https://api.nicrron.ai/v1",
    apiKey: process.env.NICRRON_API_KEY,
    timeout: 55_000,
    maxRetries: 1,
  });
  return client;
}

export type Tier = "fast" | "reasoning";

export async function completeJson<T>({
  tier,
  system,
  user,
  maxTokens = 3500,
}: {
  tier: Tier;
  system: string;
  user: string;
  maxTokens?: number;
}): Promise<{ json: T; model: string; latencyMs: number; usage?: OpenAI.CompletionUsage }> {
  const model = tier === "fast" ? process.env.NICRRON_MODEL_FAST ?? "nicrron/fastest" : process.env.NICRRON_MODEL_REASONING ?? "anthropic/claude-sonnet-5";
  const started = Date.now();
  let lastError = "";
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await getClient().chat.completions.create({
      model,
      temperature: 0,
      max_tokens: maxTokens,
      max_completion_tokens: maxTokens,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });
    const raw = res.choices[0]?.message?.content ?? "{}";
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    try {
      const json = JSON.parse(raw.slice(start, end + 1)) as T;
      return { json, model: res.model, latencyMs: Date.now() - started, usage: res.usage };
    } catch (err) {
      lastError = `Invalid JSON from ${res.model} (finish_reason=${res.choices[0]?.finish_reason}, ${raw.length} chars): ${(err as Error).message}`;
    }
  }
  throw new Error(lastError);
}
