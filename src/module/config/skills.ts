import { MODULE_ID } from "../constants";

export const SKILLS: CosmereAPI.SkillConfigData[] = [
];

export function register() {
    SKILLS.forEach((config) => cosmereRPG.api.registerSkill({...config, source: MODULE_ID }));
}
