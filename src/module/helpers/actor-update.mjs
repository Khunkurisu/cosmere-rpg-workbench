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

export function SetHealth(actor) {
	if (!game.settings.get('cosmere-rpg-workbench', 'autoHealth')) return;
	const system = actor.system;
	const strength = system.attributes.str.value;
	const level = system.level.total.useOverride ?
		system.level.total.override : system.level.total.value;
	const health = system.resources.hea;
	// adjust health.max.override and health.max.useOverride
	let maxHealth = 10 + strength;
	for (let i = 0; i < level; i++) {
		switch (i) {
			case 0: {
				break;
			} case 5: case 10: case 15: {
				maxHealth += strength;
			} default: {
				if (i < 6) {
					maxHealth += 5;
				} else if (i < 11) {
					maxHealth += 4;
				} else if (i < 16) {
					maxHealth += 3;
				} else if (i < 21) {
					maxHealth += 2;
				} else {
					maxHealth += 1;
				}
			}
		}
	}
	health.max.override = maxHealth;
	health.max.useOverride = true;
	actor.update({ 'system.resources.hea': health });
}

export function SetLevel(actor, override = -1) {
	if (game.settings.get('cosmere-rpg-workbench', 'manualLevelToggle')) {
		const level = game.settings.get('cosmere-rpg-workbench', 'manualLevelValue');
		actor.update({ 'system.level.total.override': level });
	} else {
		if (!game.settings.get('cosmere-rpg-workbench', 'autoLevel')) {
			actor.update({ 'system.level.total.useOverride': false });
			return;
		}
		let level = 0;
		if (override >= 0) {
			level = override;
		} else {
			const items = Array.from(actor.items);

			items.forEach((item) => {
				if (item.type === 'talent') {
					level++;
				}
			});
			level = Math.max(level, 1);
		}
		actor.update({ 'system.level.total.override': level });
		actor.update({ 'system.level.total.useOverride': true });
	}
}
