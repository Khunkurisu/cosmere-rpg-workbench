import { CustomSkillMenu } from './applications/custom-skills-menu.mjs';
import { COSMERE_WORKBENCH } from './helpers/config.mjs';
import { preloadHandlebarsTemplates } from './helpers/templates.mjs';
import { InjectCurrencyCounter } from './sheets/actor-sheet-currency-counter.mjs';

let registeredSkills;

Hooks.once('init', async function () {
	CONFIG.COSMERE_WORKBENCH = COSMERE_WORKBENCH;
	await registerSettings();

	registeredSkills = game.settings.get('cosmere-rpg-workbench', 'customSkills');
	console.log(registeredSkills);
	if (!Hooks.call('customSkillRegistry', registeredSkills)) {
		return;
	}
	console.log(registeredSkills);

	registeredSkills.forEach((skill) => {
		let isValid = true;
		if (!CONFIG.COSMERE.attributes[skill.attribute]) {
			isValid = false;
		}
		if (!skill.label || !skill.id) {
			isValid = false;
		}
		if (isValid) {
			cosmereRPG.api.registerSkill(skill);
		}
	});

	// Preload Handlebars templates.
	return preloadHandlebarsTemplates();
});

Hooks.once('ready', () => {
	registeredSkills.forEach((skill) => {
		game.i18n.translations.COSMERE.Skill[skill.id] = skill.label;
	});
	console.log(game.i18n.translations.COSMERE.Skill);
});

Hooks.on('renderActorSheetV2', async (o, i, n) => {
	await InjectCurrencyCounter(o, i);
	return true;
});

Handlebars.registerHelper('isSelected', function (arg1, arg2) {
	return (arg1 == arg2) ? "selected" : "";
});

async function registerSettings() {
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
		requiresReload: true,
	});
}
