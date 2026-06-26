"use client";

import { CLIENTS } from "@/lib/content";

const items = [
  ...CLIENTS.map((c) => c.name),
  "Setor industrial",
  "Agroindústria",
  "Cooperativas",
  "Obras públicas",
];

export function TrustBar() {
  return (
    <div className="relative border-y border-white/10 bg-ink-950 py-7">
      <div className="container-x mb-5">
        <p className="eyebrow text-center text-white/35">
          A confiança de quem constrói o Sul do Brasil
        </p>
      </div>
      <div className="marquee-paused mask-fade-x overflow-hidden">
        <div className="animate-marquee flex w-max items-center gap-14 pr-14">
          {[...items, ...items].map((label, i) => (
            <span
              key={i}
              className="text-lg font-semibold tracking-tight text-white/45 transition-colors hover:text-white/80"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
