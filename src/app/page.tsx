import Link from "next/link";
import { DEALS } from "@/data/deals";
import { scoreDeal } from "@/lib/scoring";

const fmt = (n: number | null) => (n === null ? "–" : n.toFixed(1));

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="pt-6">
        <div className="label text-accent">Deal Flow · Diligence track</div>
        <h1 className="mt-3 max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight">
          The diligence agent that <span className="text-accent">refuses to guess.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Drop in a deck and two meeting transcripts. DueDilly&apos;s agents pull independent evidence and show you what the founder
          <span className="text-claim"> claimed</span> versus what we could <span className="text-accent">verify</span>. Thin evidence gets
          &ldquo;Not enough data,&rdquo; not a made-up number.
        </p>
        <div className="mt-6 flex flex-wrap gap-2 font-mono text-[11px] text-muted">
          {["Nicrron LLMs", "akta.pro external data", "Roundtable agent workspace", "PRISM audited"].map((t) => (
            <span key={t} className="rounded-full border border-line px-3 py-1">
              {t}
            </span>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-semibold">Pipeline</h2>
          <span className="font-mono text-xs text-muted">Fictional companies · synthetic data</span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {DEALS.map((deal) => {
            const sc = scoreDeal(deal);
            return (
              <Link key={deal.id} href={`/deal/${deal.id}`} className="glass group block p-5 transition hover:border-accent/60">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-lg font-semibold group-hover:text-accent">{deal.company}</div>
                    <div className="font-mono text-[11px] text-muted">
                      {deal.stage} · {deal.geo}
                    </div>
                  </div>
                  {deal.passHistory && (
                    <span className="rounded border border-mem/40 bg-mem/10 px-1.5 py-0.5 font-mono text-[10px] uppercase text-mem">
                      Resurfaced
                    </span>
                  )}
                </div>
                <p className="mt-3 min-h-[40px] text-sm text-muted">{deal.tagline}</p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg border border-line py-2">
                    <div className="label">Quality</div>
                    <div className={`font-mono text-lg ${sc.gatePassed ? "" : "text-sm leading-7 text-muted"}`}>
                      {sc.gatePassed ? fmt(sc.quality) : "No data"}
                    </div>
                  </div>
                  <div className="rounded-lg border border-line py-2">
                    <div className="label">Fit</div>
                    <div className="font-mono text-lg">{fmt(sc.fit)}</div>
                  </div>
                  <div className="rounded-lg border border-line py-2">
                    <div className="label">Conf.</div>
                    <div className="font-mono text-lg">{sc.coverage}/7</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-muted">Claim gap</span>
                  <span className={`font-mono ${sc.gap !== null && sc.gap >= 2 ? "text-err" : "text-muted"}`}>
                    {sc.gap === null ? "–" : `−${sc.gap.toFixed(1)}`}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="text-muted">Suggested</span>
                  <span className="text-accent">{sc.decision}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
