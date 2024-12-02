const templatePath = 'modules/cosmere-rpg-workbench/templates/sheets/parts/actor-currency-counter.hbs';

export async function InjectCurrencyCounter(sheet, html) {
	console.log(sheet);
	console.log($(html));
	const search = $(html).find('#equipment-search');
	console.log(search);
	const data = GetData(sheet);
	console.log(data);
	const currencyBar = await renderTemplate(templatePath, data);
	$(search).after(currencyBar);
}

function GetData(sheet) {
	const actor = sheet.actor;
	const items = Array.from(actor.items);

	const currency = {};
	const loot = {};

	items.forEach((item) => {
		if (item.type === 'loot') {
			const system = item.system;
			if (system.isMoney) {
				if (currency[system.price.unit]) {
					currency[system.price.unit] += system.price.baseValue * system.quantity;
				} else {
					currency[system.price.unit] = system.price.baseValue * system.quantity;
				}
			} else {
				if (loot[system.price.unit]) {
					loot[system.price.unit] += system.price.baseValue * system.quantity;
				} else {
					loot[system.price.unit] = system.price.baseValue * system.quantity;
				}
			}
		}
	});
	return {
		"currency": currency,
		"loot": loot
	};
}
