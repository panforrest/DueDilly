import type { Deal } from "@/lib/types";

/** Fictional companies and people. Synthetic demo data only. */
export const DEALS: Deal[] = [
  {
    id: "ledgerline",
    company: "Ledgerline AI",
    tagline: "Autonomous month-end close for mid-market finance teams",
    website: "ledgerline.example",
    stage: "Seed",
    sector: "B2B AI / Fintech",
    geo: "New York, NY",
    raising: "$3M at $18M post",
    synthetic: true,
    founders: [
      { name: "Dana Okoro", role: "CEO", background: "6 yrs as controller at a public AP-automation company" },
      { name: "Sam Lindqvist", role: "CTO", background: "Staff engineer, bank-data API platform; top contributor on core repo" },
      { name: "Priya Raman", role: "COO", background: "Former Big Four audit manager" },
    ],
    referrer: { name: "Maya Chen (angel, ex-fintech operator)", type: "person", referrals: 8, advanced: 4 },
    meetings: { m1: "Aug 14, 2026", m3: "Oct 9, 2026" },
    dimensions: [
      {
        key: "team",
        claimedScore: 9,
        verifiedScore: 8,
        reasoning:
          "Three co-founders covering build, sell and audit. Founder-market fit is direct: the CEO ran month-end close for 6 years. Backgrounds independently confirmed.",
        evidence: [
          { source: "deck", kind: "claim", label: "Deck p.3", quote: "CEO ran close for a $400M-revenue public company; CTO built bank-data infra." },
          { source: "akta", kind: "verify", label: "akta.pro people data", quote: "Founder employment histories match deck (2017–2023, 2019–2024)." },
          { source: "github", kind: "verify", label: "GitHub ledgerline/core", quote: "CTO authored 61% of commits in last 90 days; founders build the product." },
        ],
      },
      {
        key: "market",
        claimedScore: 8,
        verifiedScore: 7,
        reasoning: "Bottom-up sizing is credible. Category is heating up (more competitors funded), which validates demand but compresses the window.",
        evidence: [
          { source: "deck", kind: "claim", label: "Deck p.6", quote: "38k US companies at $50–500M revenue × $24k ACV = $912M SAM." },
          { source: "akta", kind: "verify", label: "akta.pro market signals", quote: "Category funding up 3.1x YoY; 4 close-automation startups raised in the last 12 months." },
        ],
      },
      {
        key: "product",
        claimedScore: 8,
        verifiedScore: 8,
        reasoning: "Live product with public docs and a security page. Customer quote in meeting 3 matches the claimed time savings.",
        evidence: [
          { source: "deck", kind: "claim", label: "Deck p.4", quote: "Close in 2 days instead of 9." },
          { source: "web", kind: "verify", label: "Website + docs", quote: "Public API docs, changelog updated weekly, SOC 2 Type I badge." },
          { source: "transcript", kind: "claim", label: "Meeting 3 · 14:20", quote: "Our design partner's controller said they closed September in 2.5 days." },
        ],
      },
      {
        key: "traction",
        claimedScore: 8,
        verifiedScore: 7,
        reasoning: "Revenue export confirms run-rate within 6% of the deck. Headcount growth and open sales roles corroborate a real GTM push.",
        evidence: [
          { source: "deck", kind: "claim", label: "Deck p.8", quote: "$1.1M ARR, 31 paying customers." },
          { source: "dataroom", kind: "verify", label: "Data room revenue export", quote: "$1.04M annualized run-rate across 29 active subscriptions." },
          { source: "akta", kind: "verify", label: "akta.pro headcount", quote: "Headcount 14, up 40% in 6 months; 3 named customer case studies." },
          { source: "careers", kind: "verify", label: "Careers page", quote: "2 Account Executive roles open, 1 Solutions Engineer." },
        ],
      },
      {
        key: "unitEconomics",
        claimedScore: 6,
        verifiedScore: 6,
        reasoning: "Inference-adjusted gross margin of ~71% is above the ~55% median for AI B2B under $10M ARR, and cost per close is trending down.",
        evidence: [
          { source: "deck", kind: "claim", label: "Deck p.9", quote: "Gross margin 71% including inference and hosting." },
          { source: "dataroom", kind: "verify", label: "Data room P&L", quote: "COGS line includes model spend ($38 per close, down from $61)." },
        ],
      },
      {
        key: "defensibility",
        claimedScore: 7,
        verifiedScore: 6,
        reasoning: "ERP integrations and labeled close data create workflow lock-in. Not yet a data moat at 31 customers.",
        evidence: [
          { source: "deck", kind: "claim", label: "Deck p.10", quote: "Proprietary dataset of 40k labeled reconciliations." },
          { source: "github", kind: "verify", label: "GitHub SDK", quote: "14 ERP connectors maintained in the public SDK." },
        ],
      },
      {
        key: "dealRisk",
        claimedScore: 7,
        verifiedScore: 7,
        reasoning: "Clean cap table, one prior priced pre-seed, IP assigned. Valuation in range for seed AI B2B.",
        evidence: [
          { source: "deck", kind: "claim", label: "Deck p.12", quote: "$3M at $18M post; clean cap table." },
          { source: "akta", kind: "verify", label: "akta.pro funding history", quote: "$1.2M pre-seed (2025) led by a NYC pre-seed fund; no other rounds." },
        ],
      },
    ],
    fit: [
      { name: "Sector: B2B AI", score: 1, note: "Core thesis" },
      { name: "Stage: Seed", score: 1, note: "Core stage" },
      { name: "Check size $1M fits round", score: 1, note: "33% of round" },
      { name: "Geography", score: 1, note: "NYC" },
      { name: "Portfolio conflicts", score: 0.8, note: "Adjacent to one AP tool, not competing" },
    ],
    learningDiff: [
      {
        topic: "Market size",
        m1: "Every company has to close its books, so the market is huge.",
        m3: "38k US companies at $50–500M revenue, $24k ACV, 120 in active pipeline.",
        cls: "sharpened",
        note: "Vague top-down claim became a bottom-up count with a named pipeline.",
      },
      {
        topic: "Inference cost (partner objection)",
        m1: "$61 of model spend per close.",
        m3: "$38 per close after routing 70% of steps to a smaller fine-tuned model.",
        cls: "addressed",
        note: "Objection raised in meeting 1 came back with a changed architecture and evidence.",
      },
      {
        topic: "ARR",
        m1: "$0.9M ARR",
        m3: "$1.1M ARR",
        cls: "consistent",
        note: "+22% over 8 weeks matches the ~10% MoM growth stated in meeting 1.",
      },
      {
        topic: "Customers",
        m1: "24 customers",
        m3: "31 customers, 2 churned (both under 50 employees)",
        cls: "sharpened",
        note: "Volunteered churn unprompted: a candor signal.",
      },
    ],
    passHistory: {
      date: "Mar 2026",
      partner: "J. Rivera",
      reasons: [
        { tag: "too_early", original: "$90k ARR, 4 design partners", status: "resolved", evidence: "$1.04M run-rate verified in data room." },
        { tag: "team_gap", original: "No go-to-market leader", status: "resolved", evidence: "akta.pro: VP Sales hired Aug 2026 from a scaled spend-management company." },
      ],
    },
    redFlags: [
      { severity: "low", text: "SOC 2 Type II not complete; enterprise deals may stall.", source: "Website security page" },
      { severity: "low", text: "Top customer is 18% of revenue (below the 30% concern line).", source: "Data room revenue export" },
    ],
    questions: [
      "What happens to gross margin when you move upmarket to $500M+ revenue customers?",
      "Why did the two churned customers leave, and is there a size floor?",
      "When does SOC 2 Type II land?",
    ],
  },

  {
    id: "vibewise",
    company: "Vibewise",
    tagline: "Autonomous AI agents that run store operations for retail chains",
    website: "vibewise.example",
    stage: "Seed",
    sector: "B2B AI / Retail",
    geo: "Austin, TX",
    raising: "$6M at $40M post",
    synthetic: true,
    founders: [
      { name: "Blake Harmon", role: "CEO", background: "Former retail consultant; prior startup shut down 2024" },
      { name: "Leo Varga", role: "CTO", background: "Freelance ML engineer" },
    ],
    referrer: { name: "Inbound (cold email)", type: "inbound", referrals: 40, advanced: 2 },
    meetings: { m1: "Aug 28, 2026", m3: "Oct 2, 2026" },
    dimensions: [
      {
        key: "team",
        claimedScore: 8,
        verifiedScore: 5,
        reasoning: "Deck claims a 25-person team from big tech. Public data shows 9 people, 2 of them engineers. No engineering roles posted.",
        evidence: [
          { source: "deck", kind: "claim", label: "Deck p.2", quote: "Team of 25 from top tech companies." },
          { source: "akta", kind: "contradict", label: "akta.pro headcount", quote: "9 employees on public profiles; 2 engineering titles." },
          { source: "careers", kind: "contradict", label: "Careers page", quote: "3 open roles, all sales. No engineering openings." },
        ],
      },
      {
        key: "market",
        claimedScore: 8,
        verifiedScore: 6,
        reasoning: "Top-down $400B TAM. Meeting 3 sharpened to 1,200 regional chains, but the space is crowded with well-funded players.",
        evidence: [
          { source: "deck", kind: "claim", label: "Deck p.5", quote: "$400B retail operations TAM." },
          { source: "akta", kind: "verify", label: "akta.pro competitive landscape", quote: "11 funded competitors; 2 have raised $100M+." },
        ],
      },
      {
        key: "product",
        claimedScore: 7,
        verifiedScore: 4,
        reasoning: "\"Fully autonomous\" is contradicted by the founder's own meeting 3 admission of human review. No public docs; changelog stale.",
        evidence: [
          { source: "deck", kind: "claim", label: "Deck p.4", quote: "Fully autonomous agents live in 300 stores." },
          { source: "web", kind: "contradict", label: "Website", quote: "Demo video only; changelog last updated Jun 2026." },
          { source: "transcript", kind: "contradict", label: "Meeting 3 · 22:05", quote: "Our ops team spot-checks agent actions before they go out." },
        ],
      },
      {
        key: "traction",
        claimedScore: 9,
        verifiedScore: 3,
        reasoning: "$2.4M ARR claim cannot be tied to any verifiable customer. The only public signal is a single regional pilot. Founder admitted ARR annualizes the best week.",
        evidence: [
          { source: "deck", kind: "claim", label: "Deck p.7", quote: "$2.4M ARR, 300 stores." },
          { source: "akta", kind: "contradict", label: "akta.pro news", quote: "Only press: 'pilot with a regional grocer' (Apr 2026). No customer logos verifiable." },
          { source: "transcript", kind: "contradict", label: "Meeting 3 · 31:40", quote: "We annualized our strongest week in September." },
        ],
      },
      {
        key: "unitEconomics",
        claimedScore: 7,
        verifiedScore: null,
        reasoning: "80% gross margin claim excludes inference and human review. No data room provided, so this stays unknown — not zero.",
        evidence: [{ source: "deck", kind: "claim", label: "Deck p.9", quote: "80% gross margin." }],
        missing: {
          evidenceToGet: "P&L with inference and human-review cost in COGS",
          question: "What is gross margin after model spend and the ops team that reviews agent actions?",
        },
      },
      {
        key: "defensibility",
        claimedScore: 6,
        verifiedScore: 3,
        reasoning: "Claimed proprietary data moat; the public repo is a lightly modified fork of an open-source agent framework.",
        evidence: [
          { source: "deck", kind: "claim", label: "Deck p.10", quote: "Proprietary store-ops data moat." },
          { source: "github", kind: "contradict", label: "GitHub vibewise/agent", quote: "Fork of an open-source agent framework; 3 commits in 90 days." },
        ],
      },
      {
        key: "dealRisk",
        claimedScore: 6,
        verifiedScore: 4,
        reasoning: "Valuation up 60% since last pass with weaker evidence. Four SAFEs with stacked discounts.",
        evidence: [
          { source: "deck", kind: "claim", label: "Deck p.12", quote: "$6M at $40M post." },
          { source: "akta", kind: "verify", label: "akta.pro funding history", quote: "4 SAFE financings since 2024; no priced round." },
        ],
      },
    ],
    fit: [
      { name: "Sector: B2B AI", score: 1, note: "In thesis" },
      { name: "Stage: Seed", score: 1, note: "In stage" },
      { name: "Check size $1M fits round", score: 0.7, note: "Small slice of a $6M round" },
      { name: "Geography", score: 0.6, note: "Austin, outside core NYC" },
      { name: "Portfolio conflicts", score: 0.4, note: "Overlaps a portfolio store-analytics company" },
    ],
    learningDiff: [
      {
        topic: "ARR",
        m1: "$1.2M ARR",
        m3: "$2.4M ARR",
        cls: "shifted",
        note: "Doubled in 5 weeks with no explanation. When pressed: 'we annualized our best week.'",
      },
      {
        topic: "Top-10 grocer LOI",
        m1: "Signed LOI with a top-10 US grocer.",
        m3: null,
        cls: "dropped",
        note: "Headline claim from meeting 1 silently disappeared. Ask directly.",
      },
      {
        topic: "Automation",
        m1: "Fully autonomous. Zero humans in the loop.",
        m3: "Ops team spot-checks agent actions before they go out.",
        cls: "shifted",
        note: "Hidden human labor. Human-in-the-loop ratio unknown.",
      },
      {
        topic: "Market",
        m1: "$400B TAM.",
        m3: "Targeting 1,200 regional chains with 50+ stores.",
        cls: "sharpened",
        note: "Moved from top-down to a bottom-up target list.",
      },
    ],
    passHistory: {
      date: "Jan 2026",
      partner: "A. Okafor",
      reasons: [
        { tag: "unit_economics", original: "Margin hid human review costs", status: "unresolved", evidence: "Still no inference-adjusted margin; meeting 3 confirms human review." },
        { tag: "valuation", original: "Asked $25M post", status: "unresolved", evidence: "Now asking $40M post with weaker verified traction." },
      ],
    },
    redFlags: [
      { severity: "high", text: "ARR doubled between meetings; founder annualized a peak week.", source: "Meeting 1 vs Meeting 3" },
      { severity: "high", text: "Team size claim of 25 vs 9 verified.", source: "Deck p.2 vs akta.pro" },
      { severity: "medium", text: "'Fully autonomous' contradicted by human review admission.", source: "Meeting 3 · 22:05" },
      { severity: "medium", text: "Four SAFEs with stacked discounts.", source: "akta.pro funding history" },
      { severity: "low", text: "TAM is top-down with no bottom-up check in the deck.", source: "Deck p.5" },
    ],
    questions: [
      "Can you share monthly revenue by customer for the last 6 months?",
      "What happened to the top-10 grocer LOI from our first meeting?",
      "What share of agent actions need human review today, and what does that cost?",
      "Can we speak to two paying customers this week?",
    ],
  },

  {
    id: "quietforge",
    company: "Quietforge",
    tagline: "Stealth test harness for AI agents in production",
    website: "quietforge.example",
    stage: "Pre-seed",
    sector: "Developer tools / AI infra",
    geo: "San Francisco, CA",
    raising: "$1.5M SAFE",
    synthetic: true,
    founders: [
      { name: "Mina Castillo", role: "CEO", background: "Eval lead at an AI lab" },
      { name: "Theo Park", role: "CTO", background: "SRE, large cloud provider" },
    ],
    referrer: { name: "Accelerator demo day", type: "accelerator", referrals: 12, advanced: 3 },
    meetings: { m1: "Oct 16, 2026", m3: null },
    dimensions: [
      {
        key: "team",
        claimedScore: 8,
        verifiedScore: 7,
        reasoning: "Strong technical founders with direct domain experience. Backgrounds confirmed.",
        evidence: [
          { source: "deck", kind: "claim", label: "Deck p.2", quote: "Ex-eval lead at a frontier lab + cloud SRE." },
          { source: "akta", kind: "verify", label: "akta.pro people data", quote: "Employment histories confirmed." },
        ],
      },
      {
        key: "market",
        claimedScore: 7,
        verifiedScore: null,
        reasoning: "Only a deck claim. No independent signal on how many teams run agents in production.",
        evidence: [{ source: "deck", kind: "claim", label: "Deck p.5", quote: "Every company shipping agents needs this." }],
        missing: {
          evidenceToGet: "Bottom-up count of teams running agents in production",
          question: "How many of your design partners run agents in production today, and how many tests do they run per week?",
        },
      },
      {
        key: "product",
        claimedScore: 8,
        verifiedScore: 6,
        reasoning: "Public repo shows real engineering progress. No live product yet.",
        evidence: [
          { source: "deck", kind: "claim", label: "Deck p.4", quote: "Replay any agent run against new model versions." },
          { source: "github", kind: "verify", label: "GitHub quietforge/harness", quote: "412 commits from 3 contributors in 60 days." },
        ],
      },
      {
        key: "traction",
        claimedScore: 6,
        verifiedScore: null,
        reasoning: "'40 design partners' is self-reported with no names, LOIs or usage data.",
        evidence: [{ source: "deck", kind: "claim", label: "Deck p.7", quote: "40 design partners." }],
        missing: {
          evidenceToGet: "Design partner names, LOIs, or usage logs",
          question: "Can we speak with two design partners this week?",
        },
      },
      {
        key: "unitEconomics",
        claimedScore: null,
        verifiedScore: null,
        reasoning: "No pricing or cost data.",
        evidence: [],
        missing: {
          evidenceToGet: "Compute cost per test run and planned pricing",
          question: "What does one replay run cost you in compute, and how will you price it?",
        },
      },
      {
        key: "defensibility",
        claimedScore: 7,
        verifiedScore: null,
        reasoning: "Claims a dataset of failure traces; nothing independent yet.",
        evidence: [{ source: "deck", kind: "claim", label: "Deck p.9", quote: "Largest corpus of agent failure traces." }],
        missing: {
          evidenceToGet: "Size and source of the failure-trace corpus",
          question: "Where do the failure traces come from, and do you have rights to train on them?",
        },
      },
      {
        key: "dealRisk",
        claimedScore: 6,
        verifiedScore: 5,
        reasoning: "Recently incorporated, no prior funding. Standard post-money SAFE.",
        evidence: [
          { source: "deck", kind: "claim", label: "Deck p.11", quote: "$1.5M post-money SAFE, $12M cap." },
          { source: "akta", kind: "verify", label: "akta.pro company record", quote: "Delaware C-Corp, 2026; no prior financings." },
        ],
      },
    ],
    fit: [
      { name: "Sector: B2B AI", score: 0.6, note: "Dev tools, adjacent to thesis" },
      { name: "Stage", score: 0.8, note: "Pre-seed, slightly early" },
      { name: "Check size $1M fits round", score: 1, note: "Could lead" },
      { name: "Geography", score: 0.6, note: "SF" },
      { name: "Portfolio conflicts", score: 1, note: "None" },
    ],
    learningDiff: [],
    passHistory: null,
    redFlags: [{ severity: "low", text: "Traction is entirely self-reported.", source: "Deck p.7" }],
    questions: [
      "How many of your design partners run agents in production today?",
      "Can we speak with two design partners this week?",
      "What does one replay run cost in compute?",
    ],
  },
];

export function getDeal(id: string): Deal | undefined {
  return DEALS.find((d) => d.id === id);
}
