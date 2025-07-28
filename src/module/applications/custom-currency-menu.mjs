import { MODULE_ID } from "../constants";
import { SETTINGS } from "../settings";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

export class CustomCurrencyMenu extends HandlebarsApplicationMixin(ApplicationV2) {
	static DEFAULT_OPTIONS = {
		id: 'custom-currency-menu',
		form: {
			handler: CustomCurrencyMenu.#onSubmit,
			closeOnSubmit: false,
		},
		position: {
			width: 640,
			height: 'auto',
		},
		actions: {
			create: CustomCurrencyMenu.createEntry,
			remove: CustomCurrencyMenu.removeEntry,
			toggle: CustomCurrencyMenu.toggleEntry,
			cancel: CustomCurrencyMenu.onCancel,
		},
		tag: 'form',
		window: {
			title: 'COSMERE_WORKBENCH.applications.customCurrency.menu',
			contentClasses: ["standard-form", 'cosmere-rpg-workbench'],
		},
	}

	entries = [...game.settings.get(MODULE_ID, SETTINGS.CUSTOM_CURRENCIES)];

	static PARTS = {
		form: {
			template: 'modules/cosmere-rpg-workbench/templates/applications/custom-currency.hbs'
		},
		footer: {
			template: "templates/generic/form-footer.hbs",
		},
	}

	get title() {
		return `Cosmere RPG Workbench: ${game.i18n.localize(this.options.window.title)}`;
	}

	_prepareContext(options) {
		if (this.entries.length === 1) {
			if (!this.entries[0].id) this.entries = [];
		}

		return {
			entries: [...this.entries],
			buttons: [
				{ type: "submit", icon: "fa-solid fa-save", label: "SETTINGS.Save" },
				{ type: "button", icon: "fa-solid fa-ban", label: "Cancel", action: "cancel" },
			],
			attributes: CONFIG.COSMERE.attributes,
			config: CONFIG.COSMERE_WORKBENCH,
		};
	}

	static #onSubmit(event, form, formData) {
		const data = [...this.entries];
		let lastCurrency;
		let isValid = true;
		data.every((currency) => {
			if (lastCurrency) {
				if (currency.id === lastCurrency.id) {
					isValid = false;
				}
			}
			if (isValid) {
				let lastDenom;
				currency.denominations.primary.every((denom) => {
					if (lastDenom) {
						if (denom.id === lastDenom.id) {
							isValid = false;
						}
					}
					lastDenom = denom;
					return isValid;
				});
			}
			if (isValid) {
				let lastDenom;
				currency.denominations.secondary.every((denom) => {
					if (lastDenom) {
						if (denom.id === lastDenom.id) {
							isValid = false;
						}
					}
					lastDenom = denom;
					return isValid;
				});
			}
			lastCurrency = currency;
			return isValid;
		});

		if (isValid) {
			game.settings.set(MODULE_ID, SETTINGS.CUSTOM_CURRENCIES, data);
			this.close();
		} else {
			ui.notifications.error("Identifiers must be unique.");
		}
	}

	static onCancel(event, target) {
		this.close();
	}

	static createEntry(event, target) {
		const entries = this.entries;
		const dataset = target.dataset;

		if (dataset.target === 'currency') {
			entries.push({
				id: 'ncr',
				label: 'New Currency',
				denominations: {
					primary: [{
						id: 'npd',
						label: "New Primary Denomination",
						conversionRate: 0,
						base: true,
						unit: 'pd',
					}],
					secondary: [{
						id: 'nsd',
						label: "New Secondary Denomination",
						conversionRate: 0,
						base: true,
						unit: 'sd',
					}],
				},
			});
		} else if (dataset.target === 'primary') {
			entries[dataset.index].denominations.primary.push({
				id: 'npd',
				label: "New Primary",
				conversionRate: 0,
				base: false,
				unit: 'pd',
			});
		} else if (dataset.target === 'secondary') {
			entries[dataset.index].denominations.secondary.push({
				id: 'nsd',
				label: "New Secondary",
				conversionRate: 0,
				base: false,
				unit: 'sd',
			});
		}

		this.render({ force: false });
	}

	static removeEntry(event, target) {
		const dataset = target.dataset;
		const entries = this.entries;

		if (dataset.target === 'currency') {
			entries.splice(dataset.index, 1);
		} else if (dataset.target === 'primary') {
			entries[dataset.index].denominations.primary.splice(dataset.key, 1);
		} else if (dataset.target === 'secondary') {
			entries[dataset.index].denominations.secondary.splice(dataset.key, 1);
		}

		this.render({ force: false });
	}

	static toggleEntry(event, target) {
		const dataset = target.dataset;
		const entries = this.entries;
		const denom = entries[dataset.index].denominations[dataset.target];

		denom[dataset.key].base = !(denom[dataset.key].base);

		if (denom[dataset.key].base) {
			denom.forEach((denomination) => {
				if (denomination.base) denomination.base = false;
			});
			denom[dataset.key].base = true;
		}

		this.render({ force: false });
	}

	_onRender(context, options) {
		const html = $(this.element);

		html.on("change", ".entry-input", this.onEntryChange.bind(this));
	}

	/**
	 * Handle changing entry text.
	 * @param {Event} event   The originating change event
	 * @private
	 */
	onEntryChange(event) {
		event.preventDefault();
		const element = event.currentTarget;
		const dataset = element.dataset;
		const entries = this.entries;
		const entry = entries[dataset.index];

		if (dataset.target === 'currency') {
			entry[dataset.key] = element.value;
		} else {
			const denom = entry.denominations[dataset.target];
			denom[dataset.denom][dataset.key] = element.value;
		}

		this.render({ force: false });
	}
}
