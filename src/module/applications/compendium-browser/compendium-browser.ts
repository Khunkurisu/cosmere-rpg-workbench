/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/unbound-method */
import { AnyObject, StoredDocument } from "@league-of-foundry-developers/foundry-vtt-types/src/types/utils.mjs";
import { CompendiumManager } from "./compendium-manager";
import { ItemTypes, ActorTypes, SYSTEM_ID, MODULE_ID, SETTINGS } from "../../constants";
import Tagify, { TagData } from '@yaireo/tagify';
import { Tabs, TabFilters, TabTypes, Context } from "./definitions";


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
			height: "auto" as const,
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
		return `Cosmere RPG Workbench: ${game.i18n?.localize(this.options.window!.title!)}`;
	}

	protected async _prepareContext(): Promise<Context> {
		const contents = await this.getContents();
		return Promise.resolve({
			tabs: this.tabs,
			currentTab: this.activeTab,
			items: contents,
			tabTitle: `workbench.applications.compendiumBrowser.tabs.${this.activeTab}.label`,
			tabPlural: `workbench.applications.compendiumBrowser.tabs.${this.activeTab}.plural`,
			includeLabel: `workbench.applications.compendiumBrowser.filterLabel`,
			excludedTypes: this.excludedTagsString,
			config: CONFIG.COSMERE_WORKBENCH,
			search: this.searchText,
		});
	}

	async getContents(): Promise<StoredDocument<Actor | Item>[]> {
		return this.lastActiveTab === this.activeTab
			? await this.contentsList : await this.compendiumManager.getFilteredContents(this.tabSubtypes, this.searchText);
	}

	get tabs(): Tabs {
		const tabs: Tabs = {
		};
		this.tabsList.forEach(tab => {
			tabs[tab] = {
				id: tab,
				label: `workbench.applications.compendiumBrowser.tabs.${tab}.label`,
				cssClass: this.activeTab === tab ? 'active' : '',
			};
		});
		return tabs;
	}

	get tabSubtypes(): (ItemTypes | ActorTypes)[] {
		const subtypes: (ItemTypes | ActorTypes)[] = [];
		switch (this.activeTab) {
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
			default: {
				subtypes.push(ItemTypes.Action, ItemTypes.Ability, ItemTypes.Talent, ItemTypes.Power);
				break;
			}
		}
		return subtypes;
	}

	get tabTags(): TagData[] {
		const tags: TagData[] = [];
		for (const type of this.tabSubtypes) {
			tags.push({ value: type, class: "color-green", editable: false });
		}
		return tags;
	}

	static onFormEvent(
		this: CompendiumBrowser,
		event: Event,
		form: HTMLFormElement,
		formData: FormDataExtended,
	) {

	}

	static async onCancel(this: CompendiumBrowser) {
		await this.close();
	}

	static async setTab(this: CompendiumBrowser, event: PointerEvent, target: HTMLElement) {
		if (this.activeTab === target.dataset.tab as TabTypes) {
			return;
		}
		this.lastActiveTab = this.activeTab;
		this.activeTab = target.dataset.tab as TabTypes;
		this.searchText = '';
		await this.render(true);
	}

	static async showItemSheet(this: CompendiumBrowser, event: PointerEvent, target: HTMLElement) {
		const listElement = $(target);
		const dataset = listElement[0].dataset;
		const itemId = dataset.itemId!;
		const packId = dataset.packId!;
		const uuid = `Compendium.${packId}.Item.${itemId}`;

		const item = await fromUuid(uuid) as CosmereItem | null;
		item!.sheet?.render(true);

		ui.notifications.info(`Loading item ${uuid}`);
	}

	protected _onRender(this: CompendiumBrowser, context: AnyObject, options: AnyObject) {
		this.#dragDrop.forEach((d: any) => d.bind(this.element));

		this.element
			.querySelector(`#compendium-search-${this.activeTab}`)!
			.addEventListener(
				'input',
				this.onSearchInput.bind(this) as EventListener,
			);

		const tagifyElement = this.element.querySelector(`#type-exclusion-${this.activeTab}`);
		const tagify = new Tagify(tagifyElement as HTMLInputElement, {
			maxTags: 10,
			keepInvalidTags: false,
			whitelist: this.tabTags,
			enforceWhitelist: true,
			id: `compendiumBrowser-${game.userId}-${this.activeTab}`,
			dropdown: {
				enabled: 1,            // show suggestion after 1 typed character
				fuzzySearch: false,    // match only suggestions that starts with the typed characters
				position: 'text',      // position suggestions list next to typed text
				caseSensitive: true,   // allow adding duplicate items if their case is different
			},
		});
		tagify.on('add', async (e) => {
			e.preventDefault();
			e.stopPropagation();

			if (e.detail.data?.__isValid) {
				this.excludedTagsList = e.detail.tagify.value;
				await this.setFilter(this.activeTab, e.detail.data.value as ItemTypes | ActorTypes, true);
			}
		});
		tagify.on('remove', async (e) => {
			e.preventDefault();
			e.stopPropagation();

			const oldList = this.excludedTagsString;
			this.excludedTagsList = e.detail.tagify.value;
			if (this.excludedTagsString !== oldList) {
				console.log(this.excludedTagsList);
				await this.setFilters(this.activeTab, this.excludedTagsList, true, true);
			}
		});
	}

	// Implement Search Functionality

	excludedTagsList: TagData[] = [];
	get excludedTagsString(): string {
		return JSON.stringify(this.excludedTagsList);
	}

	private async setFilter(tab: TabTypes, subtype: ItemTypes | ActorTypes, filter: boolean) {
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
		await game.settings?.set(MODULE_ID, SETTINGS.CLIENT_COMPENDIUM_FILTERS, filters);

		this.lastActiveTab = this.activeTab;
		this.activeTab = tab;
		this.contentsList = this.compendiumManager.getFilteredContents(this.tabSubtypes);
		await this.render(true);
	}

	private async setFilters(tab: TabTypes, subtypes: TagData[], filter: boolean, replace = false) {
		const filters = game.settings?.get(MODULE_ID, SETTINGS.CLIENT_COMPENDIUM_FILTERS) as TabFilters;
		let tabFilters;
		if (replace || !(tab in filters)) {
			tabFilters = {};
			filters[tab] = tabFilters;
		} else {
			tabFilters = filters[tab];
		}
		for (const subtype of subtypes) {
			tabFilters[subtype.value] = filter;
		}
		await game.settings?.set(MODULE_ID, SETTINGS.CLIENT_COMPENDIUM_FILTERS, filters);

		this.lastActiveTab = this.activeTab;
		this.activeTab = tab;
		this.contentsList = this.compendiumManager.getFilteredContents(this.tabSubtypes);
		await this.render(true);
	}

	get tabFilters() {
		const filters = game.settings?.get(MODULE_ID, SETTINGS.CLIENT_COMPENDIUM_FILTERS) as TabFilters;
		if (this.activeTab in filters) {
			return filters[this.activeTab];
		}
		return {};
	}

	searchText = '';

	private async onSearchInput(event: Event) {
		if (event.type !== 'input') return;
		event.preventDefault();
		event.stopPropagation();

		this.searchText = (event.target as HTMLInputElement).value;

		await this.render(true);

		const search = $(this.element).find('input')[0];
		search.selectionStart = search.selectionEnd = this.searchText.length;
	}

	// Implement Drag Drop Functionality

	constructor(options = {}) {
		super(options);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		this.#dragDrop = this.#createDragDropHandlers();
	}

	#createDragDropHandlers() {
		// @ts-expect-error setting up a dragdrop interface would be painful
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

		const dragData = { type: this.activeTab === TabTypes.Actor ? 'Actor' : 'Item', uuid: `Compendium.${packId}.Item.${itemId}` };

		if (!dragData) return;

		event.dataTransfer?.setData('text/plain', JSON.stringify(dragData));
	}

	_onDragOver(event: DragEvent) { };

	_onDrop(event: DragEvent) {
		const data = TextEditor.getDragEventData(event);
	}

	static async openCompendiumBrowser(_activeTab = TabTypes.Action, _lastActiveTab = TabTypes.Action) {
		// Polls every 50 milliseconds for a given condition
		const waitFor = async (condition: () => Promise<boolean>, pollInterval = 50, timeoutAfter: number) => {
			// Track the start time for timeout purposes
			const startTime = Date.now();

			while (true) {
				// Check for timeout, bail if too much time passed
				if (typeof (timeoutAfter) === 'number' && Date.now() > startTime + timeoutAfter) {
					break;
				}

				// Check for conditon immediately
				const result = await condition();

				// If the condition is met...
				if (result) {
					// Return the result....
					return result;
				}

				// Otherwise wait and check after pollInterval
				await new Promise(r => setTimeout(r, pollInterval));
			}
			return;
		};

		const browser = new cosmereWorkbench.compendiumBrowser;
		browser.activeTab = _activeTab;
		browser.lastActiveTab = _lastActiveTab;

		await waitFor(async () => (await browser.getContents()).length >= 1, 50, 5000);
		await browser.render(true);
	}

}
