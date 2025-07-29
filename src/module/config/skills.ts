import { MODULE_ID } from "../constants";

export const SKILLS: CosmereAPI.SkillConfigData[] = [
];

export function register() {
	SKILLS.forEach((skillConfig) => {
		cosmereRPG.api.registerSkill({ ...skillConfig, source: MODULE_ID });
	});
}

export function localize() {
	SKILLS.forEach((skillConfig) => {
		// @ts-ignore
		game.i18n!.translations.COSMERE.Skill[skillConfig.id] = skillConfig.label;
	});
}
