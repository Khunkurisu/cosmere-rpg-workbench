import { CompendiumManager } from "../helpers/compendium-manager.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

export class CompendiumBrowser extends HandlebarsApplicationMixin(ApplicationV2) {
	static DEFAULT_OPTIONS = {
		form: {
			handler: CompendiumBrowser.#onSubmit,
			closeOnSubmit: false,
		},
		position: {
			width: 800,
			height: "auto",
		},
		classes: ['cosmere-rpg', 'sheet', 'item'],
		actions: {
			cancel: CompendiumBrowser.onCancel,
			'show-item-sheet': CompendiumBrowser.showItemSheet,
			'set-tab': CompendiumBrowser.setTab,
		},
		dragDrop: [{
			dragSelector: '[data-drag]',
			dropSelector: '*',
		}],
		tag: 'form',
		window: {
			title: 'workbench.applications.compendiumBrowser.title',
			resizable: true,
		},
	}

	compendiumManager = new CompendiumManager();
	tabsList = ['action', 'background', 'equipment', 'power', 'meta', 'actor'];
	itemsList = this.compendiumManager.getFilteredItems('action');
	activeTab = 'action';
	lastActiveTab = 'action';
	renderedCount = 0;

	static PARTS = {
		form: {
			template: 'modules/cosmere-rpg-workbench/templates/applications/compendium-browser.hbs'
		}
	}

	get title() {
		return `Cosmere RPG Workbench: ${game.i18n.localize(this.options.window.title)}`;
	}

	_prepareContext(options) {
		if (this.lastActiveTab !== this.activeTab) {
			this.itemsList = this.compendiumManager.getFilteredItems(this.activeTab);
		}
		return {
			tabs: this.getTabs(),
			items: this.itemsList,
			tabTitle: `workbench.applications.compendiumBrowser.tabs.${this.activeTab}`,
			config: CONFIG.COSMERE_WORKBENCH,
		};
	}

	getTabs() {
		const tabs = {};
		this.tabsList.forEach(tab => {
			tabs[tab] = {
				id: tab,
				label: `workbench.applications.compendiumBrowser.tabs.${tab}`,
				cssClass: this.activeTab === tab ? 'active' : '',
			};
		});
		return tabs;
	}

	static #onSubmit(event, form, formData) {

	}

	static onCancel(event, target) {
		this.close();
	}

	static setTab(event, target) {
		this.lastActiveTab = this.activeTab;
		this.activeTab = target.dataset.tab;
		this.render(true);
	}

	static showItemSheet(event, target) {
		const listElement = $(target).parent().parent();
		const dataset = listElement[0].dataset;
		const itemId = dataset.itemId;
		const packId = dataset.packId;
		const uuid = `Compendium.${packId}.Item.${itemId}`;

		const item = game.packs.get(packId).get(itemId);
		item.sheet.render(true);

		ui.notifications.info(`Loading item ${uuid}`);
	}

	_onRender(context, options) {
		/* if (this.renderedCount < 1) {
			this.renderedCount++;
			this.activeTab = 'action';
			this.render(true);
		} */

		this.#dragDrop.forEach((d) => d.bind(this.element));
	}

	// Implement Drag Drop Functionality

	constructor(options = {}) {
		super(options);
		this.#dragDrop = this.#createDragDropHandlers();
	}

	#createDragDropHandlers() {
		return this.options.dragDrop.map((d) => {
			d.permissions = {
				dragstart: this._canDragStart.bind(this),
				drop: this._canDragDrop.bind(this),
			};
			d.callbacks = {
				dragstart: this._onDragStart.bind(this),
				dragover: this._onDragOver.bind(this),
				drop: this._onDrop.bind(this),
			};
			return new DragDrop(d);
		});
	}

	#dragDrop;

	get dragDrop() {
		return this.#dragDrop;
	}

	_canDragStart(selector) {
		return true;
	}

	_canDragDrop(selector) {
		return true;
	}

	_onDragStart(event) {
		const el = event.currentTarget;
		if ('link' in event.target.dataset) return;
		const dataset = el.dataset;

		const itemId = dataset.itemId;
		const packId = dataset.packId;

		let dragData = { type: this.activeTab === 'actor' ? 'Actor' : 'Item', uuid: `Compendium.${packId}.Item.${itemId}` };

		if (!dragData) return;

		event.dataTransfer.setData('text/plain', JSON.stringify(dragData));
	}

	_onDragOver(event) { };

	async _onDrop(event) {
		const data = TextEditor.getDragEventData(event);
	}
}
