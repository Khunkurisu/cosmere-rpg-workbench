/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
		// @ts-expect-error valid type erroneously claimed as invalid
		game.i18n!.translations.COSMERE.Skill[skillConfig.id] = skillConfig.label;
	});
}
