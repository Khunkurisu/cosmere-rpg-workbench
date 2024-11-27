import { CustomSkillMenu } from './applications/custom-skills-menu.mjs';
import { COSMERE_WORKBENCH } from './helpers/config.mjs';

Hooks.once('init', async function () {
	CONFIG.COSMERE_WORKBENCH = COSMERE_WORKBENCH;
	await registerSettings();

	const customSkills = game.settings.get('cosmere-rpg-workbench', 'customSkills');
	if (!Hooks.call('customSkillRegistry', customSkills)) {
		return;
	}

	customSkills.forEach((skill) => {
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
