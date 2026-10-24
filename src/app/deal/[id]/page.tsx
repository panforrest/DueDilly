import Link from "next/link";
import { notFound } from "next/navigation";
import Scorecard from "@/components/Scorecard";
import { DEALS, getDeal } from "@/data/deals";

export function generateStaticParams() {
  return DEALS.map((d) => ({ id: d.id }));
}

export default function DealPage({ params }: { params: { id: string } }) {
  const deal = getDeal(params.id);
  if (!deal) notFound();
  return (
    <div className="space-y-4">
      <Link href="/" className="text-sm text-muted hover:text-accent">
        ← All deals
      </Link>
      <Scorecard deal={deal} />
    </div>
  );
}
