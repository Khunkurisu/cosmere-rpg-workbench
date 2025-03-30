import { CustomSkillMenu } from '../applications/custom-skills-menu.mjs';
import { CustomCurrencyMenu } from '../applications/custom-currency-menu.mjs';

export async function registerSettings() {
	await registerCustomSkills();
	await registerCustomCurrency();
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
}
