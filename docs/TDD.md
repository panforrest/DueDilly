# DueDilly — Technical Design (Cursor build)

**DueDilly is the diligence agent that refuses to guess.** Give it a deck and two meeting transcripts; agents gather independent evidence and return a Deal Scorecard showing what the founder *claimed* versus what we could *verify*. When evidence is thin, it says "Not enough data" instead of inventing a number.

Track: Diligence. Sponsor awards: Best Use of External Data (akta.pro), PRISM challenge.
Adapted from the Kosa TDD (Lovable + Supabase) for a Cursor-built Next.js app on Vercel.

## 1. Goals (v1, demo)

- Deal Scorecard: radar chart with **claimed** vs **verified** polygons over 7 fixed dimensions.
- Separate **Quality** (merit), **Fit** (fund thesis) and **Confidence** (evidence coverage).
- **Abstain gate**: fewer than 4 of 7 dimensions evidenced → "Not enough data" + questions to ask.
- **Founder learning rate**: meeting 1 vs meeting 3 claim diff.
- **Pass replay**: prior pass reasons shown as resolved / unresolved / unknown.
- Every score cites evidence; every run traced in PRISM.

Non-goals: auth, database, CRM, outreach, investment decisions (humans decide).

## 2. Architecture

| Component | Technology | Responsibility |
|---|---|---|
| Frontend | Next.js 14 App Router, TypeScript, Tailwind, Recharts, Framer Motion | Pages, scorecard, animated workflow, 2D agent graph |
| API | Next.js route handlers (Node runtime) on Vercel | Runs the agent pipeline; keys stay server-side |
| Event stream | Server-Sent Events from `/api/run` | Replaces Supabase Realtime; same event contract |
| LLM | **Nicrron** (NicrronNinoo) via OpenAI-compatible adapter | Claim extraction, dimension scoring, diffs, memo |
| External data | **akta.pro** REST API | Company, funding, headcount, news, signals → verified scores |
| Agent coordination | **Roundtable** SDK | Agents hand tasks to each other; memo saved as versioned file |
| Observability / evals | **PRISM** (`prismtrace-sdk`, Python harness; OTel from Node if feasible) | Traces, rule checks, v1 vs v2 comparison |
| Data | JSON files in `src/data/` | 3 precomputed synthetic demo deals |

## 3. Agents

| Agent | Job | Tools | Output |
|---|---|---|---|
| ORCHESTRATOR | Plans run, dispatches, emits stage events | Roundtable | events |
| INTAKE | Deck + transcripts → atomic typed claims | Nicrron | `claims[]` |
| SCOUT | Pulls independent evidence | akta.pro | `signals[]` |
| FOUNDER | Meeting 1 vs meeting 3 learning-rate diff | Nicrron | `learningDiff[]` |
| VERIFIER | Claims vs signals → verified / contradicted / unverifiable, red flags | Nicrron | `verifications[]`, `redFlags[]` |
| SCORER | Gate, Quality, Fit, Confidence (deterministic code) | — | `scorecard` |
| AUDITOR | Sends run to PRISM | PRISM | audit status |

Run order: INTAKE → (SCOUT ∥ FOUNDER) → VERIFIER → SCORER → AUDITOR.

Design rules (from Kosa):
- **Scores are computed in code, not by the LLM.** LLMs extract evidence and assign 0–10 sub-scores against written anchors; weights, gate and totals are deterministic TypeScript.
- **Every judgment cites evidence.** A dimension without evidence is `null`, never defaulted.
- **Structured JSON outputs**, temperature 0, prompt version stamped on every result.

Event contract (feeds workflow + agent graph):
`{ runId, ts, type: msg|spawn|retire|status|task|log, from, to, kind: cmd|comm|mem|tool|ok|err, stage, note }`

## 4. Scoring model

Dimensions (fixed order, never sorted): Team, Market, Product/Insight, Traction, Unit Economics, Defensibility, Deal Risk.

Per dimension:
```ts
{ name, claimedScore: number|null, verifiedScore: number|null,
  evidence: { source, quote?, url? }[], reasoning }
```

- Scale fixed 0–10 on every deal; no auto-scaling.
- Unknown is not zero: `null` breaks the polygon.
- **Quality** = weighted mean of verified scores over evidenced dimensions, weights re-normalized (seed weights from research brief: team 30, market 20, product 15, traction 15, unit econ 5, defensibility 10, deal risk 5).
- **Fit** = thesis match (sector, stage, check size, geography), scored separately, never mixed into Quality.
- **Confidence** = evidenced dimensions / 7. Below 4 → abstain.
- Decision grid: Quality and Fit cut lines at 6.5 → Pursue / Refer / Monitor / Pass.

Learning-rate classes: sharpened (+), objection addressed (++), consistent (0), shifted without explanation (flag), dropped (flag).

## 5. Screens

Design: dark command center — bg `#070B14`, glass cards `rgba(14,22,38,0.72)` + 12px blur + `#1E2A44` border, accent `#3EE8FF`; event colors cmd `#DFF4FF`, comm `#3EE8FF`, mem `#A77BFF`, tool `#FFB547`, ok `#4DFF9A`, err `#FF4D6A`. Memo uses light reading mode `#F7F7F4`.

| Route | Content |
|---|---|
| `/` | Hero, 3 demo deal cards (strong, inflated claims, thin evidence), new deal form |
| `/deal/[id]/run` | Animated pipeline stages + 2D agent graph + live event log |
| `/deal/[id]` | Scorecard: chips, dual radar, spoke hover evidence, learning diff, pass replay, red flags |
| `/deal/[id]/memo` | IC memo, export Markdown / print PDF |

## 6. PRISM challenge

Rule: **"Unknown is not zero — never output a dimension score without at least one cited evidence item."**
- v1 scorer prompt: always scores all 7 dimensions (breaks the rule on thin deals).
- v2 scorer prompt: returns `null` when no evidence.
- Harness runs both on the same fixed inputs (20+ runs each), traced to PRISM; rule added via PRISM MCP.

## 7. Security

- Keys only in `.env` (gitignored) and Vercel env vars; browser never calls providers directly.
- Only public or synthetic data; demo companies are fictional.
