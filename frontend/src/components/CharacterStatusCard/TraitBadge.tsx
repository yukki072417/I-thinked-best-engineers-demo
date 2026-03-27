import { useState, type CSSProperties } from "react";
import type { Trait } from "./types";

const TraitBadge = ({ trait }: { trait: Trait }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="trait-badge">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow((v) => !v)}
        className="trait-badge__button"
        style={
          {
            "--trait-bg": trait.colorVars.bg,
            "--trait-border": trait.colorVars.border,
            "--trait-text": trait.colorVars.text,
          } as CSSProperties
        }
      >
        {trait.icon} {trait.name}
      </button>

      {show && (
        <div
          className="trait-badge__tooltip"
          style={
            {
              "--trait-border": trait.colorVars.border,
            } as CSSProperties
          }
        >
          {trait.description}
        </div>
      )}
    </div>
  );
};

export default TraitBadge;
