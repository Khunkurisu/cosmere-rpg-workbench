const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

export class LevelupManagerMenu extends HandlebarsApplicationMixin(ApplicationV2) {
	static DEFAULT_OPTIONS = {
		id: 'levelup-manager-menu',
		position: {
			width: 720,
			height: 'auto',
		},
		tag: 'div',
		window: {
			title: 'COSMERE_WORKBENCH.applications.levelup.menu',
			contentClasses: ['cosmere-rpg-workbench'],
		},
	}

	talentTrees = [...this._talentTrees()];
	actor;

	static PARTS = {
		form: {
			template: 'modules/cosmere-rpg-workbench/templates/applications/talent-manager.hbs'
		},
	}

	get title() {
		return `Cosmere RPG Workbench: ${game.i18n.localize(this.options.window.title)}`;
	}

	_prepareContext(options) {
		if (this.talentTrees.length === 1) {
			if (!this.talentTrees[0].id) this.talentTrees = [];
		}

		const pathsList = this._getPaths(this.actor);

		return {
			actor: this.actor,
			paths: pathsList,
			colCount: (pathsList.length >= 3 ? 3 : pathsList.length)
		};
	}

	_getPaths(actor) {
		if (!actor || !actor.items) return;
		let paths = [];
		console.log(this.talentTrees);
		Array.from(actor.items).forEach((item) => {
			if (item.type === 'path') {
				const path = {
					name: item.name,
					id: item._id,
				};
				paths.push(path);
			}
		});
	}

	_enrichableLabel(uuid, label) {
		return `@UUID[${uuid}]{${label}}`;
	}

	_talentTrees() {
		const items = Array.from(game.items);
		const talentTrees = [];
		items.forEach((item) => {
			if (item.type === 'talent_tree') {
				talentTrees.push(item.uuid);
			}
		});
		const packs = Array.from(game.packs);

		packs.forEach((pack) => {
			if (pack.metadata.type === 'Item') {
				Array.from(pack.index).forEach((item) => {
					if (item.type === 'talent_tree') {
						talentTrees.push(item.uuid);
					}
				});
			}
		});

		return talentTrees;
	}
}
