// Usage: node --env-file=.env scripts/smoke-nicrron.mjs
import OpenAI from "openai";

const { NICRRON_API_KEY, NICRRON_BASE_URL, NICRRON_MODEL_FAST, NICRRON_MODEL_REASONING } = process.env;

if (!NICRRON_API_KEY) {
  console.error("FAIL: NICRRON_API_KEY is empty in .env");
  process.exit(1);
}

const client = new OpenAI({ baseURL: NICRRON_BASE_URL, apiKey: NICRRON_API_KEY });

for (const model of [NICRRON_MODEL_FAST, NICRRON_MODEL_REASONING]) {
  const started = Date.now();
  try {
    const reply = await client.chat.completions.create({
      model,
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "Reply with JSON only." },
        { role: "user", content: 'Return {"ok": true, "app": "DueDilly"}' },
      ],
    });
    console.log(`PASS ${model} (${Date.now() - started} ms, served by ${reply.model}):`, reply.choices[0].message.content);
  } catch (err) {
    console.error(`FAIL ${model}:`, err.status ?? "", err.message);
  }
}
