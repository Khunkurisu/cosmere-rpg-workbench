import { CustomSkillMenu } from '../applications/custom-skills-menu.mjs';
import { CustomCurrencyMenu } from '../applications/custom-currency-menu.mjs';

export async function registerSettings() {
	await registerCustomSkills();
	await registerCustomCurrency();
	await registerAutoResources();
	await registerLeveling();
	await registerTrackerBars();
}

async function registerCustomSkills() {
	game.settings.registerMenu('cosmere-rpg-workbench', 'customSkillsMenu', {
		name: 'COSMERE_WORKBENCH.applications.customSkills.pluralLabel',
		label: 'COSMERE_WORKBENCH.applications.customSkills.menu',
		hint: 'COSMERE_WORKBENCH.applications.customSkills.desc',
		icon: 'fas fa-bars',
		type: CustomSkillMenu,
		restricted: true,
	});

	await game.settings.register('cosmere-rpg-workbench', 'customSkills', {
		scope: 'world',
		config: false,
		type: Array,
		default: [],
	});
}

async function registerCustomCurrency() {
	game.settings.registerMenu('cosmere-rpg-workbench', 'customCurrencyMenu', {
		name: 'COSMERE_WORKBENCH.applications.customCurrency.pluralLabel',
		label: 'COSMERE_WORKBENCH.applications.customCurrency.menu',
		hint: 'COSMERE_WORKBENCH.applications.customCurrency.desc',
		icon: 'fas fa-bars',
		type: CustomCurrencyMenu,
		restricted: true,
	});

	await game.settings.register('cosmere-rpg-workbench', 'customCurrency', {
		scope: 'world',
		config: false,
		type: Array,
		default: [],
	});
}

async function registerAutoResources() {
	await game.settings.register('cosmere-rpg-workbench', 'autoInvest', {
		name: 'COSMERE_WORKBENCH.settings.autoInvest.label',
		hint: 'COSMERE_WORKBENCH.settings.autoInvest.desc',
		scope: 'world',
		config: true,
		requiresReload: false,
		type: Boolean,
		default: true,
	});
	await game.settings.register('cosmere-rpg-workbench', 'autoHealth', {
		name: 'COSMERE_WORKBENCH.settings.autoHealth.label',
		hint: 'COSMERE_WORKBENCH.settings.autoHealth.desc',
		scope: 'world',
		config: true,
		requiresReload: false,
		type: Boolean,
		onChange: value => {
			const actors = Array.from(game.actors);
			actors.forEach((actor) => {
				if (actor.type === 'character') {
					actor.update({ 'system.resources.hea.max.useOverride': value });
				}
			});
		},
		default: true,
	});
}

async function registerLeveling() {
	await game.settings.register('cosmere-rpg-workbench', 'autoLevel', {
		name: 'COSMERE_WORKBENCH.settings.autoLevel.label',
		hint: 'COSMERE_WORKBENCH.settings.autoLevel.desc',
		scope: 'world',
		config: true,
		requiresReload: false,
		type: Boolean,
		default: false,
	});

	await game.settings.register('cosmere-rpg-workbench', 'manualLevelToggle', {
		name: 'COSMERE_WORKBENCH.settings.manualLevel.toggle.label',
		hint: 'COSMERE_WORKBENCH.settings.manualLevel.toggle.desc',
		scope: 'world',
		config: true,
		requiresReload: false,
		onChange: value => {
			if (cosmereRPG.version === '0.2.0' || cosmereRPG.version === '0.2.1' || cosmereRPG.version === '0.2.2') {
				const actors = Array.from(game.actors);
				actors.forEach((actor) => {
					if (actor.type === 'character') {
						actor.update({ 'system.level.total.useOverride': value });
					}
				});
			}
		},
		type: Boolean,
		default: true,
	});

	await game.settings.register('cosmere-rpg-workbench', 'manualLevelValue', {
		name: 'COSMERE_WORKBENCH.settings.manualLevel.value.label',
		hint: 'COSMERE_WORKBENCH.settings.manualLevel.value.desc',
		scope: 'world',
		config: true,
		requiresReload: false,
		onChange: value => {
			const actors = Array.from(game.actors);
			actors.forEach((actor) => {
				if (actor.type === 'character') {
					actor.update({ 'system.level.total.override': value });
					if (actor.system.level.total.useOverride
						!== game.settings.get('cosmere-rpg-workbench', 'manualLevelToggle')
					) {
						actor.update({ 'system.level.total.useOverride': true });
					}
				}
			});
		},
		type: Number,
		default: 0,
	});
}

async function registerTrackerBars() {
	await game.settings.register('cosmere-rpg-workbench', 'encumbranceBar', {
		name: 'COSMERE_WORKBENCH.settings.encumbranceBar.label',
		hint: 'COSMERE_WORKBENCH.settings.encumbranceBar.desc',
		scope: 'client',
		config: true,
		requiresReload: true,
		type: Boolean,
		default: true,
	});
	await game.settings.register('cosmere-rpg-workbench', 'encumbranceBarGlobal', {
		name: 'COSMERE_WORKBENCH.settings.encumbranceBar.global.label',
		hint: 'COSMERE_WORKBENCH.settings.encumbranceBar.global.desc',
		scope: 'world',
		config: true,
		requiresReload: true,
		type: Boolean,
		default: true,
	});

	await game.settings.register('cosmere-rpg-workbench', 'currencyBar', {
		name: 'COSMERE_WORKBENCH.settings.currencyBar.label',
		hint: 'COSMERE_WORKBENCH.settings.currencyBar.desc',
		scope: 'client',
		config: true,
		requiresReload: true,
		type: Boolean,
		default: true,
	});
	await game.settings.register('cosmere-rpg-workbench', 'currencyBarGlobal', {
		name: 'COSMERE_WORKBENCH.settings.currencyBar.global.label',
		hint: 'COSMERE_WORKBENCH.settings.currencyBar.global.desc',
		scope: 'world',
		config: true,
		requiresReload: true,
		type: Boolean,
		default: true,
	});
}
