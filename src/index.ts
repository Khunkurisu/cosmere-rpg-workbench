import './style.scss';
import './module/cosmere-rpg-api';
import { register } from './module/register';
import { COSMERE_WORKBENCH } from './module/helpers/config.mjs';
import { preloadHandlebarsTemplates } from './module/helpers/templates.mjs';
import { registerSettings } from './module/helpers/register-settings.mjs';

declare global {
	interface LenientGlobalVariableTypes {
		game: never;
	}

	/* // eslint-disable-next-line no-var
	var cosmereWorkbench: {
		macros: typeof WorkbenchMacros;
	}; */

	interface CONFIG {
		COSMERE: any;
		COSMERE_WORKBENCH: typeof COSMERE_WORKBENCH;
	}
};

let registeredSkills: Array<CosmereAPI.SkillConfigData>;
let registeredCurrency: Array<CosmereAPI.CurrencyConfigData>;

Hooks.once('init', async function () {
	/* globalThis.cosmereWorkbench = Object.assign(
		{ macros: WorkbenchMacros }
	); */
	CONFIG.COSMERE_WORKBENCH = COSMERE_WORKBENCH;
	registerSettings();

	register();

	// Preload Handlebars templates.
	return preloadHandlebarsTemplates();
});

/* Hooks.once('ready', () => {
	LocalizeSkills(registeredSkills);
	LocalizeCurrency(registeredCurrency);
});

Hooks.on('renderActorSheetV2', async (o, i, n) => {
	await InjectCurrencyCounter(o, i);
	await InjectEncumbranceCounter(o, i);
	return true;
}); */
