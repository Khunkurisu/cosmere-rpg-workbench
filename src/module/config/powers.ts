import { MODULE_ID } from "../constants";

export const POWER_TYPES: CosmereAPI.PowerTypeConfigData[] = [
];

export function register() {
    POWER_TYPES.forEach(config => cosmereRPG.api.registerPowerType({...config, source: MODULE_ID }));
}
