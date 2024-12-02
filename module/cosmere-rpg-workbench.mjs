import { COSMERE_WORKBENCH } from './helpers/config.mjs';
import { RegisterCurrency } from './helpers/currency-registry.mjs';
import { RegisterSkills } from './helpers/skill-registry.mjs';
import { preloadHandlebarsTemplates } from './helpers/templates.mjs';
import { InjectCurrencyCounter } from './sheets/actor-sheet-currency-counter.mjs';
import { registerSettings } from './helpers/register-settings.mjs';

let registeredSkills;
let registeredCurrency;

Hooks.once('init', async function () {
	CONFIG.COSMERE_WORKBENCH = COSMERE_WORKBENCH;
	await registerSettings();

	registeredSkills = game.settings.get('cosmere-rpg-workbench', 'customSkills');
	RegisterSkills(registeredSkills);

	registeredCurrency = game.settings.get('cosmere-rpg-workbench', 'customCurrency');
	RegisterCurrency(registeredCurrency);

	// Preload Handlebars templates.
	return preloadHandlebarsTemplates();
});

Hooks.once('ready', () => {
	if (registeredSkills) {
		registeredSkills.forEach((skill) => {
			game.i18n.translations.COSMERE.Skill[skill.id] = skill.label;
		});
	}

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
});

Hooks.on('renderActorSheetV2', async (o, i, n) => {
	await InjectCurrencyCounter(o, i);
	return true;
});

Handlebars.registerHelper('isSelected', function (arg1, arg2) {
	return (arg1 == arg2) ? "selected" : "";
});
