import { MODULE_ID } from "@src/module/constants";

export const PATH_TYPES: CosmereAPI.PathTypeConfigData[] = [
];

export function register() {
    PATH_TYPES.forEach(config => cosmereRPG.api.registerPathType({...config, source: MODULE_ID }));
}
