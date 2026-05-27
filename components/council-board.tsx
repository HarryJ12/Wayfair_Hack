"use client";

import type { FormEvent } from "react";
import { useEffect, useRef } from "react";
import type { CouncilResponse } from "@/lib/council/schema";

type CouncilBoardProps = {
  council: CouncilResponse | null;
  activeTurnIndex: number;
  chimeText?: string;
  isChiming?: boolean;
  quickChimes?: string[];
  onChimeTextChange?: (value: string) => void;
  onChimeSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  onQuickChime?: (message: string) => void;
};

export function CouncilBoard({
  council,
  activeTurnIndex,
  chimeText = "",
  isChiming = false,
  quickChimes = [],
  onChimeTextChange,
  onChimeSubmit,
  onQuickChime,
}: CouncilBoardProps) {
  const transcriptRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const transcript = transcriptRef.current;
    if (!transcript) return;

    transcript.scrollTo({
      top: transcript.scrollHeight,
      behavior: "smooth",
    });
  }, [activeTurnIndex, council?.debateTurns.length]);

  if (!council) {
    return (
      <section className="grid min-h-[520px] place-items-center border-b border-zinc-800 bg-black px-4">
        <div className="max-w-xl text-center">
          <p className="text-sm uppercase text-[#d8b4fe]">Shop Council</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">
            Furniture decisions, argued out loud.
          </h1>
          <p className="mt-4 text-base leading-7 text-zinc-400">
            Paste a Wayfair link, set the goal, and let the agents argue while you interrupt.
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
  const visibleTurns = council.debateTurns.slice(0, activeTurnIndex + 1);
  const chatTurns = visibleTurns;
  const latestTurnByAgent = new Map(
    visibleTurns.map((turn) => [turn.agentId, turn.text]),
  );
  const isShopperTurn = activeTurn?.agentId === "shopper";
  const activeSpeakerName = isShopperTurn
    ? "You"
    : activeAgent?.name ?? "Council";
  const activeSpeakerRole = isShopperTurn
    ? "Shopper interruption"
    : activeAgent?.role ?? "Waiting";
  const activeSpeakerColor = isShopperTurn
    ? "#ffffff"
    : activeAgent?.color ?? "#ffffff";

  return (
    <section className="border-b border-zinc-800 bg-black">
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[0.95fr_1.2fr]">
        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase text-[#d8b4fe]">Sofa options</p>
            <h1 className="mt-2 text-2xl font-semibold text-white">
              Blue sofas from Wayfair
            </h1>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              {council.scenario.shopperGoal}
            </p>
          </div>

          <div className="grid max-h-[390px] gap-3 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-1">
            {council.products.map((product) => {
              const isActive = product.id === activeProduct?.id;
              return (
                <article
                  key={product.id}
                  className={`grid grid-cols-[112px_1fr] gap-3 rounded-lg border bg-zinc-950 p-3 ${
                    isActive ? "border-[#7f187f]" : "border-zinc-800"
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
                      <span className="shrink-0 text-sm font-semibold text-white">
                      ${product.price}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-zinc-400">
                      {product.dimensions} · {product.delivery}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-500">
                      {product.reviewSummary}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {product.wayfairSignals.slice(0, 2).map((signal) => (
                        <span
                          key={signal}
                          className="rounded-sm bg-[#7f187f]/20 px-1.5 py-1 text-[11px] text-white"
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

          <div className="h-[320px] overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
            <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2">
              <p className="text-xs font-semibold uppercase text-zinc-500">
                Conversation
              </p>
              <p className="text-xs text-zinc-600">Live thread</p>
            </div>
            <div
              ref={transcriptRef}
              className="h-[278px] space-y-3 overflow-y-auto px-3 py-3"
            >
              {chatTurns.length === 0 ? (
                <p className="text-sm leading-6 text-zinc-500">
                  The first exchange is starting.
                </p>
              ) : (
                chatTurns.map((turn, index) => {
                  const agent = council.agents.find(
                    (item) => item.id === turn.agentId,
                  );
                  const shopper = turn.agentId === "shopper";
                  const active = index === activeTurnIndex;
                  return (
                    <div
                      key={`${turn.agentId}-${index}`}
                      className={`rounded-lg border p-3 transition ${
                        active
                          ? "border-[#7f187f] bg-[#7f187f]/15"
                          : "border-zinc-800 bg-black/40"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-sm"
                          style={{
                            backgroundColor: shopper
                              ? "#ffffff"
                              : agent?.color ?? "#ffffff",
                          }}
                        />
                        <span className="text-xs font-semibold uppercase text-zinc-300">
                          {shopper ? "You" : agent?.name ?? turn.agentId}
                        </span>
                        <span className="text-xs text-zinc-600">
                          {turn.emotion}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-zinc-200">
                        {turn.text}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {council.agents.map((agent) => {
              const active = agent.id === activeAgent?.id;
              const latestTurn = latestTurnByAgent.get(agent.id);
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
                  <p className="mt-3 line-clamp-3 min-h-12 text-xs leading-5 text-zinc-400">
                    {latestTurn ?? "Waiting for their turn..."}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="flex h-[600px] flex-col rounded-lg border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase text-zinc-500">Council floor</p>
                <h2 className="mt-1 text-lg font-semibold text-white">
                  {activeSpeakerRole}
                </h2>
              </div>
              <div className="text-sm text-zinc-500">
                {Math.min(activeTurnIndex + 1, council.debateTurns.length)} /{" "}
                {council.debateTurns.length}
              </div>
            </div>

            <div className="mt-5 flex min-h-0 flex-1 flex-col space-y-3">
              {activeProduct && (
                <div className="shrink-0 rounded-lg border border-[#7f187f]/40 bg-[#7f187f]/15 p-3">
                  <p className="text-xs font-semibold uppercase text-[#d8b4fe]">
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

              <div className="grid shrink-0 gap-3 xl:grid-cols-[1fr_0.95fr]">
                {activeTurn && (
                  <article className="rounded-lg border border-[#7f187f] bg-[#7f187f]/15 p-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-sm"
                        style={{ backgroundColor: activeSpeakerColor }}
                      />
                      <span className="text-xs font-semibold uppercase text-zinc-200">
                        {activeSpeakerName}
                      </span>
                      <span className="text-xs text-zinc-600">
                        {activeTurn.emotion}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-zinc-100">
                      {activeTurn.text}
                    </p>
                  </article>
                )}

                {onChimeSubmit && onChimeTextChange && (
                  <form
                    onSubmit={onChimeSubmit}
                    className="rounded-lg border border-zinc-700 bg-black p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase text-[#d8b4fe]">
                          Your turn
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                          Interrupt {isShopperTurn ? "the council" : activeSpeakerName} right here.
                        </p>
                      </div>
                      {isChiming && (
                        <span className="rounded-sm bg-[#7f187f]/20 px-2 py-1 text-xs text-white">
                          Agents reading
                        </span>
                      )}
                    </div>
                    <input
                      value={chimeText}
                      onChange={(event) => onChimeTextChange(event.target.value)}
                      placeholder="Ask about fit, scam risk, budget, delivery..."
                      className="mt-3 h-11 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-[#7f187f]"
                      disabled={isChiming}
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                      {quickChimes.map((message) => (
                        <button
                          key={message}
                          type="button"
                          onClick={() => onQuickChime?.(message)}
                          disabled={isChiming}
                          className="rounded-sm border border-[#7f187f]/50 bg-[#7f187f]/20 px-2 py-1 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {message}
                        </button>
                      ))}
                    </div>
                    <button
                      type="submit"
                      disabled={!chimeText.trim() || isChiming}
                      className="mt-3 h-10 w-full rounded-md bg-white px-4 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isChiming ? "Council responding" : "Interrupt now"}
                    </button>
                  </form>
                )}
              </div>

              <div className="rounded-lg border border-[#7f187f]/40 bg-[#7f187f]/15 p-3">
                <p className="text-xs font-semibold uppercase text-[#d8b4fe]">
                  Why Wayfair helps here
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-200">
                  The council is checking room fit, compact dimensions, delivery windows, assembly details, reviews, and customer photos before the shopper commits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
