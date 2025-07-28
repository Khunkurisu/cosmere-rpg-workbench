import { MODULE_ID } from "../constants";

export const CURRENCIES: CosmereAPI.CurrencyConfigData[] = [

];

export function register() {
	CURRENCIES.forEach(currencyConfig => {
		cosmereRPG.api.registerCurrency({ ...currencyConfig, source: MODULE_ID });
		// @ts-ignore
		const dict = game.i18n!.translations.COSMERE_WORKBENCH.currency;
		const config = CONFIG.COSMERE_WORKBENCH.currency;
		dict[currencyConfig.id] = { label: currencyConfig.label };
		// @ts-ignore
		config.labels[currencyConfig.id] = `COSMERE_WORKBENCH.currency.${currencyConfig.id}.label`;
		currencyConfig.denominations.primary.forEach((denomination) => {
			dict[currencyConfig.id][denomination.id] = {
				label: denomination.label,
				abbr: denomination.unit
			};
			// @ts-ignore
			config.labels[denomination.id] = `COSMERE_WORKBENCH.currency.${currencyConfig.id}.${denomination.id}.label`;
			// @ts-ignore
			config.abbr[denomination.id] = `COSMERE_WORKBENCH.currency.${currencyConfig.id}.${denomination.id}.abbr`
		});
		// @ts-ignore
		currencyConfig.denominations.secondary.forEach((denomination) => {
			dict[currencyConfig.id][denomination.id] = {
				label: denomination.label,
				abbr: denomination.unit
			};
			// @ts-ignore
			config.labels[denomination.id] = `COSMERE_WORKBENCH.currency.${currencyConfig.id}.${denomination.id}.label`;
			// @ts-ignore
			config.abbr[denomination.id] = `COSMERE_WORKBENCH.currency.${currencyConfig.id}.${denomination.id}.abbr`
		});
	});
}
