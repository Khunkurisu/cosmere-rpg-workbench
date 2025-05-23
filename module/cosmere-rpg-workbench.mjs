//import * as WorkbenchMacros from './workbench-macros.mjs';
import { COSMERE_WORKBENCH } from './helpers/config.mjs';
import { preloadHandlebarsTemplates } from './helpers/templates.mjs';
import { registerSettings } from './helpers/register-settings.mjs';
import { LocalizeCurrency, RegisterCurrency } from './helpers/currency-registry.mjs';
import { InjectEncumbranceCounter } from './sheets/actor-sheet-encumbrance-bar.mjs';
import { LocalizeSkills, RegisterSkills } from './helpers/skill-registry.mjs';

let registeredSkills;
let registeredCurrency;

Hooks.once('init', async function () {
	globalThis.cosmereWorkbench = Object.assign(
		game.modules.get('cosmere-rpg-workbench'),
		//{ macros: WorkbenchMacros }
	);
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
	await InjectEncumbranceCounter(o, i);
	return true;
});

Handlebars.registerHelper('isSelected', function (arg1, arg2) {
	return (arg1 == arg2) ? "selected" : "";
});

Handlebars.registerHelper('round', function (arg1) {
	return arg1 ? Number((arg1).toFixed(2)) : 0;
});
