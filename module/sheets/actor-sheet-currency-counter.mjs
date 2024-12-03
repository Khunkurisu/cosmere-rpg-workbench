const templatePath = 'modules/cosmere-rpg-workbench/templates/sheets/parts/actor-currency-counter.hbs';

export async function InjectCurrencyCounter(sheet, html) {
	const data = {
		currencies: GetData(sheet),
		config: CONFIG.COSMERE_WORKBENCH
	};
	SetRowSize(data);

	const search = $(html).find('#equipment-search');
	const currencyBar = await renderTemplate(templatePath, data);
	$(search).after(currencyBar);
}

function SetRowSize(data) {
	if (Object.keys(data).length >= 5) {
		data.rows = 5;
	} else {
		data.rows = Object.keys(data).length;
	}
}

function GetData(sheet) {
	const actor = sheet.actor;
	const items = Array.from(actor.items);

	const data = {};

	items.forEach((item) => {
		if (item.type === 'loot') {
			const system = item.system;
			const value = system.price.baseValue * system.quantity;
			const currency = system.price.currency;
			const denomination = system.price.denomination.primary;

			const coreObj = data[currency] ?? {};
			const subObj = coreObj[denomination] ?? {};

			if (system.isMoney) {
				subObj.currency = subObj.currency ? subObj.currency + value : value;
			} else {
				subObj.loot = subObj.loot ? subObj.loot + value : value;
			}
			subObj.unit = system.price.unit;
			subObj.total = subObj.total ? subObj.total + value : value;

			coreObj[denomination] = subObj;
			data[currency] = coreObj;
		}
	});
	return data;
}
