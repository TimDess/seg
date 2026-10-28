"use client";
import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { services } from "@/lib/content";

export default function ExpertiseMarquee() {
  const [paused, setPaused] = useState(false);
  const labels = [
    ...services.map((s) => s.title),
    "Bureaux",
    "Commerces",
    "Locaux professionnels",
  ];
  return (
    <div className="expertise-ticker" data-paused={paused}>
      <div className="ticker-mask">
        <div className="ticker-track">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-label={copy === 0 ? "Domaines d’intervention" : undefined}
              aria-hidden={copy === 1 ? true : undefined}
            >
              {labels.map((label) => (
                <li key={label}>
                  {label}
                  <span aria-hidden="true">·</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
      <button
        type="button"
        aria-label={
          paused
            ? "Reprendre le défilement des expertises"
            : "Mettre en pause le défilement des expertises"
        }
        aria-pressed={paused}
        onClick={() => setPaused(!paused)}
      >
        {paused ? <Play size={15} /> : <Pause size={15} />}
      </button>
    </div>
  );
}
