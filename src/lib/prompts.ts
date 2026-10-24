export const PROMPT_VERSION = "scorer-v2";

const CONTEXT = `You are part of DueDilly, a venture diligence agent team for a seed-stage B2B AI fund (NYC, $1M checks, pre-seed to seed).
Input: a pitch deck, up to two meeting transcripts, and EXTERNAL EVIDENCE gathered by the SCOUT agent (akta.pro company data, news, careers, web).
Be concise. Use plain double-quoted JSON strings; never put unescaped double quotes inside a string. Return JSON only.`;

const DIMENSION_RULES = `Scoring rules:
- claimedScore (0-10): how strong it looks if you believe the deck and founder. null only if the founder says nothing about it.
- verifiedScore (0-10): ONLY from independent evidence (EXTERNAL EVIDENCE, or a later founder admission that contradicts the deck). Deck text and founder self-report are NOT verification.
- UNKNOWN IS NOT ZERO: with no independent evidence, verifiedScore MUST be null. Never guess.
- evidence kind: "claim" (founder said it), "verify" (independent source supports), "contradict" (independent source or later admission contradicts).
- evidence source: one of deck, transcript, akta, web, github, careers, dataroom. label e.g. "Deck", "Meeting 3", "akta.pro news".
- reasoning under 25 words; max 2 evidence items; quotes under 12 words.
- if verifiedScore is null include missing {evidenceToGet, question}, else missing null.
dealRisk: 10 = clean, 0 = very risky.
Item shape: {"key","claimedScore","verifiedScore","reasoning","evidence":[{"source","kind","label","quote"}],"missing"}`;

export const AGENT_TASKS = {
  "SCORER-A": {
    system: `${CONTEXT}\n${DIMENSION_RULES}\nScore exactly these keys: team, market, product, traction.\nReturn {"dimensions":[...4 items]}`,
  },
  "SCORER-B": {
    system: `${CONTEXT}\n${DIMENSION_RULES}\nScore exactly these keys: unitEconomics, defensibility, dealRisk.
Also extract company facts.
Return {"company","tagline" (under 12 words),"stage","sector","geo","raising","founders":[{"name","role","background" (under 12 words)}],"dimensions":[...3 items]}`,
  },
  FOUNDER: {
    system: `${CONTEXT}
Tasks:
1. Founder learning rate: compare meeting 1 vs meeting 3 claims by topic (max 4). cls one of sharpened, addressed, consistent, shifted, dropped. m3 null if dropped. Keep m1/m3 under 15 words, note under 20 words.
2. Red flags (max 5): severity high|medium|low, text under 18 words, source.
3. Diligence questions for the next call (max 4, under 20 words each).
4. Fund fit: exactly 5 criteria (Sector: B2B AI, Stage, Check size $1M fits round, Geography (NYC core), Portfolio conflicts), score 0-1, note under 8 words.
Return {"learningDiff":[{"topic","m1","m3","cls","note"}],"redFlags":[{"severity","text","source"}],"questions":[string],"fit":[{"name","score","note"}]}`,
  },
} as const;

export type AgentId = keyof typeof AGENT_TASKS;

export function dealInput(input: { company: string; website?: string; deck: string; m1?: string; m3?: string; external?: string }) {
  return [
    `COMPANY: ${input.company}${input.website ? ` (${input.website})` : ""}`,
    `=== PITCH DECK ===\n${input.deck}`,
    `=== MEETING 1 TRANSCRIPT ===\n${input.m1?.trim() || "(none)"}`,
    `=== MEETING 3 TRANSCRIPT ===\n${input.m3?.trim() || "(none)"}`,
    `=== EXTERNAL EVIDENCE ===\n${input.external?.trim() || "(none gathered)"}`,
  ].join("\n\n");
}
