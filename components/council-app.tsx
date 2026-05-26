"use client";

import { useEffect, useMemo, useState } from "react";
import { CouncilBoard } from "@/components/council-board";
import { ScenarioPicker } from "@/components/scenario-picker";
import { VerdictPanel } from "@/components/verdict-panel";
import {
  DEFAULT_SCENARIO_ID,
  getScenario,
  scenarios,
} from "@/lib/council/scenarios";
import { DEMO_WAYFAIR_URL } from "@/lib/council/url-ingest";
import type {
  CouncilApiResponse,
  CouncilChimeApiResponse,
  CouncilResponse,
} from "@/lib/council/schema";

export function CouncilApp() {
  const [scenarioId, setScenarioId] = useState(DEFAULT_SCENARIO_ID);
  const [url, setUrl] = useState(DEMO_WAYFAIR_URL);
  const [response, setResponse] = useState<CouncilApiResponse | null>(null);
  const [activeTurnIndex, setActiveTurnIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [chimeText, setChimeText] = useState("");
  const [isChiming, setIsChiming] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [voiceOn, setVoiceOn] = useState(false);

  const selectedScenario = useMemo(() => getScenario(scenarioId), [scenarioId]);
  const council: CouncilResponse | null = response?.council ?? null;

  async function runCouncil() {
    setIsRunning(true);
    setActiveTurnIndex(0);

    try {
      const result = await fetch("/api/council", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioId, url }),
      });
      const data = (await result.json()) as CouncilApiResponse;
      setResponse(data);
    } catch {
      setResponse(null);
    } finally {
      setIsRunning(false);
    }
  }

  async function chimeIn(event: React.FormEvent) {
    event.preventDefault();
    const message = chimeText.trim();
    if (!message || !council || isChiming) return;

    setIsChiming(true);
    setAutoPlay(false);

    try {
      const result = await fetch("/api/council/chime", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, scenarioId, council }),
      });
      const data = (await result.json()) as CouncilChimeApiResponse;
      const nextCouncil: CouncilResponse = {
        ...council,
        debateTurns: [...council.debateTurns, ...data.chime.debateTurns],
        verdict: data.chime.verdict ?? council.verdict,
      };

      setResponse({
        source: data.source,
        council: nextCouncil,
        note: data.note ?? data.chime.note,
        urlNote: response?.urlNote,
      });
      setActiveTurnIndex(council.debateTurns.length);
      setChimeText("");
    } finally {
      setIsChiming(false);
    }
  }

  useEffect(() => {
    if (!autoPlay || !council || isRunning) return;
    if (activeTurnIndex >= council.debateTurns.length - 1) return;

    const timeout = window.setTimeout(() => {
      setActiveTurnIndex((index) => index + 1);
    }, 2600);

    return () => window.clearTimeout(timeout);
  }, [activeTurnIndex, autoPlay, council, isRunning]);

  useEffect(() => {
    if (!voiceOn || !council || typeof window === "undefined") return;

    const turn = council.debateTurns[activeTurnIndex];
    if (!turn || !("speechSynthesis" in window)) return;

    const agent = council.agents.find((item) => item.id === turn.agentId);
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      `${agent?.name ?? "Council"} says. ${turn.text}`,
    );
    utterance.rate = 1.02;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);

    return () => window.speechSynthesis.cancel();
  }, [activeTurnIndex, council, voiceOn]);

  return (
    <div className="min-h-full bg-black text-white">
      <header className="border-b border-zinc-800 bg-black">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase text-[#ff5c28]">Wayfair Hack</p>
            <h1 className="mt-1 text-2xl font-semibold">Shop Council</h1>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="Demo Wayfair URL"
              className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-[#ff5c28] sm:w-72"
            />
            <button
              type="button"
              onClick={() => setVoiceOn((value) => !value)}
              className={`h-10 rounded-md border px-3 text-sm font-medium ${
                voiceOn
                  ? "border-emerald-400 bg-emerald-400 text-black"
                  : "border-zinc-800 bg-zinc-950 text-zinc-300"
              }`}
            >
              Voice {voiceOn ? "on" : "off"}
            </button>
            <button
              type="button"
              onClick={() => setAutoPlay((value) => !value)}
              className={`h-10 rounded-md border px-3 text-sm font-medium ${
                autoPlay
                  ? "border-sky-400 bg-sky-400 text-black"
                  : "border-zinc-800 bg-zinc-950 text-zinc-300"
              }`}
            >
              Auto {autoPlay ? "on" : "off"}
            </button>
            <button
              type="button"
              onClick={runCouncil}
              disabled={isRunning}
              className="h-10 rounded-md bg-[#ff5c28] px-4 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRunning ? "Running" : "Run Council"}
            </button>
          </div>
        </div>
      </header>

      <ScenarioPicker
        scenarios={scenarios}
        selectedId={scenarioId}
        onSelect={(id) => {
          setScenarioId(id);
          setResponse(null);
          setActiveTurnIndex(0);
        }}
      />

      <section className="border-b border-zinc-800 bg-zinc-950">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 py-3 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="text-xs uppercase text-zinc-500">Shopper goal</p>
            <p className="mt-1 text-sm leading-6 text-zinc-300">
              {council?.scenario.shopperGoal ?? selectedScenario.shopperGoal}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-zinc-500">Constraints</p>
            <p className="mt-1 text-sm leading-6 text-zinc-300">
              {(council?.scenario.constraints ?? selectedScenario.constraints)
                .slice(0, 2)
                .join(" / ")}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-zinc-500">Source</p>
            <p className="mt-1 text-sm leading-6 text-zinc-300">
              {response?.source === "subconscious"
                ? "Subconscious"
                : response?.source === "anthropic"
                  ? "Claude"
                : response?.source === "openai"
                  ? "OpenAI"
                  : response?.source === "fallback"
                  ? "Fallback"
                  : "Ready"}
            </p>
          </div>
        </div>
      </section>

      {(response?.note || response?.urlNote) && (
        <div className="border-b border-amber-500/30 bg-amber-500/10">
          <div className="mx-auto max-w-7xl px-4 py-2 text-sm text-amber-200">
            {[response.note, response.urlNote].filter(Boolean).join(" ")}
          </div>
        </div>
      )}

      <CouncilBoard council={council} activeTurnIndex={activeTurnIndex} />
      {council && (
        <section className="border-b border-zinc-800 bg-black">
          <form
            onSubmit={chimeIn}
            className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center"
          >
            <div className="md:w-56">
              <p className="text-xs font-semibold uppercase text-[#ff5c28]">
                Chime in
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Interrupt the council.
              </p>
            </div>
            <input
              value={chimeText}
              onChange={(event) => setChimeText(event.target.value)}
              placeholder="Try: I have a narrow staircase, is this real, or that feels too expensive..."
              className="h-11 flex-1 rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-[#ff5c28]"
              disabled={isChiming}
            />
            <button
              type="submit"
              disabled={!chimeText.trim() || isChiming}
              className="h-11 rounded-md bg-white px-4 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isChiming ? "Council responding" : "Interrupt"}
            </button>
          </form>
        </section>
      )}
      <VerdictPanel council={council} />
    </div>
  );
}
