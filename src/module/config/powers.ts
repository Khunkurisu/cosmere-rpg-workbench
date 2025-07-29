import { MODULE_ID } from "../constants";

export const POWER_TYPES: CosmereAPI.PowerTypeConfigData[] = [
];

export function register() {
	POWER_TYPES.forEach(powerConfig => {
		cosmereRPG.api.registerPowerType({ ...powerConfig, source: MODULE_ID });
		// @ts-ignore
		game.i18n!.translations.COSMERE.Powers[powerConfig.id] = powerConfig.label;
	});
}
