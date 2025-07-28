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


Hooks.once('ready', async () => {
	if (game.modules!.get('dice-calculator')?.active) {
		const diceTrayDiceRows = game.settings!.get("dice-calculator", "diceRows") as Array<any>;
		if (diceTrayDiceRows) {
			let hasPlotDie = false;
			diceTrayDiceRows.forEach(row => {
				hasPlotDie = row["1dp"] != undefined;
			});
			if (!hasPlotDie) {
				diceTrayDiceRows.push({
					"1dp": {
						"img": "systems/cosmere-rpg/assets/icons/svg/dice/dp_op.svg",
						"label": "Plot Die",
						"tooltip": "Raise the Stakes!",
						"color": "#ffffff"
					}
				});
				await game.settings!.set("dice-calculator", "diceRows", diceTrayDiceRows);
			}
		}
	}
});
