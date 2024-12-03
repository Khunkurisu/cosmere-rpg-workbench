import { COSMERE_WORKBENCH } from './helpers/config.mjs';
import { LocalizeCurrency, RegisterCurrency } from './helpers/currency-registry.mjs';
import { LocalizeSkills, RegisterSkills } from './helpers/skill-registry.mjs';
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
	LocalizeSkills(registeredSkills);
	LocalizeCurrency(registeredCurrency);
});

Hooks.on('renderActorSheetV2', async (o, i, n) => {
	await InjectCurrencyCounter(o, i);
	return true;
});

Hooks.on('createItem', async (document, options, userId) => {
	console.log(document);
	console.log(options);
	console.log(userId);
});

Handlebars.registerHelper('isSelected', function (arg1, arg2) {
	return (arg1 == arg2) ? "selected" : "";
});
