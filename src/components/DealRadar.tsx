"use client";

import { DIMENSIONS, type Dimension, type DimensionKey } from "@/lib/types";

const SIZE = 460;
const C = SIZE / 2;
const R = 160;
const MAX = 10;
const N = DIMENSIONS.length;

function point(i: number, value: number) {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / N;
  const r = (value / MAX) * R;
  return { x: C + r * Math.cos(angle), y: C + r * Math.sin(angle) };
}

/** Draws a series where null values break the polygon: only adjacent known points are joined. */
function Series({ values, color, dashed }: { values: (number | null)[]; color: string; dashed?: boolean }) {
  const parts: JSX.Element[] = [];
  values.forEach((v, i) => {
    const j = (i + 1) % N;
    const w = values[j];
    if (v === null || w === null) return;
    const a = point(i, v);
    const b = point(j, w);
    parts.push(
      <g key={i}>
        <polygon points={`${C},${C} ${a.x},${a.y} ${b.x},${b.y}`} fill={color} fillOpacity={dashed ? 0.06 : 0.16} />
        <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={color} strokeWidth={2.2} strokeDasharray={dashed ? "6 5" : undefined} />
      </g>,
    );
  });
  values.forEach((v, i) => {
    if (v === null) return;
    const p = point(i, v);
    parts.push(<circle key={`p${i}`} cx={p.x} cy={p.y} r={4} fill={color} stroke="#070B14" strokeWidth={1.5} />);
  });
  return <g>{parts}</g>;
}

export default function DealRadar({
  dimensions,
  active,
  onActive,
}: {
  dimensions: Dimension[];
  active: DimensionKey | null;
  onActive: (k: DimensionKey) => void;
}) {
  const claimed = dimensions.map((d) => d.claimedScore);
  const verified = dimensions.map((d) => d.verifiedScore);

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-auto w-full max-w-[520px]" role="img" aria-label="Deal scorecard radar chart">
      {[2, 4, 6, 8, 10].map((ring) => (
        <polygon
          key={ring}
          points={DIMENSIONS.map((_, i) => {
            const p = point(i, ring);
            return `${p.x},${p.y}`;
          }).join(" ")}
          fill="none"
          stroke="#1E2A44"
          strokeWidth={ring === 10 ? 1.5 : 1}
        />
      ))}
      {[2, 4, 6, 8, 10].map((ring) => {
        const p = point(0, ring);
        return (
          <text key={`t${ring}`} x={p.x + 6} y={p.y + 3} fontSize={9} fill="#56627E" fontFamily="var(--font-geist-mono)">
            {ring}
          </text>
        );
      })}

      {DIMENSIONS.map((meta, i) => {
        const end = point(i, MAX);
        const isActive = active === meta.key;
        return (
          <line
            key={meta.key}
            x1={C}
            y1={C}
            x2={end.x}
            y2={end.y}
            stroke={isActive ? "#3EE8FF" : "#1E2A44"}
            strokeWidth={isActive ? 1.5 : 1}
          />
        );
      })}

      {/* claim gaps: red segment where the claim exceeds verification by 2+ points */}
      {dimensions.map((d, i) => {
        if (d.claimedScore === null || d.verifiedScore === null || d.claimedScore - d.verifiedScore < 2) return null;
        const a = point(i, d.verifiedScore);
        const b = point(i, d.claimedScore);
        return <line key={`gap${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#FF4D6A" strokeWidth={5} strokeOpacity={0.55} strokeLinecap="round" />;
      })}

      <Series values={claimed} color="#FFB547" dashed />
      <Series values={verified} color="#3EE8FF" />

      {/* unknown markers */}
      {dimensions.map((d, i) => {
        if (d.verifiedScore !== null) return null;
        const p = point(i, 5);
        return (
          <g key={`u${i}`}>
            <circle cx={p.x} cy={p.y} r={11} fill="#070B14" stroke="#8A97B4" strokeDasharray="3 3" />
            <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize={12} fill="#8A97B4" fontFamily="var(--font-geist-mono)">
              ?
            </text>
          </g>
        );
      })}

      {DIMENSIONS.map((meta, i) => {
        const lp = point(i, MAX + 1.9);
        const d = dimensions[i];
        const isActive = active === meta.key;
        const end = point(i, MAX);
        return (
          <g key={`l${meta.key}`} onMouseEnter={() => onActive(meta.key)} onClick={() => onActive(meta.key)} className="cursor-pointer">
            <line x1={C} y1={C} x2={end.x} y2={end.y} stroke="transparent" strokeWidth={28} />
            <text
              x={lp.x}
              y={lp.y}
              textAnchor="middle"
              fontSize={12.5}
              fontWeight={600}
              fill={isActive ? "#3EE8FF" : "#C9D4EA"}
            >
              {meta.short}
            </text>
            <text x={lp.x} y={lp.y + 15} textAnchor="middle" fontSize={11} fontFamily="var(--font-geist-mono)" fill="#8A97B4">
              {d.claimedScore ?? "–"} → {d.verifiedScore ?? "?"}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
