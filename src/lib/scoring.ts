import { DIMENSIONS, type Deal, type Dimension, type DimensionKey } from "./types";

/** Seed-stage weights from the research brief (Section 2). */
export const SEED_WEIGHTS: Record<DimensionKey, number> = {
  team: 30,
  market: 20,
  product: 15,
  traction: 15,
  unitEconomics: 5,
  defensibility: 10,
  dealRisk: 5,
};

export const ABSTAIN_MIN = 4;
export const CUTLINE = 6.5;
export const FUND_HIT_RATE = 0.2;
export const SMOOTHING_ALPHA = 5;

/** Evidenced = has a verified score backed by at least one independent (non-founder) source. */
export function isEvidenced(d: Dimension): boolean {
  return d.verifiedScore !== null && d.evidence.some((e) => e.kind !== "claim");
}

function weightedMean(dims: Dimension[], pick: (d: Dimension) => number | null): number | null {
  let num = 0;
  let den = 0;
  for (const d of dims) {
    const v = pick(d);
    if (v === null) continue;
    num += SEED_WEIGHTS[d.key] * v;
    den += SEED_WEIGHTS[d.key];
  }
  return den === 0 ? null : num / den;
}

export type Decision = "Pursue" | "Refer to co-investors" | "Monitor" | "Pass" | "Gather evidence";

export interface Scorecard {
  quality: number | null;
  claimedQuality: number | null;
  fit: number;
  coverage: number;
  gatePassed: boolean;
  confidence: "high" | "medium" | "low";
  gap: number | null;
  decision: Decision;
  missing: Dimension[];
  sourceHitRate: number;
}

export function sourceHitRate(advanced: number, referrals: number): number {
  return (advanced + SMOOTHING_ALPHA * FUND_HIT_RATE) / (referrals + SMOOTHING_ALPHA);
}

export function orderedDimensions(deal: Deal): Dimension[] {
  return DIMENSIONS.map((meta) => {
    const d = deal.dimensions.find((x) => x.key === meta.key);
    if (!d) return { key: meta.key, claimedScore: null, verifiedScore: null, evidence: [], reasoning: "No data." };
    return d;
  });
}

export function scoreDeal(deal: Deal): Scorecard {
  const dims = orderedDimensions(deal);
  const evidenced = dims.filter(isEvidenced);
  const coverage = evidenced.length;
  const gatePassed = coverage >= ABSTAIN_MIN;

  const quality = gatePassed ? weightedMean(evidenced, (d) => d.verifiedScore) : null;
  const claimedQuality = weightedMean(dims, (d) => d.claimedScore);
  const fit = (deal.fit.reduce((s, c) => s + c.score, 0) / Math.max(deal.fit.length, 1)) * 10;

  const claimedOnEvidenced = weightedMean(evidenced, (d) => d.claimedScore);
  const gap = quality !== null && claimedOnEvidenced !== null ? claimedOnEvidenced - quality : null;

  let decision: Decision = "Gather evidence";
  if (gatePassed && quality !== null) {
    const hiQ = quality >= CUTLINE;
    const hiF = fit >= CUTLINE;
    decision = hiQ && hiF ? "Pursue" : hiQ ? "Refer to co-investors" : hiF ? "Monitor" : "Pass";
  }

  return {
    quality,
    claimedQuality,
    fit,
    coverage,
    gatePassed,
    confidence: coverage >= 6 ? "high" : coverage >= ABSTAIN_MIN ? "medium" : "low",
    gap,
    decision,
    missing: dims.filter((d) => !isEvidenced(d)),
    sourceHitRate: sourceHitRate(deal.referrer.advanced, deal.referrer.referrals),
  };
}
