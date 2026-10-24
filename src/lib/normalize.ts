import { DIMENSIONS, type Deal, type Dimension, type EvidenceKind, type EvidenceSource, type LearningClass } from "./types";

const SOURCES: EvidenceSource[] = ["deck", "transcript", "akta", "github", "careers", "web", "dataroom"];
const KINDS: EvidenceKind[] = ["claim", "verify", "contradict"];
const CLASSES: LearningClass[] = ["sharpened", "addressed", "consistent", "shifted", "dropped"];

const clampScore = (v: unknown): number | null => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.max(0, Math.min(10, Math.round(n))) : null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Raw = any;

/** Coerces LLM output into a Deal and enforces "unknown is not zero" in code, regardless of what the model returned. */
export function toDeal(raw: Raw, fallback: { id: string; company: string; website?: string }): { deal: Deal; ruleViolations: string[] } {
  const ruleViolations: string[] = [];
  const rawDims: Raw[] = Array.isArray(raw?.dimensions) ? raw.dimensions : [];

  const dimensions: Dimension[] = DIMENSIONS.map(({ key }) => {
    const r = rawDims.find((d) => d?.key === key) ?? {};
    const evidence = (Array.isArray(r.evidence) ? r.evidence : []).map((e: Raw) => ({
      source: SOURCES.includes(e?.source) ? e.source : "deck",
      kind: KINDS.includes(e?.kind) ? e.kind : "claim",
      label: String(e?.label ?? "Source"),
      quote: e?.quote ? String(e.quote) : undefined,
    }));
    let verifiedScore = clampScore(r.verifiedScore);
    const hasIndependent = evidence.some((e: { kind: EvidenceKind }) => e.kind !== "claim");
    if (verifiedScore !== null && !hasIndependent) {
      ruleViolations.push(`${key}: verifiedScore ${verifiedScore} with no independent evidence -> forced to null`);
      verifiedScore = null;
    }
    return {
      key,
      claimedScore: clampScore(r.claimedScore),
      verifiedScore,
      reasoning: String(r.reasoning ?? ""),
      evidence,
      missing:
        verifiedScore === null
          ? {
              evidenceToGet: String(r.missing?.evidenceToGet ?? "Independent source"),
              question: String(r.missing?.question ?? `Can you share evidence for ${key}?`),
            }
          : undefined,
    };
  });

  const deal: Deal = {
    id: fallback.id,
    company: String(raw?.company ?? fallback.company),
    tagline: String(raw?.tagline ?? ""),
    website: fallback.website ?? "",
    stage: String(raw?.stage ?? "Unknown"),
    sector: String(raw?.sector ?? "Unknown"),
    geo: String(raw?.geo ?? "Unknown"),
    raising: String(raw?.raising ?? "Unknown"),
    synthetic: false,
    founders: Array.isArray(raw?.founders) ? raw.founders.slice(0, 5) : [],
    referrer: { name: "Live analysis", type: "inbound", referrals: 0, advanced: 0 },
    meetings: { m1: "Meeting 1", m3: Array.isArray(raw?.learningDiff) && raw.learningDiff.length ? "Meeting 3" : null },
    dimensions,
    fit: (Array.isArray(raw?.fit) ? raw.fit : []).map((f: Raw) => ({
      name: String(f?.name ?? ""),
      score: Math.max(0, Math.min(1, Number(f?.score) || 0)),
      note: String(f?.note ?? ""),
    })),
    learningDiff: (Array.isArray(raw?.learningDiff) ? raw.learningDiff : []).map((l: Raw) => ({
      topic: String(l?.topic ?? ""),
      m1: String(l?.m1 ?? ""),
      m3: l?.m3 ? String(l.m3) : null,
      cls: CLASSES.includes(l?.cls) ? l.cls : "consistent",
      note: String(l?.note ?? ""),
    })),
    passHistory: null,
    redFlags: (Array.isArray(raw?.redFlags) ? raw.redFlags : []).map((f: Raw) => ({
      severity: ["high", "medium", "low"].includes(f?.severity) ? f.severity : "low",
      text: String(f?.text ?? ""),
      source: String(f?.source ?? ""),
    })),
    questions: (Array.isArray(raw?.questions) ? raw.questions : []).map(String),
  };
  return { deal, ruleViolations };
}
