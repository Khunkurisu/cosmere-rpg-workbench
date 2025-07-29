import { MODULE_ID } from "@src/module/constants";

export const PATH_TYPES: CosmereAPI.PathTypeConfigData[] = [
];

export function register() {
	PATH_TYPES.forEach(pathConfig => {
		cosmereRPG.api.registerPathType({ ...pathConfig, source: MODULE_ID });
		// @ts-ignore
		game.i18n!.translations.COSMERE.Skill[pathConfig.id] = pathConfig.label;
	});
}
