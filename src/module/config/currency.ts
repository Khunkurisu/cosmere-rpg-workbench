/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable  */
import { MODULE_ID } from "../constants";

export const CURRENCIES: CosmereAPI.CurrencyConfigData[] = [

];

export function register() {
	// @ts-expect-error valid type erroneously claimed as valid
	CURRENCIES.forEach(currencyConfig => cosmereRPG.api.registerCurrency({ ...currencyConfig, source: MODULE_ID }));
}

export function localize() {
	CURRENCIES.forEach(currencyConfig => {
		// @ts-expect-error valid type erroneously claimed as valid
		const dict = game.i18n!.translations.workbench.currency;
		const config = CONFIG.COSMERE_WORKBENCH.currency;
		dict[currencyConfig.id] = { label: currencyConfig.label };
		// @ts-expect-error I have to set up a config interface
		config.labels[currencyConfig.id] = `workbench.currency.${currencyConfig.id}.label`;
		currencyConfig.denominations.primary.forEach((denomination) => {
			dict[currencyConfig.id][denomination.id] = {
				label: denomination.label,
				abbr: denomination.unit
			};
			// @ts-expect-error I have to set up a config interface
			config.labels[denomination.id] = `workbench.currency.${currencyConfig.id}.${denomination.id}.label`;
			// @ts-expect-error I have to set up a config interface
			config.abbr[denomination.id] = `workbench.currency.${currencyConfig.id}.${denomination.id}.abbr`
		});
		currencyConfig.denominations.secondary!.forEach((denomination) => {
			dict[currencyConfig.id][denomination.id] = {
				label: denomination.label,
				abbr: denomination.unit
			};
			// @ts-expect-error I have to set up a config interface
			config.labels[denomination.id] = `workbench.currency.${currencyConfig.id}.${denomination.id}.label`;
			// @ts-expect-error I have to set up a config interface
			config.abbr[denomination.id] = `workbench.currency.${currencyConfig.id}.${denomination.id}.abbr`
		});
	});
}
