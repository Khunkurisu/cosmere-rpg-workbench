import './style.scss';
import './module/cosmere-rpg-api';
import { localize, register } from './module/setup';
import { COSMERE_WORKBENCH } from './module/helpers/config.mjs';
import { preloadHandlebarsTemplates } from './module/helpers/templates.mjs';
import { registerModuleSettings } from './module/settings';
import { InjectEncumbranceCounter } from './module/sheets/actor-sheet-encumbrance-bar.mjs';
import { CompendiumManager } from './module/applications/compendium-browser/compendium-manager';
import { CompendiumBrowser } from './module/applications';
import BaseItem from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/documents/item.mjs';
import { ActorTypes } from './module/constants';

declare global {
	interface LenientGlobalVariableTypes {
		game: never;
	}

	// eslint-disable-next-line no-var
	var cosmereWorkbench: {
		//macros: typeof WorkbenchMacros;
		compendiumManager: typeof CompendiumManager;
		compendiumBrowser: typeof CompendiumBrowser;
	};

	interface CONFIG {
		COSMERE: any;
		COSMERE_WORKBENCH: typeof COSMERE_WORKBENCH;
	}
};

Hooks.once('init', async () => {
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

Hooks.once('ready', async () => {
	localize();
	if (game.modules!.get('dice-calculator')?.active) {
		const diceTrayDiceRows = game.settings!.get("dice-calculator", "diceRows") as DiceRow[];
		if (diceTrayDiceRows) {
			let hasPlotDie = false;
			diceTrayDiceRows.forEach((row: DiceRow) => {
				hasPlotDie ||= row["1dp"] != undefined || row.dp != undefined;
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

Hooks.on('preCreateItem', async (document: CosmereItem & BaseItem, _data, _options, _userId) => {
	if (document.type === 'talent') {
		const parentActor = document.parent as CosmereActor;
		if (parentActor && parentActor.type === ActorTypes.Adversary) {
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

Handlebars.registerHelper('round', function (arg1: number) {
	return arg1 ? Number((arg1).toFixed(2)) : 0;
});
