export function RegisterSkills(registeredSkills) {
	if (!Hooks.call('customSkillRegistry', registeredSkills)) {
		return;
	}

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
}

export function LocalizeSkills(registeredSkills) {
	if (registeredSkills) {
		registeredSkills.forEach((skill) => {
			game.i18n.translations.COSMERE.Skill[skill.id] = skill.label;
		});
	}
}
