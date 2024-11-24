const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

export class CustomSkillMenu extends HandlebarsApplicationMixin(ApplicationV2) {
	static DEFAULT_OPTIONS = {
		id: 'custom-skill-menu',
		form: {
			handler: CustomSkillMenu.#onSubmit,
			closeOnSubmit: true,
		},
		position: {
			width: 640,
			height: 'auto',
		},
		actions: {
			create: CustomSkillMenu.createEntry,
			remove: CustomSkillMenu.removeEntry,
			toggle: CustomSkillMenu.toggleEntry,
			cancel: CustomSkillMenu.onCancel,
		},
		tag: 'form',
		window: {
			title: 'COSMERE_WORKBENCH.applications.customSkills.menu',
			contentClasses: ["standard-form", 'cosmere-rpg-workbench'],
		},
	}

	entries = [...game.settings.get('cosmere-rpg-workbench', 'customSkills')];

	static PARTS = {
		form: {
			template: 'modules/cosmere-rpg-workbench/templates/applications/custom-skills.hbs'
		},
		footer: {
			template: "templates/generic/form-footer.hbs",
		},
	}

	get title() {
		return `Cosmere RPG Workbench: ${game.i18n.localize(this.options.window.title)}`;
	}

	_prepareContext(options) {
		if (this.entries.length === 1) {
			if (!this.entries[0].id) this.entries = [];
		}
		console.log(CONFIG.COSMERE.attributes);
		return {
			entries: [...this.entries],
			buttons: [
				{ type: "submit", icon: "fa-solid fa-save", label: "SETTINGS.Save" },
				{ type: "button", icon: "fa-solid fa-ban", label: "Cancel", action: "cancel" },
			],
			attributes: CONFIG.COSMERE.attributes,
			config: CONFIG,
		};
	}

	static #onSubmit(event, form, formData) {
		const data = [...this.entries];
		game.settings.set('cosmere-rpg-workbench', 'customSkills', data);
	}

	static onCancel(event, target) {
		this.close();
	}

	static createEntry(event, target) {
		const entries = this.entries;

		entries.push({
			id: 'new-custom-skill',
			label: 'New Custom Skill',
			attribute: 'str',
			core: false
		});

		this.render({ force: false });
	}

	static removeEntry(event, target) {
		const dataset = target.dataset;
		const entries = this.entries;

		entries.splice(dataset.index, 1);

		this.render({ force: false });
	}

	static toggleEntry(event, target) {
		const dataset = target.dataset;
		const entries = this.entries;

		entries[dataset.index].core = !(entries[dataset.index].core);

		this.render({ force: false });
	}

	_onRender(context, options) {
		const html = $(this.element);

		html.on("change", ".entry-input", this.onEntryChange.bind(this));
		html.on("change", ".entry-attribute", this.onAttributeChange.bind(this));
	}

	/**
	 * Handle changing entry text.
	 * @param {Event} event   The originating change event
	 * @private
	 */
	onEntryChange(event) {
		event.preventDefault();
		const element = event.currentTarget;
		const dataset = element.dataset;
		const entries = this.entries;

		entries[dataset.index][dataset.key] = element.value;

		this.render({ force: false });
	}

	/**
	 * Handle changing entry attribute.
	 * @param {Event} event   The originating change event
	 * @private
	 */
	onAttributeChange(event) {
		event.preventDefault();
		const element = event.currentTarget;
		const dataset = element.dataset;
		const entries = this.entries;

		console.log(dataset.index);
		console.log(element);

		console.log(entries[dataset.index]);
		entries[dataset.index].attribute = element.value;
		console.log(entries[dataset.index]);

		this.render({ force: false });
	}
}
