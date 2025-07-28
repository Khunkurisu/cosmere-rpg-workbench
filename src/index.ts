import './style.scss';
import './module/cosmere-rpg-api';
import { register } from './module/register';
import { COSMERE_WORKBENCH } from './module/helpers/config.mjs';
import { preloadHandlebarsTemplates } from './module/helpers/templates.mjs';
import { registerModuleSettings } from './module/settings';

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

Hooks.once('init', async function () {
	/* globalThis.cosmereWorkbench = Object.assign(
		{ macros: WorkbenchMacros }
	); */
	CONFIG.COSMERE_WORKBENCH = COSMERE_WORKBENCH;
	registerModuleSettings();

	register();

	// Preload Handlebars templates.
	return preloadHandlebarsTemplates();
});
