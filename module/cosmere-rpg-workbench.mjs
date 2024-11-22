import { CustomSkillMenu } from './applications/custom-skills-menu.mjs';
import { COSMERE_WORKBENCH } from './helpers/config.mjs';

Hooks.once('init', async function () {
	CONFIG.COSMERE_WORKBENCH = COSMERE_WORKBENCH;
	await registerSettings();
});
Hooks.once('ready', function () {
	const customSkills = game.settings.get('cosmere-rpg-workbench', 'customSkills');
	customSkills.forEach((skill) => {
		console.log(skill);
		cosmereRPG.api.registerSkill(skill);
	});
});

async function registerSettings() {
	game.settings.registerMenu('cosmere-rpg-workbench', 'customSkillsMenu', {
		name: 'Custom Skills',
		label: 'Custom Skills Menu',
		hint: 'Allows you to add custom skills to the Cosmere RPG system.',
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
