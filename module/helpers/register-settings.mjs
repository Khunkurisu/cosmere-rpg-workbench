import { CustomSkillMenu } from '../applications/custom-skills-menu.mjs';
import { CustomCurrencyMenu } from '../applications/custom-currency-menu.mjs';

export async function registerSettings() {
	game.settings.registerMenu('cosmere-rpg-workbench', 'customSkillsMenu', {
		name: 'COSMERE_WORKBENCH.applications.customSkills.pluralLabel',
		label: 'COSMERE_WORKBENCH.applications.customSkills.menu',
		hint: 'COSMERE_WORKBENCH.applications.customSkills.desc',
		icon: 'fas fa-bars',
		type: CustomSkillMenu,
		restricted: true,
	});

	await game.settings.register('cosmere-rpg-workbench', 'customCurrency', {
		scope: 'world',
		config: false,
		type: Array,
		default: [],
	});

	game.settings.registerMenu('cosmere-rpg-workbench', 'customCurrencyMenu', {
		name: 'COSMERE_WORKBENCH.applications.customCurrency.pluralLabel',
		label: 'COSMERE_WORKBENCH.applications.customCurrency.menu',
		hint: 'COSMERE_WORKBENCH.applications.customCurrency.desc',
		icon: 'fas fa-bars',
		type: CustomCurrencyMenu,
		restricted: true,
	});

	await game.settings.register('cosmere-rpg-workbench', 'customSkills', {
		scope: 'world',
		config: false,
		type: Array,
		default: [],
	});

	await game.settings.register('cosmere-rpg-workbench', 'autoLevel', {
		name: 'COSMERE_WORKBENCH.settings.autoLevel.label',
		hint: 'COSMERE_WORKBENCH.settings.autoLevel.desc',
		scope: 'world',
		config: true,
		requiresReload: true,
		type: Boolean,
		default: true,
	});

	await game.settings.register('cosmere-rpg-workbench', 'autoInvest', {
		name: 'COSMERE_WORKBENCH.settings.autoInvest.label',
		hint: 'COSMERE_WORKBENCH.settings.autoInvest.desc',
		scope: 'world',
		config: true,
		requiresReload: true,
		type: Boolean,
		default: true,
	});
}
