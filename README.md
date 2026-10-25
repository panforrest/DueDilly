# DueDilly

**The diligence agent that refuses to guess.** Built at Deal Flow: NYC's First VC Hackathon (Betaworks, Oct 24, 2026), Diligence track.

Live: https://duedilly.vercel.app

Give DueDilly a pitch deck and two meeting transcripts. Agents extract the founder's claims, check them against independent evidence, and return a Deal Scorecard showing what was **claimed** versus what could be **verified**. When fewer than 4 of 7 dimensions have independent evidence, it shows "Not enough data" and the questions to ask, instead of a made-up number.

## Features

- **Deal Scorecard radar**: 7 fixed spokes on a fixed 0–10 scale, with "as claimed" and "verified" polygons. A dimension with no evidence breaks the polygon (unknown is not zero) and red bars mark claims that don't hold up.
- **Quality, Fit and Confidence** chips. Fund fit is scored separately from merit.
- **Abstain gate** with an email-ready list of missing evidence and questions.
- **Founder learning rate**: meeting 1 vs meeting 3 diff (sharpened, objection addressed, consistent, shifted, dropped).
- **Pass replay**, source quality, red flags, diligence questions.
- **Live analysis** (`/analyze`): three Nicrron agents run in parallel; scores are computed in deterministic TypeScript, and a code guard forces any verified score without independent evidence to null.

## Status

| Integration | Status |
|---|---|
| NicrronNinoo (Nicrron API) | Working: live analysis on `anthropic/claude-haiku-5-5` |
| akta.pro | Not wired yet; external evidence is pasted text |
| PRISM by Block Convey | Not wired yet |
| Roundtable | Not wired yet |

Demo deals (Ledgerline AI, Vibewise, Quietforge, Harborlight) are fictional companies with synthetic data.

## Run locally

```bash
npm install
cp .env.example .env   # add NICRRON_API_KEY
npm run smoke:nicrron  # checks the key and models
npm run dev
```

Design notes: [`docs/TDD.md`](docs/TDD.md).
