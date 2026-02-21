import { MODULE_ID, SETTINGS } from "../constants";
import { getModuleSetting } from "../settings";

const templatePath = 'modules/cosmere-rpg-workbench/templates/sheets/parts/actor-encumbrance-bar.hbs';

export async function InjectEncumbranceCounter(sheet: ActorSheet, html: HTMLElement) {
	if (!renderEncumbranceCounter(html)) return;

	const data = {
		encumbrance: GetData(sheet),
		config: CONFIG.COSMERE_WORKBENCH
	};

	const search = $(html).find('.currency-list');
	const encumbranceBar = await renderTemplate(templatePath, data);
	$(search).after(encumbranceBar);
}

function GetData(sheet: ActorSheet) {
	const actor = sheet.actor as CosmereActor & foundry.documents.BaseActor;
	const encumbrance = actor.system.encumbrance;
	const items = Array.from(actor.items) as CosmereItem[];

	const data = {
		carry: encumbrance.carry.value,
		lift: encumbrance.lift.value,
		current: 0,
	};

	items.forEach((item) => {
		if (item.isPhysical()) {
			data.current += item.system.weight.value * item.system.quantity;
		}
	});

	return data;
}

function renderEncumbranceCounter(html: HTMLElement) {
	return (
		getModuleSetting(SETTINGS.SHEET_ENCUMBRANCE_BAR_CLIENT) ||
		getModuleSetting(SETTINGS.SHEET_ENCUMBRANCE_BAR_WORLD)) &&
		$(html).find('#encumbrance-counter').length > 0;
}
