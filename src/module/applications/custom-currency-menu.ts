import { AnyObject } from "@league-of-foundry-developers/foundry-vtt-types/src/types/utils.mjs";
import { MODULE_ID } from "../constants";
import { SETTINGS } from "../settings";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

export class CustomCurrencyMenuV2 extends HandlebarsApplicationMixin(
	ApplicationV2<AnyObject>,
) {
	static DEFAULT_OPTIONS = {
		id: 'custom-currency-menu',
		form: {
			handler: CustomCurrencyMenuV2.onFormEvent,
			closeOnSubmit: false,
		},
		position: {
			width: 640,
			height: 'auto' as 'auto',
		},
		actions: {
			create: CustomCurrencyMenuV2.createEntry,
			remove: CustomCurrencyMenuV2.removeEntry,
			toggle: CustomCurrencyMenuV2.toggleEntry,
			cancel: CustomCurrencyMenuV2.onCancel,
		},
		tag: 'form',
		window: {
			title: 'workbench.settings.customCurrencyMenu.name',
			contentClasses: ["standard-form", 'cosmere-rpg-workbench'],
		},
	}

	entries = game.settings!.get(MODULE_ID, SETTINGS.CUSTOM_CURRENCIES) as Array<CosmereAPI.CurrencyConfigData>;

	static PARTS = {
		form: {
			template: 'modules/cosmere-rpg-workbench/templates/applications/custom-currency.hbs'
		},
		footer: {
			template: "templates/generic/form-footer.hbs",
		},
	}

	get title() {
		return `Cosmere RPG Workbench: ${game.i18n!.localize(this.options.window?.title ?? "")}`;
	}

	protected _prepareContext() {
		if (this.entries.length === 1) {
			if (!this.entries[0].id) this.entries = [];
		}

		return Promise.resolve({
			entries: [...this.entries],
			buttons: [
				{ type: "submit", icon: "fa-solid fa-save", label: "SETTINGS.Save" },
				{ type: "button", icon: "fa-solid fa-ban", label: "Cancel", action: "cancel" },
			],
			attributes: CONFIG.COSMERE.attributes,
			config: CONFIG.COSMERE_WORKBENCH,
		});
	}

	private static onFormEvent(
		this: CustomCurrencyMenuV2,
		event: Event,
		form: HTMLFormElement,
		formData: FormDataExtended,
	) {
		const data: Array<CosmereAPI.CurrencyConfigData> = this.entries;
		let lastCurrency: CosmereAPI.CurrencyConfigData;
		let isValid = true;
		data.every((currency) => {
			if (lastCurrency) {
				if (currency.id === lastCurrency.id) {
					isValid = false;
				}
			}
			if (isValid) {
				let lastDenom: CosmereAPI.CurrencyDenominationConfig;
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
				let lastDenom: CosmereAPI.CurrencyDenominationConfig;
				currency.denominations.secondary?.every((denom) => {
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
			game.settings!.set(MODULE_ID, SETTINGS.CUSTOM_CURRENCIES, data);
			this.close();
		} else {
			ui.notifications.error("Identifiers must be unique.");
		}
	}

	static onCancel(this: CustomCurrencyMenuV2) {
		this.close();
	}

	static createEntry(this: CustomCurrencyMenuV2, event: PointerEvent, target: HTMLElement) {
		const entries = this.entries;
		const dataset = target.dataset;
		const index = dataset.index;
		if (!index) return;

		if (dataset.target === 'currency') {
			entries.push({
				id: 'ncr',
				label: 'New Currency',
				icon: 'icons/svg/item-bag.svg',
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
			entries[parseInt(index)].denominations.primary.push({
				id: 'npd',
				label: "New Primary",
				conversionRate: 0,
				base: false,
				unit: 'pd',
			});
		} else if (dataset.target === 'secondary') {
			entries[parseInt(index)].denominations.secondary?.push({
				id: 'nsd',
				label: "New Secondary",
				conversionRate: 0,
				base: false,
				unit: 'sd',
			});
		}

		this.render(false);
	}

	static removeEntry(this: CustomCurrencyMenuV2, event: PointerEvent, target: HTMLElement) {
		const dataset = target.dataset;
		const entries = this.entries;
		const index = dataset.index;
		if (!index) return;
		const key = dataset.key;
		if (!key) return;

		if (dataset.target === 'currency') {
			entries.splice(parseInt(index), 1);
		} else if (dataset.target === 'primary') {
			entries[parseInt(index)].denominations.primary.splice(parseInt(key), 1);
		} else if (dataset.target === 'secondary') {
			entries[parseInt(index)].denominations.secondary?.splice(parseInt(key), 1);
		}

		this.render(false);
	}

	static toggleEntry(this: CustomCurrencyMenuV2, event: PointerEvent, target: HTMLElement) {
		const dataset = target.dataset;
		const entries = this.entries;
		const index = dataset.index;
		if (!index) return;
		const key = dataset.key;
		if (!key) return;
		const dataTarget = dataset.target;
		if (!dataTarget) return;

		const denoms = entries[parseInt(index)].denominations[dataTarget] as CosmereAPI.CurrencyDenominationConfig[];

		denoms[parseInt(key)].base = !(denoms[parseInt(key)].base);

		if (denoms[parseInt(key)].base) {
			denoms.forEach((denomination: CosmereAPI.CurrencyDenominationConfig) => {
				if (denomination.base) denomination.base = false;
			});
			denoms[parseInt(key)].base = true;
		}

		this.render(false);
	}

	_onRender(this: CustomCurrencyMenuV2) {
		const html = $(this.element);

		html.on("change", ".entry-input", this.onEntryChange.bind(this));
	}

	onEntryChange(event: Event) {
		event.preventDefault();
		const element = event.currentTarget as HTMLFormElement;
		const dataset = element.dataset;
		const entries = this.entries;
		const index = dataset.index;
		if (!index) return;
		const key = dataset.key;
		if (!key) return;
		const target = dataset.target;
		if (!target) return;

		const entry: CosmereAPI.CurrencyConfigData = entries[parseInt(index)];

		if (dataset.target === 'currency') {
			entry[key] = element.value;
		} else {
			const denom = dataset.denom;
			if (!denom) return;
			const denominations = entry.denominations[target] as CosmereAPI.CurrencyDenominationConfig[];
			denominations[parseInt(denom)][key] = element.value;
		}

		this.render(false);
	}
}
