import type { CSSProperties } from "react";
import SkillTooltip from "./SkillTooltip";
import { SKILL_DEFS } from "./constants";

type SkillDef = (typeof SKILL_DEFS)[number];

function SkillIcon({ iconName }: { iconName: SkillDef["iconName"] }) {
  switch (iconName) {
    case "implementation":
      return (
        <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
          <path
            d="M5 3.5l-3 4.5 3 4.5M11 3.5l3 4.5-3 4.5M9 2l-2 12"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      );
    case "planning":
      return (
        <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
          <rect x="2" y="2" width="12" height="3" rx="1" />
          <rect x="2" y="7" width="8" height="2" rx="1" />
          <rect x="2" y="11" width="10" height="2" rx="1" />
        </svg>
      );
    case "speed":
      return (
        <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
          <path
            d="M8 2v6l4 2"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          <circle
            cx="8"
            cy="8"
            r="6"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      );
    case "review":
      return (
        <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
          <circle
            cx="6"
            cy="6"
            r="4"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M9 9l4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M4 6h4M6 4v4"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "stamina":
      return (
        <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
          <path
            d="M8 2C5 2 2 4.5 2 8c0 3.3 2.5 6 6 6s6-2.7 6-6c0-3.5-3-6-6-6z"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M8 5v4l2 1"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "adaptability":
      return (
        <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
          <circle
            cx="8"
            cy="8"
            r="6"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M2 8h12M8 2c-2 2-3 4-3 6s1 4 3 6M8 2c2 2 3 4 3 6s-1 4-3 6"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      );
  }
}

const SkillBlock = ({ def, value }: { def: SkillDef; value: number }) => {
  return (
    <SkillTooltip description={def.description} accentColor={def.accent}>
      <div
        className="skill-block"
        style={{ "--skill-accent": def.accent } as CSSProperties}
      >
        <div className="skill-block__inner">
          <div className="skill-block__icon">
            <SkillIcon iconName={def.iconName} />
          </div>
          <span className="skill-block__value">{value}</span>
          <span className="skill-block__short">{def.short}</span>
        </div>
      </div>
    </SkillTooltip>
  );
};

export default SkillBlock;
