import './style.scss';
import './module/cosmere-rpg-api';
import { localize, register } from './module/setup';
import { COSMERE_WORKBENCH } from './module/helpers/config.mjs';
import { preloadHandlebarsTemplates } from './module/helpers/templates.mjs';
import { registerModuleSettings } from './module/settings';
import { HOOKS } from './module/constants';
import { SetupDiceTray } from './module/hooks/modules/dice-tray';

declare global {
	interface LenientGlobalVariableTypes {
		game: never;
	}

	/* // eslint-disable-next-line no-var
	var cosmereWorkbench: {
		macros: typeof WorkbenchMacros;
	}; */

	interface CONFIG {
		COSMERE: never;
		COSMERE_WORKBENCH: typeof COSMERE_WORKBENCH;
	}
};

Hooks.once(HOOKS.INIT, async () => {
	/* globalThis.cosmereWorkbench = Object.assign(
		{ macros: WorkbenchMacros }
	); */
	CONFIG.COSMERE_WORKBENCH = COSMERE_WORKBENCH;
	registerModuleSettings();

	register();

	// Preload Handlebars templates.
	return preloadHandlebarsTemplates();
});

Hooks.once(HOOKS.READY, async () => {
	localize();
	await SetupDiceTray();
});

Handlebars.registerHelper('isSelected', function (arg1, arg2) {
	return (arg1 == arg2) ? "selected" : "";
});

Handlebars.registerHelper('round', function (arg1) {
	return arg1 ? Number((arg1).toFixed(2)) : 0;
});
