import type { DemoCharacter } from "../../api";
import type { Trait } from "./types";

export const SKILL_DEFS = [
  {
    key: "implementation" as const,
    label: "実装力",
    short: "実",
    description:
      "過去1年の総コントリビューション数から算出。実装フェーズの開発進捗に直結する。",
    accent: "#e8903a",
    iconName: "implementation" as const,
  },
  {
    key: "planning" as const,
    label: "企画力",
    short: "企",
    description:
      "非Forkリポジトリ数 + Wiki有効数 + 技術多様性の合算。企画フェーズと乗数効果に影響する。",
    accent: "#9060d0",
    iconName: "planning" as const,
  },
  {
    key: "speed" as const,
    label: "開発速度",
    short: "速",
    description:
      "直近1年の月次コミットペース + マージ済みPR数から算出。実装フェーズの毎ターン進捗に乗算。",
    accent: "#4a9cd3",
    iconName: "speed" as const,
  },
  {
    key: "review" as const,
    label: "レビュー力",
    short: "評",
    description:
      "PRレビュー数・コメント数・Issueクローズ数から算出。チームの企画力補正に加算ボーナスを与える。",
    accent: "#5baa5b",
    iconName: "review" as const,
  },
  {
    key: "stamina" as const,
    label: "持続力",
    short: "持",
    description:
      "継続コントリビューション日数・ストリーク期間から算出。体調補正のネガティブ効果を軽減する。",
    accent: "#c85040",
    iconName: "stamina" as const,
  },
  {
    key: "adaptability" as const,
    label: "適応力",
    short: "適",
    description:
      "使用言語・フレームワークの多様性から算出。大会の技術マッチ条件を満たしやすくなる。",
    accent: "#c8a84b",
    iconName: "adaptability" as const,
  },
] as const;

export const TRAIT_MAP: Record<string, Trait> = {
  reviewer: {
    id: "reviewer",
    name: "コードレビュアー",
    description: "...",
    icon: "◎",
    colorVars: {
      bg: "#2e1a08",
      border: "#c0703060",
      text: "#f0a050",
    },
  },
};

export const TENDENCY_LABEL: Record<DemoCharacter["tendency"], string> = {
  implementation: "実装特化型",
  planning: "設計特化型",
  balanced: "バランス型",
};

export const TENDENCY_RANK = [
  {
    minDeckScore: 0,
    title: "トレーニー",
    description: "プログラミング初心者など。",
  },
  {
    minDeckScore: 150,
    title: "ジュニアエンジニア",
    description: "プログラミングにある程度慣れた人",
  },
  {
    minDeckScore: 350,
    title: "シニアエンジニア",
    description: "プログラミングを仕事にでき、エンジニアになることができる人",
  },
  {
    minDeckScore: 700,
    title: "テックリード",
    description:
      "エンジニアの中でも比較的スキルが高いと位置づけることができる人",
  },
  {
    minDeckScore: 1200,
    title: "アーキテクト",
    description:
      "エンジニアでも特に高いスキルを持ち合わせており、CTOやコンサルティングのマネージャーに務まりうる人",
  },
] as const;
