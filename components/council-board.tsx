"use client";

import type { CouncilResponse } from "@/lib/council/schema";

type CouncilBoardProps = {
  council: CouncilResponse | null;
  activeTurnIndex: number;
};

export function CouncilBoard({ council, activeTurnIndex }: CouncilBoardProps) {
  if (!council) {
    return (
      <section className="grid min-h-[520px] place-items-center border-b border-zinc-800 bg-black px-4">
        <div className="max-w-xl text-center">
          <p className="text-sm uppercase text-[#ff5c28]">Shop Council</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">
            Furniture decisions, argued out loud.
          </h1>
          <p className="mt-4 text-base leading-7 text-zinc-400">
            Choose a scenario, run the council, and record the verdict.
          </p>
        </div>
      </section>
    );
  }

  const activeTurn = council.debateTurns[activeTurnIndex];
  const activeAgent = council.agents.find((agent) => agent.id === activeTurn?.agentId);
  const activeProduct = council.products.find(
    (product) => product.id === activeTurn?.targetProductId,
  );

  return (
    <section className="border-b border-zinc-800 bg-black">
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[1fr_1.15fr]">
        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase text-[#ff5c28]">Current case</p>
            <h1 className="mt-2 text-2xl font-semibold text-white">
              {council.scenario.title}
            </h1>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              {council.scenario.shopperGoal}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {council.products.map((product) => {
              const isActive = product.id === activeProduct?.id;
              return (
                <article
                  key={product.id}
                  className={`grid grid-cols-[112px_1fr] gap-3 rounded-lg border bg-zinc-950 p-3 ${
                    isActive ? "border-[#ff5c28]" : "border-zinc-800"
                  }`}
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-24 w-28 rounded-md object-cover"
                  />
                  <div className="min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-sm font-semibold text-white">
                        {product.name}
                      </h2>
                      <span className="shrink-0 text-sm font-semibold text-emerald-300">
                        ${product.price}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-zinc-400">
                      {product.dimensions}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-500">
                      {product.reviewSummary}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {product.wayfairSignals.slice(0, 2).map((signal) => (
                        <span
                          key={signal}
                          className="rounded-sm bg-sky-400/15 px-1.5 py-1 text-[11px] text-sky-200"
                        >
                          {signal}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {council.agents.map((agent) => {
              const active = agent.id === activeAgent?.id;
              return (
                <article
                  key={agent.id}
                  className={`rounded-lg border bg-zinc-950 p-3 ${
                    active ? "border-white" : "border-zinc-800"
                  }`}
                >
                  <div
                    className="h-2 w-10 rounded-sm"
                    style={{ backgroundColor: agent.color }}
                  />
                  <h2 className="mt-3 text-sm font-semibold text-white">
                    {agent.name}
                  </h2>
                  <p className="mt-1 text-xs text-zinc-500">{agent.role}</p>
                </article>
              );
            })}
          </div>

          <div className="min-h-[360px] rounded-lg border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase text-zinc-500">Council floor</p>
                <h2 className="mt-1 text-lg font-semibold text-white">
                  {activeAgent?.role ?? "Waiting"}
                </h2>
              </div>
              <div className="text-sm text-zinc-500">
                {Math.min(activeTurnIndex + 1, council.debateTurns.length)} /{" "}
                {council.debateTurns.length}
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {activeProduct && (
                <div className="rounded-lg border border-sky-400/30 bg-sky-400/10 p-3">
                  <p className="text-xs font-semibold uppercase text-sky-200">
                    Wayfair confidence check
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-200">
                    {activeProduct.fitCheck}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-zinc-400">
                    Assembly: {activeProduct.assembly}
                  </p>
                </div>
              )}
              {council.debateTurns.map((turn, index) => {
                const agent = council.agents.find((item) => item.id === turn.agentId);
                const active = index === activeTurnIndex;
                return (
                  <div
                    key={`${turn.agentId}-${index}`}
                    className={`rounded-lg border p-3 transition ${
                      active
                        ? "border-[#ff5c28] bg-[#ff5c28]/10"
                        : "border-zinc-800 bg-black/40 opacity-65"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-sm"
                        style={{ backgroundColor: agent?.color ?? "#ffffff" }}
                      />
                      <span className="text-xs font-semibold uppercase text-zinc-300">
                        {agent?.name ?? turn.agentId}
                      </span>
                      <span className="text-xs text-zinc-600">{turn.emotion}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-zinc-200">
                      {turn.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
