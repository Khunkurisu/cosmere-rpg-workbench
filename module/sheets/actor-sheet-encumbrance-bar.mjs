const templatePath = 'modules/cosmere-rpg-workbench/templates/sheets/parts/actor-encumbrance-bar.hbs';

export async function InjectEncumbranceCounter(sheet, html) {
	const data = {
		encumbrance: GetData(sheet),
		config: CONFIG.COSMERE_WORKBENCH
	};

	const search = $(html).find('#equipment-search');
	if ($(html).find('#encumbrance-counter').length > 0) {
		return;
	}
	const encumbranceBar = await renderTemplate(templatePath, data);
	$(search).after(encumbranceBar);
}

function GetData(sheet) {
	const actor = sheet.actor;
	const encumbrance = actor.system.encumbrance;
	const items = Array.from(actor.items);

	const data = {
		carry: encumbrance.carry.value,
		lift: encumbrance.lift.value,
		current: 0,
	};

	items.forEach((item) => {
		if (item.type === 'weapon' || item.type === 'armor' || item.type === 'equipment') {
			data.current += item.system.weight.value * item.system.quantity;
		}
	});
	return data;
}
