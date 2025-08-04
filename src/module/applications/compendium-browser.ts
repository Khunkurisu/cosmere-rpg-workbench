import { AnyObject, StoredDocument } from "@league-of-foundry-developers/foundry-vtt-types/src/types/utils.mjs";
import { CompendiumManager } from "../helpers/compendium-manager";
import { ItemTypes, ActorTypes, SYSTEM_ID, MODULE_ID, SETTINGS } from "../constants";
import { COSMERE_WORKBENCH } from "../helpers/config.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

export class CompendiumBrowser extends HandlebarsApplicationMixin(
	ApplicationV2<AnyObject>,
) {
	static DEFAULT_OPTIONS = {
		form: {
			handler: CompendiumBrowser.onFormEvent,
			closeOnSubmit: false,
		},
		position: {
			width: 800,
			height: "auto" as "auto",
		},
		classes: [SYSTEM_ID, 'sheet', 'item'],
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
	tabsList = Object.values(TabTypes);
	contentsList = this.compendiumManager.getFilteredContents(this.tabSubtypes);
	activeTab: TabTypes = TabTypes.Action;
	lastActiveTab: TabTypes = TabTypes.Action;

	static PARTS = {
		form: {
			template: 'modules/cosmere-rpg-workbench/templates/applications/compendium-browser.hbs'
		}
	}

	get title() {
		return `Cosmere RPG Workbench: ${game.i18n?.localize(this.options.window?.title as string)}`;
	}

	protected async _prepareContext(): Promise<Context> {
		let contents = await this.getContents();
		return Promise.resolve({
			tabs: this.tabs,
			items: contents,
			tabTitle: `workbench.applications.compendiumBrowser.tabs.${this.activeTab}`,
			config: CONFIG.COSMERE_WORKBENCH,
		});
	}

	async getContents(): Promise<StoredDocument<Actor | Item>[]> {
		return this.lastActiveTab === this.activeTab
			? await this.contentsList : await this.compendiumManager.getFilteredContents(this.tabSubtypes);
	}

	get tabs(): Tabs {
		const tabs: Tabs = {
		};
		this.tabsList.forEach(tab => {
			tabs[tab] = {
				id: tab,
				label: `workbench.applications.compendiumBrowser.tabs.${tab}`,
				cssClass: this.activeTab === tab ? 'active' : '',
			};
		});
		return tabs;
	}

	private setFilter(tab: TabTypes, subtype: ItemTypes | ActorTypes, filter: boolean) {
		const filters = game.settings?.get(MODULE_ID, SETTINGS.CLIENT_COMPENDIUM_FILTERS) as TabFilters;
		let tabFilters;
		if (tab in filters) {
			tabFilters = filters[tab];
			tabFilters[subtype] = filter;
		} else {
			tabFilters = {
				[subtype]: filter,
			};
			filters[tab] = tabFilters;
		}
		game.settings?.set(MODULE_ID, SETTINGS.CLIENT_COMPENDIUM_FILTERS, filters);
	}

	get tabSubtypes(): (ItemTypes | ActorTypes)[] {
		let subtypes: (ItemTypes | ActorTypes)[] = [];
		switch (this.activeTab) {
			case TabTypes.Action: {
				subtypes.push(ItemTypes.Action, ItemTypes.Ability, ItemTypes.Talent, ItemTypes.Power);
				break;
			}
			case TabTypes.Actor: {
				subtypes.push(ActorTypes.Adversary);
				break;
			}
			case TabTypes.Background: {
				subtypes.push(ItemTypes.Ancestry, ItemTypes.Culture, ItemTypes.Path);
				break;
			}
			case TabTypes.Equipment: {
				subtypes.push(ItemTypes.Armor, ItemTypes.Equipment, ItemTypes.Weapon, ItemTypes.Loot);
				break;
			}
			case TabTypes.Meta: {
				subtypes.push(ItemTypes.Connection, ItemTypes.Goal);
				break;
			}
		}
		return subtypes;
	}

	static onFormEvent(
		this: CompendiumBrowser,
		event: Event,
		form: HTMLFormElement,
		formData: FormDataExtended,
	) {

	}

	static onCancel(this: CompendiumBrowser) {
		this.close();
	}

	static setTab(this: CompendiumBrowser, event: PointerEvent, target: HTMLElement) {
		this.lastActiveTab = this.activeTab;
		this.activeTab = target.dataset.tab as TabTypes;
		this.render(true);
	}

	static showItemSheet(this: CompendiumBrowser, event: PointerEvent, target: HTMLElement) {
		const listElement = $(target).parent().parent();
		const dataset = listElement[0].dataset;
		const itemId = dataset.itemId as string;
		const packId = dataset.packId as string;
		const uuid = `Compendium.${packId}.Item.${itemId}`;

		const item = game.packs?.get(packId)?.get(itemId);
		item!.sheet!.render(true);

		ui.notifications.info(`Loading item ${uuid}`);
	}

	_onRender(this: CompendiumBrowser) {
		this.#dragDrop.forEach((d: any) => d.bind(this.element));
	}

	// Implement Drag Drop Functionality

	constructor(options = {}) {
		super(options);
		this.#dragDrop = this.#createDragDropHandlers();
	}

	#createDragDropHandlers() {
		// @ts-ignore
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

	_canDragStart() {
		return true;
	}

	_canDragDrop() {
		return true;
	}

	_onDragStart(event: DragEvent) {
		const el = event.currentTarget as HTMLElement;
		if ('link' in (event.target as HTMLElement).dataset) return;
		const dataset = el.dataset;

		const itemId = dataset.itemId;
		const packId = dataset.packId;

		let dragData = { type: this.activeTab === 'actor' ? 'Actor' : 'Item', uuid: `Compendium.${packId}.Item.${itemId}` };

		if (!dragData) return;

		event.dataTransfer?.setData('text/plain', JSON.stringify(dragData));
	}

	_onDragOver(event: DragEvent) { };

	async _onDrop(event: DragEvent) {
		const data = TextEditor.getDragEventData(event);
	}

}

interface Tabs {
	[key: string]: any
}

enum TabTypes {
	Action = 'action',
	Background = 'background',
	Equipment = 'equipment',
	Meta = 'meta',
	Actor = 'actor',
}

interface Context extends AnyObject {
	tabs: Tabs,
	items: StoredDocument<Actor | Item>[],
	tabTitle: string,
	config: typeof COSMERE_WORKBENCH,
}

interface TabFilters {
	[key: string]: SubtypeFilter,
}

interface SubtypeFilter {
	[key: string]: boolean,
}
