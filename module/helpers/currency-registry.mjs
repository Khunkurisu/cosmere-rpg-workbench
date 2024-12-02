export function RegisterCurrency(registeredCurrency) {
	if (!Hooks.call('customCurrencyRegistry', registeredCurrency)) {
		return;
	}

	/* registeredCurrency.forEach((currency) => {
		let isValid = true;
		if (!CONFIG.COSMERE.attributes[currency.attribute]) {
			isValid = false;
		}
		if (!currency.label || !currency.id) {
			isValid = false;
		}
		if (isValid) {
			cosmereRPG.api.registerCurrency(currency);
		}
	}); */
}
