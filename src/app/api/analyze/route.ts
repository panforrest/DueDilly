import { NextResponse } from "next/server";
import { completeJson } from "@/lib/llm";
import { AGENT_TASKS, PROMPT_VERSION, dealInput, type AgentId } from "@/lib/prompts";
import { toDeal } from "@/lib/normalize";

export const runtime = "nodejs";
export const maxDuration = 60;

interface AnalyzeBody {
  company: string;
  website?: string;
  deck: string;
  m1?: string;
  m3?: string;
  external?: string;
}

type RunEvent = { ts: number; from: string; to: string; kind: string; stage: string; note: string };

export async function POST(req: Request) {
  const body = (await req.json()) as AnalyzeBody;
  if (!body.company?.trim() || !body.deck?.trim()) {
    return NextResponse.json({ error: "Company name and deck text are required." }, { status: 400 });
  }

  const events: RunEvent[] = [];
  const log = (from: string, to: string, kind: string, stage: string, note: string) => events.push({ ts: Date.now(), from, to, kind, stage, note });
  const input = dealInput(body);

  try {
    log("ORCHESTRATOR", "INTAKE", "cmd", "intake", `Run started · prompt ${PROMPT_VERSION}`);
    log("INTAKE", "SCOUT", "comm", "gather", body.external?.trim() ? "External evidence attached" : "No external evidence: verified scores will be unknown");

    const agents = Object.keys(AGENT_TASKS) as AgentId[];
    for (const a of agents) log("ORCHESTRATOR", a, "cmd", "verify", "Dispatch");

    const results = await Promise.all(
      agents.map(async (agent) => {
        const r = await completeJson<Record<string, unknown>>({ tier: "fast", system: AGENT_TASKS[agent].system, user: input });
        log(agent, "NICRRON", "tool", "verify", `${r.model} · ${r.latencyMs} ms · ${r.usage?.total_tokens ?? "?"} tokens`);
        return { agent, ...r };
      }),
    );

    const byAgent = Object.fromEntries(results.map((r) => [r.agent, r.json])) as Record<AgentId, Record<string, unknown>>;
    const merged = {
      ...byAgent["SCORER-B"],
      ...byAgent.FOUNDER,
      dimensions: [
        ...((byAgent["SCORER-A"].dimensions as unknown[]) ?? []),
        ...((byAgent["SCORER-B"].dimensions as unknown[]) ?? []),
      ],
    };

    const { deal, ruleViolations } = toDeal(merged, { id: `live-${Date.now()}`, company: body.company, website: body.website });
    for (const v of ruleViolations) log("GUARD", "SCORER", "err", "gate", v);
    log("SCORER", "ORCHESTRATOR", "ok", "score", "Gate, Quality, Fit and Confidence computed in code");

    const model = results[0]?.model ?? "";
    const latencyMs = Math.max(...results.map((r) => r.latencyMs));
    return NextResponse.json({ deal, events, meta: { model, latencyMs, promptVersion: PROMPT_VERSION, ruleViolations } });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    log("ORCHESTRATOR", "ORCHESTRATOR", "err", "score", message);
    return NextResponse.json({ error: message, events }, { status: 502 });
  }
}
