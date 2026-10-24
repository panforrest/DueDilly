"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import DealRadar from "./DealRadar";
import { DIMENSIONS, type Deal, type DimensionKey, type EvidenceKind, type LearningClass, type PassStatus } from "@/lib/types";
import { ABSTAIN_MIN, isEvidenced, orderedDimensions, scoreDeal } from "@/lib/scoring";

const fmt = (n: number | null) => (n === null ? "–" : n.toFixed(1));

function band(n: number | null) {
  if (n === null) return "text-muted border-dashed border-muted/50";
  if (n >= 6.5) return "text-ok border-ok/40";
  if (n >= 4) return "text-claim border-claim/40";
  return "text-err border-err/40";
}

function Chip({ label, value, sub, cls }: { label: string; value: string; sub: string; cls: string }) {
  return (
    <div className={`glass flex-1 border px-5 py-4 ${cls}`}>
      <div className="label">{label}</div>
      <div className="mt-1 font-mono text-3xl font-semibold">{value}</div>
      <div className="mt-1 text-xs text-muted">{sub}</div>
    </div>
  );
}

const KIND_STYLE: Record<EvidenceKind, string> = {
  claim: "bg-claim/10 text-claim border-claim/30",
  verify: "bg-ok/10 text-ok border-ok/30",
  contradict: "bg-err/10 text-err border-err/30",
};

const LEARN_STYLE: Record<LearningClass, { label: string; cls: string }> = {
  sharpened: { label: "Sharpened", cls: "text-ok border-ok/40 bg-ok/10" },
  addressed: { label: "Objection addressed", cls: "text-ok border-ok/40 bg-ok/10" },
  consistent: { label: "Consistent", cls: "text-accent border-accent/40 bg-accent/10" },
  shifted: { label: "Shifted, no explanation", cls: "text-err border-err/40 bg-err/10" },
  dropped: { label: "Dropped", cls: "text-err border-err/40 bg-err/10" },
};

const PASS_STYLE: Record<PassStatus, string> = {
  resolved: "text-ok border-ok/40 bg-ok/10",
  unresolved: "text-err border-err/40 bg-err/10",
  unknown: "text-muted border-muted/40",
};

const TAG_LABEL: Record<string, string> = {
  too_early: "Too early",
  team_gap: "Team gap",
  market_size: "Market size",
  unit_economics: "Unit economics",
  valuation: "Valuation",
  outside_thesis: "Outside thesis",
};

export default function Scorecard({ deal }: { deal: Deal }) {
  const dims = useMemo(() => orderedDimensions(deal), [deal]);
  const sc = useMemo(() => scoreDeal(deal), [deal]);

  const biggestGap = useMemo(() => {
    let best: DimensionKey = dims[0].key;
    let gap = -Infinity;
    for (const d of dims) {
      const g = d.claimedScore !== null && d.verifiedScore !== null ? d.claimedScore - d.verifiedScore : -1;
      if (g > gap) {
        gap = g;
        best = d.key;
      }
    }
    return best;
  }, [dims]);

  const [active, setActive] = useState<DimensionKey>(biggestGap);
  const activeDim = dims.find((d) => d.key === active)!;
  const activeMeta = DIMENSIONS.find((m) => m.key === active)!;
  const [copied, setCopied] = useState(false);

  const emailDraft = `Hi ${deal.founders[0]?.name.split(" ")[0] ?? "there"},\n\nThanks for the time. Before we can move forward we'd love a few things:\n\n${sc.missing
    .map((d) => `- ${d.missing?.question ?? `More detail on ${DIMENSIONS.find((m) => m.key === d.key)?.label}`}`)
    .join("\n")}\n\nBest,`;

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight">{deal.company}</h1>
            {deal.synthetic && (
              <span className="rounded-full border border-mem/40 bg-mem/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-mem">
                Synthetic demo data
              </span>
            )}
          </div>
          <p className="mt-1 text-muted">{deal.tagline}</p>
          <p className="mt-1 font-mono text-xs text-muted">
            {deal.stage} · {deal.sector} · {deal.geo} · Raising {deal.raising}
          </p>
        </div>
        <div className="glass px-4 py-3 text-right">
          <div className="label">Suggested next step</div>
          <div className={`mt-1 text-lg font-semibold ${sc.gatePassed ? "text-accent" : "text-muted"}`}>{sc.decision}</div>
          <div className="text-[11px] text-muted">A partner decides. DueDilly informs.</div>
        </div>
      </div>

      {/* chips */}
      <div className="flex flex-col gap-3 md:flex-row">
        <Chip
          label="Quality (merit)"
          value={sc.gatePassed ? fmt(sc.quality) : "Not enough data"}
          sub={sc.gatePassed ? `Verified, weighted · claimed ${fmt(sc.claimedQuality)}` : "Refusing to guess"}
          cls={band(sc.gatePassed ? sc.quality : null)}
        />
        <Chip label="Fit (fund thesis)" value={fmt(sc.fit)} sub="Scored separately from merit" cls={band(sc.fit)} />
        <Chip
          label="Confidence"
          value={`${sc.coverage} / 7`}
          sub={`${sc.confidence} · dimensions with independent evidence`}
          cls={sc.gatePassed ? (sc.confidence === "high" ? "text-ok border-ok/40" : "text-claim border-claim/40") : "text-muted border-dashed border-muted/50"}
        />
        <Chip
          label="Claim gap"
          value={sc.gap === null ? "–" : `${sc.gap > 0 ? "−" : "+"}${Math.abs(sc.gap).toFixed(1)}`}
          sub="Claimed minus verified, on evidenced spokes"
          cls={sc.gap === null ? "text-muted border-muted/40" : sc.gap >= 2 ? "text-err border-err/40" : sc.gap >= 1 ? "text-claim border-claim/40" : "text-ok border-ok/40"}
        />
      </div>

      {/* abstain panel */}
      {!sc.gatePassed && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border-2 border-dashed border-muted/40 bg-panel p-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="label">Abstain gate</div>
              <h2 className="mt-1 text-xl font-semibold">Not enough data to score</h2>
              <p className="mt-1 max-w-2xl text-sm text-muted">
                Only {sc.coverage} of 7 dimensions have independent evidence (need {ABSTAIN_MIN}). A number here would look as precise as one built on a full
                data room. Here is what to find out next.
              </p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(emailDraft);
                setCopied(true);
                setTimeout(() => setCopied(false), 1800);
              }}
              className="rounded-lg border border-accent/50 bg-accent/10 px-4 py-2 text-sm font-medium text-accent hover:bg-accent/20"
            >
              {copied ? "Copied!" : "Copy questions as email"}
            </button>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {sc.missing.map((d) => (
              <div key={d.key} className="rounded-lg border border-line bg-ink/50 p-4">
                <div className="font-medium">{DIMENSIONS.find((m) => m.key === d.key)?.label}</div>
                <div className="mt-2 text-xs text-muted">
                  <span className="label mr-2">Evidence to get</span>
                  {d.missing?.evidenceToGet ?? "Independent source"}
                </div>
                <div className="mt-1 text-sm">
                  <span className="label mr-2">Ask</span>
                  {d.missing?.question ?? "—"}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* radar + evidence */}
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="glass flex flex-col items-center p-6">
          <div className="flex w-full items-center justify-between">
            <div className="label">Deal scorecard · fixed 0–10 scale</div>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-0.5 w-5 border-t-2 border-dashed border-claim" /> As claimed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-0.5 w-5 bg-accent" /> Verified
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-1 w-5 rounded bg-err/60" /> Gap
              </span>
            </div>
          </div>
          <DealRadar dimensions={dims} active={active} onActive={setActive} />
          <p className="text-center text-xs text-muted">Hover a spoke for evidence. A “?” means no independent evidence: unknown, not zero.</p>
        </div>

        <motion.div key={active} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="glass p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="label">Dimension</div>
              <h3 className="mt-1 text-xl font-semibold">{activeMeta.label}</h3>
            </div>
            <div className="text-right font-mono">
              <div className="text-xs text-muted">claimed → verified</div>
              <div className="text-2xl">
                <span className="text-claim">{activeDim.claimedScore ?? "–"}</span>
                <span className="text-muted"> → </span>
                <span className={activeDim.verifiedScore === null ? "text-muted" : "text-accent"}>{activeDim.verifiedScore ?? "?"}</span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[#C9D4EA]">{activeDim.reasoning}</p>
          {!isEvidenced(activeDim) && (
            <div className="mt-3 rounded-lg border border-dashed border-muted/50 px-3 py-2 text-xs text-muted">
              Not counted in Quality: founder self-report only.
            </div>
          )}
          <div className="mt-4 space-y-2">
            {activeDim.evidence.map((e, i) => (
              <div key={i} className="rounded-lg border border-line bg-ink/50 p-3">
                <div className="flex items-center gap-2">
                  <span className={`rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase ${KIND_STYLE[e.kind]}`}>{e.kind}</span>
                  <span className="text-xs font-medium text-muted">{e.label}</span>
                </div>
                {e.quote && <p className="mt-1.5 text-sm">“{e.quote}”</p>}
              </div>
            ))}
            {activeDim.evidence.length === 0 && <p className="text-sm text-muted">No evidence of any kind.</p>}
          </div>
          <div className="mt-5 flex flex-wrap gap-1.5">
            {dims.map((d) => {
              const meta = DIMENSIONS.find((m) => m.key === d.key)!;
              return (
                <button
                  key={d.key}
                  onClick={() => setActive(d.key)}
                  className={`rounded-md border px-2 py-1 text-xs ${d.key === active ? "border-accent text-accent" : "border-line text-muted hover:text-white"}`}
                >
                  {meta.short}
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* learning rate + pass replay */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="glass p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="label">Founder learning rate</div>
              <h3 className="mt-1 text-lg font-semibold">Meeting 1 vs Meeting 3</h3>
            </div>
            <div className="font-mono text-xs text-muted">
              {deal.meetings.m1} → {deal.meetings.m3 ?? "—"}
            </div>
          </div>
          {deal.learningDiff.length === 0 ? (
            <p className="mt-4 text-sm text-muted">Only one meeting on file. Upload a later transcript to measure learning rate.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {deal.learningDiff.map((item, i) => (
                <div key={i} className="rounded-lg border border-line bg-ink/50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.topic}</span>
                    <span className={`rounded border px-2 py-0.5 text-[11px] ${LEARN_STYLE[item.cls].cls}`}>{LEARN_STYLE[item.cls].label}</span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-md bg-white/[0.03] p-2">
                      <div className="label mb-1">M1</div>
                      {item.m1}
                    </div>
                    <div className={`rounded-md p-2 ${item.m3 === null ? "border border-dashed border-err/50 text-err" : "bg-white/[0.03]"}`}>
                      <div className="label mb-1">M3</div>
                      {item.m3 ?? "(not mentioned)"}
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted">{item.note}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="glass p-6">
            <div className="label">Pass replay</div>
            {deal.passHistory ? (
              <>
                <h3 className="mt-1 text-lg font-semibold">
                  Passed {deal.passHistory.date} · {deal.passHistory.partner}
                </h3>
                <div className="mt-3 space-y-2">
                  {deal.passHistory.reasons.map((r, i) => (
                    <div key={i} className="rounded-lg border border-line bg-ink/50 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{TAG_LABEL[r.tag]}</span>
                        <span className={`rounded border px-2 py-0.5 text-[11px] uppercase ${PASS_STYLE[r.status]}`}>{r.status}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted">Then: {r.original}</p>
                      <p className="mt-1 text-sm">Now: {r.evidence}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="mt-2 text-sm text-muted">First time the fund has seen this company.</p>
            )}
          </div>

          <div className="glass p-6">
            <div className="label">Source quality</div>
            <div className="mt-1 flex items-end justify-between">
              <div>
                <div className="font-medium">{deal.referrer.name}</div>
                <div className="text-xs text-muted">
                  {deal.referrer.advanced} of {deal.referrer.referrals} referrals reached a partner meeting
                </div>
              </div>
              <div className="font-mono text-2xl text-mem">{Math.round(sc.sourceHitRate * 100)}%</div>
            </div>
            <p className="mt-2 text-[11px] text-muted">Smoothed toward the fund average (20%). Context only: never changes Quality.</p>
          </div>
        </div>
      </div>

      {/* red flags + questions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass p-6">
          <div className="label">Red flags</div>
          <div className="mt-3 space-y-2">
            {deal.redFlags.map((f, i) => (
              <div key={i} className="flex gap-3 rounded-lg border border-line bg-ink/50 p-3">
                <span
                  className={`h-fit rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase ${
                    f.severity === "high" ? KIND_STYLE.contradict : f.severity === "medium" ? KIND_STYLE.claim : "border-line text-muted"
                  }`}
                >
                  {f.severity}
                </span>
                <div>
                  <p className="text-sm">{f.text}</p>
                  <p className="text-xs text-muted">{f.source}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass p-6">
          <div className="label">Diligence questions for the next call</div>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm">
            {deal.questions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
