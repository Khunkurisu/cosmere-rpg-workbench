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
