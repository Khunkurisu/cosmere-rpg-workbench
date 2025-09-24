import { ActorType, MODULE_ID } from "../constants";

export const ROLL_DATA: CosmereAPI.RollDataConfigData[] = [
];

export function register() {
	ROLL_DATA.forEach((rollDataConfig) => {
		// @ts-ignore
		cosmereRPG.api.registerRollData({ ...rollDataConfig, source: MODULE_ID });
	});
}
