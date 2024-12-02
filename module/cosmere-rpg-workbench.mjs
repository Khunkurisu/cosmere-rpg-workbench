import { CustomSkillMenu } from './applications/custom-skills-menu.mjs';
import { CustomCurrencyMenu } from './applications/custom-currency-menu.mjs';
import { COSMERE_WORKBENCH } from './helpers/config.mjs';
import { RegisterCurrency } from './helpers/currency-registry.mjs';
import { RegisterSkills } from './helpers/skill-registry.mjs';
import { preloadHandlebarsTemplates } from './helpers/templates.mjs';
import { InjectCurrencyCounter } from './sheets/actor-sheet-currency-counter.mjs';

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
			const dict = game.i18n.translations.COSMERE.Currencies;
			dict[currency.id] = { label: currency.label };
			dict[currency.id].denominations = {};
			const denom = dict[currency.id].denominations;
			currency.denominations.primary.forEach((denomination) => {
				denom.primary = {};
				denom.primary[denomination.id] = {
					label: denomination.label,
					abbr: denomination.unit
				};
			});
			currency.denominations.secondary.forEach((denomination) => {
				denom.secondary = {};
				denom.secondary[denomination.id] = {
					label: denomination.label,
					abbr: denomination.unit
				};
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

async function registerSettings() {
	game.settings.registerMenu('cosmere-rpg-workbench', 'customSkillsMenu', {
		name: 'COSMERE_WORKBENCH.applications.customSkills.pluralLabel',
		label: 'COSMERE_WORKBENCH.applications.customSkills.menu',
		hint: 'COSMERE_WORKBENCH.applications.customSkills.desc',
		icon: 'fas fa-bars',
		type: CustomSkillMenu,
		restricted: true,
	});

	await game.settings.register('cosmere-rpg-workbench', 'customCurrency', {
		scope: 'world',
		config: false,
		type: Array,
		default: [],
	});

	game.settings.registerMenu('cosmere-rpg-workbench', 'customCurrencyMenu', {
		name: 'COSMERE_WORKBENCH.applications.customCurrency.pluralLabel',
		label: 'COSMERE_WORKBENCH.applications.customCurrency.menu',
		hint: 'COSMERE_WORKBENCH.applications.customCurrency.desc',
		icon: 'fas fa-bars',
		type: CustomCurrencyMenu,
		restricted: true,
	});

	await game.settings.register('cosmere-rpg-workbench', 'customSkills', {
		scope: 'world',
		config: false,
		type: Array,
		default: [],
	});
}
