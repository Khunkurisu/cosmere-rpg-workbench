import { MODULE_ID } from "../constants";

export const CURRENCIES: CosmereAPI.CurrencyConfigData[] = [

];

export function register() {
    CURRENCIES.forEach(config => cosmereRPG.api.registerCurrency({...config, source: MODULE_ID }));
}
