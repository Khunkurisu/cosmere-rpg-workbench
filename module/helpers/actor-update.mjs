export function SetInvestiture(actor, forced = false) {
	if (!game.settings.get('cosmere-rpg-workbench', 'autoInvest')) return;
	const system = actor.system;
	const attributes = system.attributes;

	let investiture = 0;
	if (forced || IsRadiant(actor)) {
		investiture = 2 + (attributes.awa.value > attributes.pre.value
			? attributes.awa.value : attributes.pre.value);
	}
	actor.update({ 'system.resources.inv.max.value': investiture });
}

function IsRadiant(actor) {
	const items = Array.from(actor.items);

	let isRadiant = false;
	items.every((item) => {
		if (item.type === 'path' && item.system.type === 'radiant') {
			isRadiant = true;
		}
		return !isRadiant;
	});
	return isRadiant;
}

export function SetLevel(actor, override = -1) {
	if (!game.settings.get('cosmere-rpg-workbench', 'autoLevel')) return;
	let level = 0;
	if (override >= 0) {
		level = override;
	} else {
		const items = Array.from(actor.items);

		items.forEach((item) => {
			if (item.type === 'talent') {
				console.log(item);
				level++;
			}
		});
		level = Math.max(level, 1);
	}
	actor.update({ 'system.level.total.bonus': level });
}
