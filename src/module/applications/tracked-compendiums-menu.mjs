import { MODULE_ID, SETTINGS } from "../constants";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

export class TrackedCompendiumsMenu extends HandlebarsApplicationMixin(ApplicationV2) {
	static DEFAULT_OPTIONS = {
		id: 'tracked-compendiums-menu',
		form: {
			handler: TrackedCompendiumsMenu.#onSubmit,
			closeOnSubmit: false,
		},
		position: {
			width: 640,
			height: 'auto',
		},
		actions: {
			create: TrackedCompendiumsMenu.createEntry,
			remove: TrackedCompendiumsMenu.removeEntry,
			toggle: TrackedCompendiumsMenu.toggleEntry,
			cancel: TrackedCompendiumsMenu.onCancel,
		},
		tag: 'form',
		window: {
			title: 'workbench.applications.trackedCompendiums.menu',
			contentClasses: ["standard-form", 'cosmere-rpg-workbench'],
		},
	}

	trackedCompendiums = [...game.settings.get(MODULE_ID, SETTINGS.GENERAL_TRACKED_COMPENDIUMS)];

	static PARTS = {
		form: {
			template: 'modules/cosmere-rpg-workbench/templates/applications/tracked-compendiums.hbs'
		},
		footer: {
			template: "templates/generic/form-footer.hbs",
		},
	}

	get title() {
		return `Cosmere RPG Workbench: ${game.i18n.localize(this.options.window.title)}`;
	}

	_prepareContext(options) {
		if (this.trackedCompendiums.length === 1) {
			if (!this.trackedCompendiums[0].id) this.trackedCompendiums = [];
		}

		return {
			entries: [...this.trackedCompendiums],
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
		let lastChecked;
		let isValid = true;
		data.every((skill => {
			if (lastChecked) {
				if (skill.id === lastChecked.id) {
					isValid = false;
				}
			}
			lastChecked = skill;
			return isValid;
		}));

		if (isValid) {
			game.settings.set(MODULE_ID, SETTINGS.GENERAL_TRACKED_COMPENDIUMS, data);
			this.close();
		} else {
			ui.notifications.error("Identifiers must be unique.");
		}
	}

	static onCancel(event, target) {
		this.close();
	}

	static createEntry(event, target) {
		const entries = this.entries;

		entries.push({
			id: 'ncs',
			label: 'New Skill',
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
		const entries = this.trackedCompendiums;

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
		const entries = this.trackedCompendiums;

		entries[dataset.index].attribute = element.value;

		this.render({ force: false });
	}
}
