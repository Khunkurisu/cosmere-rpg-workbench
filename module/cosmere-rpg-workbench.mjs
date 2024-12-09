import * as WorkbenchMacros from './workbench-macros.mjs';
import { COSMERE_WORKBENCH } from './helpers/config.mjs';
import { preloadHandlebarsTemplates } from './helpers/templates.mjs';
import { registerSettings } from './helpers/register-settings.mjs';
import { LocalizeCurrency, RegisterCurrency } from './helpers/currency-registry.mjs';
import { InjectCurrencyCounter } from './sheets/actor-sheet-currency-counter.mjs';
import { InjectEncumbranceCounter } from './sheets/actor-sheet-encumbrance-bar.mjs';
import { LocalizeSkills, RegisterSkills } from './helpers/skill-registry.mjs';
import { SetHealth, SetInvestiture, SetLevel } from './helpers/actor-update.mjs';
import { InjectRecoveryButton } from './sheets/actor-sheet-recovery-button.mjs';

let registeredSkills;
let registeredCurrency;

Hooks.once('init', async function () {
	globalThis.cosmereWorkbench = Object.assign(
		game.modules.get('cosmere-rpg-workbench'),
		{ macros: WorkbenchMacros }
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
	await InjectCurrencyCounter(o, i);
	await InjectEncumbranceCounter(o, i);
	await InjectRecoveryButton(o, i);
	return true;
});

Hooks.on('createItem', async (document, options, userId) => {
	if (options.parent) {
		switch (document.type) {
			case 'path': {
				SetInvestiture(options.parent, true);
				break;
			}
			case 'talent': {
				SetLevel(options.parent);
				SetHealth(document);
				break;
			}
		}
	}
});

Hooks.on('createActor', async (document, options, userId) => {
	if (document.type === 'character') {
		const useOverride = game.settings.get('cosmere-rpg-workbench', 'manualLevelToggle');
		document.update({ 'system.level.total.useOverride': useOverride });
		SetLevel(document);
		SetHealth(document);
	}
});

Hooks.on('deleteItem', async (document, options, userId) => {
	if (options.parent) {
		switch (document.type) {
			case 'path': {
				SetInvestiture(options.parent);
				break;
			}
			case 'talent': {
				SetLevel(options.parent);
				SetHealth(document);
				break;
			}
		}
	}
});

Hooks.on('updateActor', (document, changed, options, userId) => {
	SetInvestiture(document);
	SetLevel(document);
	SetHealth(document);
});

Handlebars.registerHelper('isSelected', function (arg1, arg2) {
	return (arg1 == arg2) ? "selected" : "";
});

Handlebars.registerHelper('round', function (arg1) {
	return arg1 ? Number((arg1).toFixed(2)) : 0;
});
