import './style.scss';
import './module/cosmere-rpg-api';
import { Logger } from './module/helpers/console';
import { localize, register } from './module/setup';
import { COSMERE_WORKBENCH } from './module/helpers/config.mjs';
import { preloadHandlebarsTemplates } from './module/helpers/templates.mjs';
import { registerModuleSettings } from './module/settings';
import { HOOKS } from './module/constants';
import { CompendiumBrowser, CompendiumManager } from './module/applications';
import { SetupDiceTray } from './module/hooks/modules/dice-tray';
import { AnyObject } from '@league-of-foundry-developers/foundry-vtt-types/src/types/utils.mjs';

declare global {
	var debug: typeof Logger

	interface LenientGlobalVariableTypes {
		game: never;
	}

	var cosmereWorkbench: {
		//macros: typeof WorkbenchMacros;
		compendiumManager: typeof CompendiumManager;
		compendiumBrowser: typeof CompendiumBrowser;
	};

	interface CONFIG {
		COSMERE: AnyObject;
		COSMERE_WORKBENCH: typeof COSMERE_WORKBENCH;
	}
};

Hooks.once(HOOKS.INIT, async () => {
	globalThis.cosmereWorkbench = Object.assign(
		//{ macros: WorkbenchMacros }
		{ compendiumManager: CompendiumManager },
		{ compendiumBrowser: CompendiumBrowser },
	);
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

Handlebars.registerHelper('round', function (arg1?: number) {
	return arg1 ? Number((arg1).toFixed(2)) : 0;
});
