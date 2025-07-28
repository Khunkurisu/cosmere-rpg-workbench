import './style.scss';
import './module/cosmere-rpg-api';
import { register } from './module/register';
import { COSMERE_WORKBENCH } from './module/helpers/config.mjs';
import { preloadHandlebarsTemplates } from './module/helpers/templates.mjs';
import { registerModuleSettings } from './module/settings';
import { InjectEncumbranceCounter } from './module/sheets/actor-sheet-encumbrance-bar.mjs';

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

Hooks.on('renderActorSheetV2', async (o: any, i: any, _n: any) => {
	await InjectEncumbranceCounter(o, i);
	return true;
});

Hooks.on('preCreateItem', async (document: any, _data, _options, _userId) => {
	if (document.type === 'talent') {
		const parentActor = document.parent;
		if (parentActor && parentActor.type === 'adversary') {
			const actionData = {
				img: document.img,
				name: document.name,
				type: 'action',
				system: {
					activation: document.system.activation,
					damage: document.system.damage,
					description: document.system.description,
					id: document.id,
				}
			}
			const docCls = getDocumentClass('Item');
			await docCls.create(actionData, { parent: parentActor });
			return false;
		}
	}
	return true;
});

Handlebars.registerHelper('isSelected', function (arg1, arg2) {
	return (arg1 == arg2) ? "selected" : "";
});

Handlebars.registerHelper('round', function (arg1) {
	return arg1 ? Number((arg1).toFixed(2)) : 0;
});
