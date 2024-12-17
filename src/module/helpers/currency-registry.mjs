export function RegisterCurrency(registeredCurrency) {
	if (!Hooks.call('customCurrencyRegistry', registeredCurrency)) {
		return;
	}

	registeredCurrency.forEach((currency) => {
		let isValid = true;
		if (!currency.label || !currency.id) {
			isValid = false;
		}
		if (isValid) {
			cosmereRPG.api.registerCurrency(currency);
		}
	});
}

export function LocalizeCurrency(registeredCurrency) {
	if (registeredCurrency) {
		registeredCurrency.forEach((currency) => {
			const dict = game.i18n.translations.COSMERE_WORKBENCH.currency;
			const config = CONFIG.COSMERE_WORKBENCH.currency;
			dict[currency.id] = { label: currency.label };
			config.labels[currency.id] = `COSMERE_WORKBENCH.currency.${currency.id}.label`;
			currency.denominations.primary.forEach((denomination) => {
				dict[currency.id][denomination.id] = {
					label: denomination.label,
					abbr: denomination.unit
				};
				config.labels[denomination.id] = `COSMERE_WORKBENCH.currency.${currency.id}.${denomination.id}.label`;
				config.abbr[denomination.id] = `COSMERE_WORKBENCH.currency.${currency.id}.${denomination.id}.abbr`
			});
			currency.denominations.secondary.forEach((denomination) => {
				dict[currency.id][denomination.id] = {
					label: denomination.label,
					abbr: denomination.unit
				};
				config.labels[denomination.id] = `COSMERE_WORKBENCH.currency.${currency.id}.${denomination.id}.label`;
				config.abbr[denomination.id] = `COSMERE_WORKBENCH.currency.${currency.id}.${denomination.id}.abbr`
			});
		});
	}
}
