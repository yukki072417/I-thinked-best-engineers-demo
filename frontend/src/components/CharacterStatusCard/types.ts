import type { DemoCharacter } from "../../api";

export type ExtendedSkills = {
  implementation: number;
  planning: number;
  speed: number;
  review: number;
  stamina: number;
  adaptability: number;
};

export type Trait = {
  id: string;
  name: string;
  description: string;
  icon: string;
  colorVars: { bg: string; border: string; text: string };
};

export type ExtendedCharacter = Omit<DemoCharacter, "skills"> & {
  skills: DemoCharacter["skills"] &
    Partial<Omit<ExtendedSkills, keyof DemoCharacter["skills"]>>;
  traits?: Trait[];
};
