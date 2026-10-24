export type DimensionKey =
  | "team"
  | "market"
  | "product"
  | "traction"
  | "unitEconomics"
  | "defensibility"
  | "dealRisk";

export const DIMENSIONS: { key: DimensionKey; label: string; short: string }[] = [
  { key: "team", label: "Team", short: "Team" },
  { key: "market", label: "Market & Timing", short: "Market" },
  { key: "product", label: "Product / Insight", short: "Product" },
  { key: "traction", label: "Traction", short: "Traction" },
  { key: "unitEconomics", label: "Unit Economics", short: "Unit Econ" },
  { key: "defensibility", label: "Defensibility", short: "Moat" },
  { key: "dealRisk", label: "Deal Risk (10 = clean)", short: "Deal Risk" },
];

export type EvidenceSource = "deck" | "transcript" | "akta" | "github" | "careers" | "web" | "dataroom";

/** claim = founder self-report; verify / contradict = independent evidence */
export type EvidenceKind = "claim" | "verify" | "contradict";

export interface Evidence {
  source: EvidenceSource;
  kind: EvidenceKind;
  label: string;
  quote?: string;
  url?: string;
}

export interface Dimension {
  key: DimensionKey;
  claimedScore: number | null;
  verifiedScore: number | null;
  evidence: Evidence[];
  reasoning: string;
  missing?: { evidenceToGet: string; question: string };
}

export type LearningClass = "sharpened" | "addressed" | "consistent" | "shifted" | "dropped";

export interface LearningDiffItem {
  topic: string;
  m1: string;
  m3: string | null;
  cls: LearningClass;
  note: string;
}

export type PassTag = "too_early" | "team_gap" | "market_size" | "unit_economics" | "valuation" | "outside_thesis";
export type PassStatus = "resolved" | "unresolved" | "unknown";

export interface PassHistory {
  date: string;
  partner: string;
  reasons: { tag: PassTag; original: string; status: PassStatus; evidence: string }[];
}

export interface RedFlag {
  severity: "high" | "medium" | "low";
  text: string;
  source: string;
}

export interface FitCriterion {
  name: string;
  score: number; // 0-1
  note: string;
}

export interface Deal {
  id: string;
  company: string;
  tagline: string;
  website: string;
  stage: string;
  sector: string;
  geo: string;
  raising: string;
  synthetic: boolean;
  founders: { name: string; role: string; background: string }[];
  referrer: { name: string; type: "person" | "firm" | "accelerator" | "inbound"; referrals: number; advanced: number };
  meetings: { m1: string; m3: string | null };
  dimensions: Dimension[];
  fit: FitCriterion[];
  learningDiff: LearningDiffItem[];
  passHistory: PassHistory | null;
  redFlags: RedFlag[];
  questions: string[];
}
