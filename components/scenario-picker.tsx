"use client";

import type { CouncilScenario } from "@/lib/council/scenarios";

type ScenarioPickerProps = {
  scenarios: CouncilScenario[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function ScenarioPicker({
  scenarios,
  selectedId,
  onSelect,
}: ScenarioPickerProps) {
  return (
    <section className="border-b border-zinc-800 bg-zinc-950/90">
      <div className="mx-auto grid max-w-7xl gap-3 px-4 py-4 md:grid-cols-3">
        {scenarios.map((scenario) => {
          const selected = scenario.id === selectedId;
          return (
            <button
              key={scenario.id}
              type="button"
              onClick={() => onSelect(scenario.id)}
              className={`min-h-32 rounded-lg border p-4 text-left transition ${
                selected
                  ? "border-[#ff5c28] bg-[#ff5c28]/10"
                  : "border-zinc-800 bg-black hover:border-zinc-600"
              }`}
            >
              <div className="text-xs uppercase text-zinc-500">{scenario.room}</div>
              <div className="mt-2 text-base font-semibold text-white">
                {scenario.title}
              </div>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-400">
                {scenario.shopperGoal}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
