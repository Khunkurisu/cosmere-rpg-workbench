/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { MODULE_ID } from "../constants";

export const POWER_TYPES: CosmereAPI.PowerTypeConfigData[] = [
];

export function register() {
	POWER_TYPES.forEach(powerConfig => {
		cosmereRPG.api.registerPowerType({ ...powerConfig, source: MODULE_ID });
	});
}

export function localize() {
	POWER_TYPES.forEach(powerConfig => {
		// @ts-expect-error valid type erroneously claimed as invalid
		game.i18n!.translations.COSMERE.Powers[powerConfig.id] = powerConfig.label;
	});
}
