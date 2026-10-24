"use client";

import { useState } from "react";
import Scorecard from "@/components/Scorecard";
import { SAMPLE } from "@/data/sample";
import type { Deal } from "@/lib/types";

type RunEvent = { ts: number; from: string; to: string; kind: string; stage: string; note: string };

const KIND_COLOR: Record<string, string> = {
  cmd: "#DFF4FF",
  comm: "#3EE8FF",
  mem: "#A77BFF",
  tool: "#FFB547",
  ok: "#4DFF9A",
  err: "#FF4D6A",
};

function Field({ label, value, onChange, rows }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {rows ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className="mt-1 w-full rounded-lg border border-line bg-ink/60 p-3 font-mono text-xs leading-relaxed outline-none focus:border-accent"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-lg border border-line bg-ink/60 px-3 py-2 text-sm outline-none focus:border-accent"
        />
      )}
    </label>
  );
}

export default function AnalyzePage() {
  const [form, setForm] = useState(SAMPLE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deal, setDeal] = useState<Deal | null>(null);
  const [events, setEvents] = useState<RunEvent[]>([]);
  const [meta, setMeta] = useState<{ model: string; latencyMs: number; promptVersion: string; ruleViolations: string[] } | null>(null);

  const set = (k: keyof typeof SAMPLE) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function run() {
    setLoading(true);
    setError(null);
    setDeal(null);
    setEvents([]);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setEvents(data.events ?? []);
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setDeal(data.deal);
      setMeta(data.meta);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="label text-accent">Live analysis</div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Analyze a deal</h1>
        <p className="mt-1 text-muted">
          Paste a deck and meeting transcripts. Nicrron extracts claims; independent evidence sets the verified score. Prefilled with a fictional sample.
        </p>
      </div>

      <div className="glass grid gap-4 p-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Company" value={form.company} onChange={set("company")} />
            <Field label="Website" value={form.website} onChange={set("website")} />
          </div>
          <Field label="Pitch deck (text)" value={form.deck} onChange={set("deck")} rows={12} />
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Meeting 1 transcript" value={form.m1} onChange={set("m1")} rows={7} />
            <Field label="Meeting 3 transcript" value={form.m3} onChange={set("m3")} rows={7} />
          </div>
          <Field label="External evidence (akta.pro, careers, web)" value={form.external} onChange={set("external")} rows={6} />
        </div>
        <div className="flex items-center gap-4 lg:col-span-2">
          <button
            onClick={run}
            disabled={loading}
            className="rounded-lg bg-accent px-5 py-2.5 font-semibold text-ink transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Agents working…" : "Run diligence"}
          </button>
          {loading && <span className="animate-pulse font-mono text-xs text-muted">Nicrron is extracting claims and checking evidence (~20–40s)</span>}
          {meta && !loading && (
            <span className="font-mono text-xs text-muted">
              {meta.model} · {(meta.latencyMs / 1000).toFixed(1)}s · {meta.promptVersion} · guard fixes: {meta.ruleViolations.length}
            </span>
          )}
        </div>
      </div>

      {events.length > 0 && (
        <div className="glass p-4">
          <div className="label mb-2">Agent event log</div>
          <div className="space-y-1 font-mono text-xs">
            {events.map((e, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-muted">{new Date(e.ts).toLocaleTimeString()}</span>
                <span style={{ color: KIND_COLOR[e.kind] ?? "#fff" }}>{e.kind.toUpperCase().padEnd(4)}</span>
                <span className="text-[#C9D4EA]">
                  {e.from} → {e.to}
                </span>
                <span className="text-muted">{e.note}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <div className="rounded-lg border border-err/50 bg-err/10 p-4 text-sm text-err">{error}</div>}
      {deal && <Scorecard deal={deal} />}
    </div>
  );
}
