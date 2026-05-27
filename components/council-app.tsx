"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CouncilBoard } from "@/components/council-board";
import { DEFAULT_SCENARIO_ID, getScenario } from "@/lib/council/scenarios";
import { DEMO_WAYFAIR_URL } from "@/lib/council/url-ingest";
import type {
  CouncilApiResponse,
  CouncilChimeApiResponse,
  CouncilResponse,
} from "@/lib/council/schema";

const selectedScenario = getScenario(DEFAULT_SCENARIO_ID);

const quickChimes = [
  "Is this real or a scam?",
  "Will this fit through a narrow staircase?",
  "Which one is the smart budget pick?",
];

const SILENT_WAV =
  "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=";

export function CouncilApp() {
  const [url, setUrl] = useState(DEMO_WAYFAIR_URL);
  const [shopperGoal, setShopperGoal] = useState(selectedScenario.shopperGoal);
  const [constraintsText, setConstraintsText] = useState(
    selectedScenario.constraints.join(" / "),
  );
  const [sourceLabel, setSourceLabel] = useState(
    "Wayfair blue sofa page demo JSON",
  );
  const [response, setResponse] = useState<CouncilApiResponse | null>(null);
  const [activeTurnIndex, setActiveTurnIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [chimeText, setChimeText] = useState("");
  const [isChiming, setIsChiming] = useState(false);
  const [audioOn, setAudioOn] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("Voice off");
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const lastSpokenTurnRef = useRef("");
  const voiceRequestIdRef = useRef(0);
  const voiceObjectUrlRef = useRef("");

  const constraints = useMemo(
    () =>
      constraintsText
        .split(/\n|\/|,/)
        .map((constraint) => constraint.trim())
        .filter(Boolean),
    [constraintsText],
  );
  const council: CouncilResponse | null = response?.council ?? null;

  async function sendChime(messageText: string) {
    const message = messageText.trim();
    if (!message || !council || isChiming) return;

    const userTurn: CouncilResponse["debateTurns"][number] = {
      agentId: "shopper",
      emotion: "concerned",
      text: message,
    };
    const interruptedCouncil: CouncilResponse = {
      ...council,
      debateTurns: [...council.debateTurns, userTurn],
    };

    setIsChiming(true);
    setChimeText("");
    setResponse({
      source: response?.source ?? "fallback",
      council: interruptedCouncil,
      note: `You interrupted with: "${message}"`,
      urlNote: response?.urlNote,
    });
    setActiveTurnIndex(council.debateTurns.length);

    try {
      const result = await fetch("/api/council/chime", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          scenarioId: DEFAULT_SCENARIO_ID,
          council: interruptedCouncil,
        }),
      });
      const data = (await result.json()) as CouncilChimeApiResponse;
      const nextCouncil: CouncilResponse = {
        ...interruptedCouncil,
        debateTurns: [...interruptedCouncil.debateTurns, ...data.chime.debateTurns],
        verdict: data.chime.verdict ?? interruptedCouncil.verdict,
      };

      setResponse({
        source: data.source,
        council: nextCouncil,
        note: data.note ?? data.chime.note,
        urlNote: response?.urlNote,
      });
      setActiveTurnIndex(interruptedCouncil.debateTurns.length);
    } finally {
      setIsChiming(false);
    }
  }

  async function runCouncil() {
    setIsRunning(true);
    setActiveTurnIndex(0);

    try {
      const result = await fetch("/api/council", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: DEFAULT_SCENARIO_ID,
          url,
          shopperGoal,
          constraints,
          sourceLabel,
          live: false,
        }),
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
    await sendChime(chimeText);
  }

  async function sendQuickChime(message: string) {
    await sendChime(message);
  }

  const advanceTurn = useCallback(() => {
    setActiveTurnIndex((index) => {
      if (!council || isRunning || isChiming) return index;
      return Math.min(index + 1, council.debateTurns.length - 1);
    });
  }, [council, isChiming, isRunning]);

  async function unlockAudio() {
    const audio = audioElementRef.current;
    if (!audio) return;

    const oldSrc = audio.src;
    audio.src = SILENT_WAV;
    audio.load();

    try {
      await audio.play();
      audio.pause();
      audio.currentTime = 0;
    } catch {
      setVoiceStatus("Click play if blocked");
    } finally {
      if (oldSrc) {
        audio.src = oldSrc;
      } else {
        audio.removeAttribute("src");
      }
      audio.load();
    }
  }

  const playAgentTurn = useCallback(async (turn: CouncilResponse["debateTurns"][number]) => {
    await Promise.resolve();
    if (turn.agentId === "shopper") return;

    const agent = council?.agents.find((item) => item.id === turn.agentId);
    const agentName = agent?.name ?? "agent";
    const turnKey = `${activeTurnIndex}:${turn.agentId}:${turn.text}`;
    if (lastSpokenTurnRef.current === turnKey) return;
    lastSpokenTurnRef.current = turnKey;

    const requestId = voiceRequestIdRef.current + 1;
    voiceRequestIdRef.current = requestId;
    setVoiceStatus(`Generating ${agentName}`);

    try {
      const result = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: turn.agentId,
          text: turn.text,
        }),
      });

      if (!result.ok) {
        const error = await result.json().catch(() => ({}));
        throw new Error(
          typeof error.error === "string"
            ? error.error
            : "ElevenLabs unavailable",
        );
      }

      if (voiceRequestIdRef.current !== requestId) return;

      const audioBlob = await result.blob();
      const objectUrl = URL.createObjectURL(audioBlob);
      if (voiceObjectUrlRef.current) {
        URL.revokeObjectURL(voiceObjectUrlRef.current);
      }
      voiceObjectUrlRef.current = objectUrl;

      const audio = audioElementRef.current;
      if (!audio) throw new Error("Audio player is not ready.");

      audio.src = objectUrl;
      audio.load();
      setVoiceStatus(`Playing ${agentName}`);
      await audio.play();
    } catch (error) {
      setVoiceStatus(
        error instanceof Error && error.message.includes("ELEVENLABS_API_KEY")
          ? "Add ElevenLabs key"
          : "Click audio play",
      );
    }
  }, [activeTurnIndex, council]);

  useEffect(() => {
    if (audioOn) return;
    if (!council || isRunning || isChiming) return;
    if (activeTurnIndex >= council.debateTurns.length - 1) return;

    const timeout = window.setTimeout(() => {
      setActiveTurnIndex((index) => index + 1);
    }, 7000);

    return () => window.clearTimeout(timeout);
  }, [activeTurnIndex, audioOn, council, isChiming, isRunning]);

  useEffect(() => {
    if (!audioOn) {
      audioElementRef.current?.pause();
      return;
    }

    const activeTurn = council?.debateTurns[activeTurnIndex];
    if (!activeTurn || activeTurn.agentId === "shopper") return;

    const timeout = window.setTimeout(() => {
      void playAgentTurn(activeTurn);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [activeTurnIndex, audioOn, council, playAgentTurn]);

  return (
    <div className="min-h-full bg-black text-white">
      <header className="border-b border-zinc-800 bg-black">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase text-[#d8b4fe]">Wayfair Hack</p>
            <h1 className="mt-1 text-2xl font-semibold">Shop Council</h1>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="Demo Wayfair URL"
              className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-[#7f187f] sm:w-[440px]"
            />
            <button
              type="button"
              onClick={async () => {
                if (audioOn) {
                  setAudioOn(false);
                  setVoiceStatus("Voice off");
                  audioElementRef.current?.pause();
                  return;
                }

                setAudioOn(true);
                setVoiceStatus("Voice ready");
                await unlockAudio();

                const activeTurn = council?.debateTurns[activeTurnIndex];
                if (activeTurn && activeTurn.agentId !== "shopper") {
                  await playAgentTurn(activeTurn);
                }
              }}
              className={`h-10 rounded-md border px-3 text-sm font-semibold ${
                audioOn
                  ? "border-[#7f187f] bg-[#7f187f] text-white"
                  : "border-zinc-800 bg-zinc-950 text-zinc-300"
              }`}
            >
              Voice {audioOn ? "on" : "off"}
            </button>
            <div
              className={`h-10 items-center gap-2 rounded-md border border-zinc-800 bg-zinc-950 px-3 ${
                audioOn ? "flex" : "hidden"
              }`}
            >
              <span className="text-xs leading-5 text-zinc-300">
                {voiceStatus}
              </span>
              <audio
                ref={audioElementRef}
                controls
                className="h-7 w-36"
                onEnded={() => {
                  setVoiceStatus("Voice ready");
                  advanceTurn();
                }}
                onError={() => setVoiceStatus("Click audio play")}
              />
            </div>
            <button
              type="button"
              onClick={runCouncil}
              disabled={isRunning}
              className="h-10 rounded-md bg-[#7f187f] px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRunning ? "Running" : "Run Council"}
            </button>
          </div>
        </div>
      </header>

      <section className="border-b border-zinc-800 bg-zinc-950">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 py-3 lg:grid-cols-[1.4fr_1fr_0.8fr]">
          <div>
            <label className="text-xs uppercase text-zinc-500" htmlFor="goal">
              Shopper goal
            </label>
            <textarea
              id="goal"
              value={shopperGoal}
              onChange={(event) => setShopperGoal(event.target.value)}
              className="mt-1 min-h-20 w-full rounded-md border border-zinc-800 bg-black px-3 py-2 text-sm leading-6 text-zinc-200 outline-none focus:border-[#7f187f]"
            />
          </div>
          <div>
            <label
              className="text-xs uppercase text-zinc-500"
              htmlFor="constraints"
            >
              Constraints
            </label>
            <textarea
              id="constraints"
              value={constraintsText}
              onChange={(event) => setConstraintsText(event.target.value)}
              className="mt-1 min-h-20 w-full rounded-md border border-zinc-800 bg-black px-3 py-2 text-sm leading-6 text-zinc-200 outline-none focus:border-[#7f187f]"
            />
          </div>
          <div>
            <label className="text-xs uppercase text-zinc-500" htmlFor="source">
              Source
            </label>
            <textarea
              id="source"
              value={sourceLabel}
              onChange={(event) => setSourceLabel(event.target.value)}
              className="mt-1 min-h-20 w-full rounded-md border border-zinc-800 bg-black px-3 py-2 text-sm leading-6 text-zinc-200 outline-none focus:border-[#7f187f]"
            />
          </div>
        </div>
      </section>

      {(response?.note || response?.urlNote) && (
        <div
          className="h-2 border-b border-amber-500/30 bg-amber-500/20"
          aria-hidden="true"
        />
      )}

      <CouncilBoard
        council={council}
        activeTurnIndex={activeTurnIndex}
        chimeText={chimeText}
        isChiming={isChiming}
        quickChimes={quickChimes}
        onChimeTextChange={setChimeText}
        onChimeSubmit={chimeIn}
        onQuickChime={sendQuickChime}
      />
    </div>
  );
}
