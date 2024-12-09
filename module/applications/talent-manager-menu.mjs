const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

export class TalentManagerMenu extends HandlebarsApplicationMixin(ApplicationV2) {
	static DEFAULT_OPTIONS = {
		id: 'custom-skill-menu',
		form: {
			handler: TalentManagerMenu.#onSubmit,
			closeOnSubmit: false,
		},
		position: {
			width: 640,
			height: 'auto',
		},
		actions: {
			setImage: TalentManagerMenu.setImage,
			toggle: TalentManagerMenu.toggleAppend,
			cancel: TalentManagerMenu.onCancel,
		},
		tag: 'form',
		window: {
			title: 'COSMERE_WORKBENCH.applications.talentManager.menu',
			contentClasses: ["standard-form", 'cosmere-rpg-workbench'],
		},
	}

	entries = [...this._talentTrees()];
	append = false;

	_talentTrees() {
		const items = Array.from(game.items);
		const talentTrees = [];
		items.forEach((item) => {
			if (item.type === 'talent_tree') {
				talentTrees.push({
					id: item._id,
					name: item.name,
					img: item.img
				});
			}
		});
		return talentTrees;
	}

	static PARTS = {
		form: {
			template: 'modules/cosmere-rpg-workbench/templates/applications/talent-manager.hbs'
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

		return {
			entries: [...this.entries],
			buttons: [
				{ type: "submit", icon: "fa-solid fa-save", label: "SETTINGS.Save" },
				{ type: "button", icon: "fa-solid fa-ban", label: "Cancel", action: "cancel" },
			],
			config: CONFIG.COSMERE_WORKBENCH,
		};
	}

	static #onSubmit(event, form, formData) {
		entries.forEach((tree) => {
			const item = game.items.get(tree.id);
			if (item) {
				let name = tree.name;
				const appendString = ' (Talent Tree)';
				if (append && !(name.includes(appendString))) {
					name += appendString;
				}
				item.name = name;
				item.img = tree.img;
			}
		});
		this.close();
	}

	static onCancel(event, target) {
		this.close();
	}

	static toggleAppend(event, target) {
		this.append = !this.append;

		this.render({ force: false });
	}

	static async setImage(event, target) {
		const dataset = target.dataset;
		const entry = entries[dataset.index];
		const img = entry.img;
		const fp = new FilePicker({
			img,
			type: 'image',
			redirectToRoot: img ? [img] : [],
			callback: (path) => {
				entry.img = path;
				this.render({ force: false });
			},
			top: this.position.top + 40,
			left: this.position.left + 10,
		});
		return fp.browse();
	}

	_onRender(context, options) {
		const html = $(this.element);

		html.on("change", ".entry-input", this.onEntryChange.bind(this));
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
}
