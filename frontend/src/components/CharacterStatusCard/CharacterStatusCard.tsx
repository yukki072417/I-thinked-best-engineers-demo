import "./CharacterStatusCard.css";
import StarRow from "./StarRow";
import SkillBlock from "./SkillBlock";
import TraitBadge from "./TraitBadge";
import { SKILL_DEFS, TENDENCY_LABEL, TENDENCY_RANK } from "./constants";
import type { ExtendedCharacter } from "./types";

const CharacterStatusCard = ({
  character,
}: {
  character: ExtendedCharacter;
}) => {
  const reversedRankIndex = [...TENDENCY_RANK]
    .reverse()
    .findIndex((rank) => character.deck_score >= rank.minDeckScore);
  const rankIndex =
    reversedRankIndex === -1 ? 0 : TENDENCY_RANK.length - 1 - reversedRankIndex;
  const rankInfo = TENDENCY_RANK[rankIndex];
  const nextRankInfo = TENDENCY_RANK[rankIndex + 1];
  const stars = (() => {
    if (!rankInfo) {
      return 1;
    }

    if (!nextRankInfo) {
      return 5;
    }

    const bandStart = rankInfo.minDeckScore;
    const bandSize = Math.max(nextRankInfo.minDeckScore - bandStart, 1);
    const progress = (character.deck_score - bandStart) / bandSize;
    return Math.min(5, Math.max(1, Math.floor(progress * 5) + 1));
  })();
  const skills = {
    implementation: character.skills.implementation,
    planning: character.skills.planning,
    speed: character.skills.speed,
    review: character.skills.review ?? 0,
    stamina: character.skills.stamina ?? 0,
    adaptability: character.skills.adaptability ?? 0,
  };
  const traits = character.traits ?? [];

  return (
    <div className="character-status-card">
      <div className="character-status-card__topbar">
        <div className="character-status-card__topbar-left">
          <div className="character-status-card__dot" />
          <span className="character-status-card__caption">Character File</span>
        </div>

        <span className="character-status-card__rank">{rankInfo.title}</span>
      </div>

      <div className="character-status-card__body">
        <div className="character-status-card__portrait-wrap">
          <img
            src={character.avatar_url}
            alt={character.github_login}
            className="character-status-card__portrait"
          />

          <div className="character-status-card__portrait-overlay" />

          <div className="character-status-card__stars">
            <StarRow count={stars} />
          </div>
        </div>

        <div className="character-status-card__content">
          <div className="character-status-card__name-wrap">
            <h1 className="character-status-card__name">
              {character.name ?? character.github_login}
            </h1>

            <p className="character-status-card__login">
              @{character.github_login}
            </p>
          </div>

          <div className="character-status-card__tags">
            <span className="character-status-card__tag character-status-card__tag--tendency">
              {TENDENCY_LABEL[character.tendency]}
            </span>

            <span className="character-status-card__tag character-status-card__tag--deck">
              Deck: {character.deck_score}
            </span>
          </div>

          <div className="character-status-card__divider" />

          <div className="character-status-card__skills">
            {SKILL_DEFS.map((def) => (
              <SkillBlock key={def.key} def={def} value={skills[def.key]} />
            ))}
          </div>
        </div>
      </div>

      {traits.length > 0 && (
        <div className="character-status-card__traits">
          <p className="character-status-card__traits-label">特性</p>

          <div className="character-status-card__traits-list">
            {traits.map((trait) => (
              <TraitBadge key={trait.id} trait={trait} />
            ))}
          </div>
        </div>
      )}

      <div className="character-status-card__footer-line" />
    </div>
  );
};

export default CharacterStatusCard;
