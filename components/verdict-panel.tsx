"use client";

import type { CouncilResponse } from "@/lib/council/schema";

type VerdictPanelProps = {
  council: CouncilResponse | null;
};

export function VerdictPanel({ council }: VerdictPanelProps) {
  if (!council) return null;

  const winner = council.products.find(
    (product) => product.id === council.verdict.winnerProductId,
  );

  return (
    <section className="bg-zinc-950">
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[0.8fr_1fr]">
        <article className="rounded-lg border border-[#ff5c28] bg-black p-4">
          <p className="text-xs uppercase text-[#ff5c28]">Final verdict</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            {council.verdict.headline}
          </h2>
          <div className="mt-4 flex items-end gap-3">
            <div className="text-5xl font-semibold text-white">
              {council.verdict.confidence}
            </div>
            <div className="pb-2 text-sm text-zinc-500">confidence</div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-sm bg-zinc-800">
            <div
              className="h-full bg-emerald-400"
              style={{ width: `${council.verdict.confidence}%` }}
            />
          </div>
          {winner && (
            <div className="mt-5 grid grid-cols-[116px_1fr] gap-3">
              <img
                src={winner.imageUrl}
                alt={winner.name}
                className="h-24 w-28 rounded-md object-cover"
              />
              <div>
                <h3 className="text-base font-semibold text-white">{winner.name}</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  ${winner.price} - {winner.dimensions}
                </p>
                <p className="mt-2 text-xs leading-5 text-zinc-500">
                  {winner.material}
                </p>
                <p className="mt-2 text-xs leading-5 text-sky-200">
                  {winner.fitCheck}
                </p>
              </div>
            </div>
          )}
        </article>

        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-lg border border-zinc-800 bg-black p-4">
            <h3 className="text-sm font-semibold uppercase text-emerald-300">
              Why it wins
            </h3>
            <ul className="mt-3 space-y-3">
              {council.verdict.reasons.map((reason) => (
                <li key={reason} className="text-sm leading-6 text-zinc-300">
                  {reason}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-lg border border-zinc-800 bg-black p-4">
            <h3 className="text-sm font-semibold uppercase text-sky-300">
              Wayfair checks
            </h3>
            <ul className="mt-3 space-y-3">
              {[...(winner?.wayfairSignals ?? []), ...(winner?.trustSignals ?? [])]
                .slice(0, 5)
                .map((signal) => (
                  <li key={signal} className="text-sm leading-6 text-zinc-300">
                    {signal}
                  </li>
                ))}
            </ul>
          </article>

          <article className="rounded-lg border border-zinc-800 bg-black p-4 md:col-span-2">
            <h3 className="text-sm font-semibold uppercase text-amber-300">
              Caveats
            </h3>
            <ul className="mt-3 grid gap-3 md:grid-cols-2">
              {council.verdict.caveats.map((caveat) => (
                <li key={caveat} className="text-sm leading-6 text-zinc-300">
                  {caveat}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
