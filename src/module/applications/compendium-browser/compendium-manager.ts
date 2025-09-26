import { StoredDocument } from "@league-of-foundry-developers/foundry-vtt-types/src/types/utils.mjs";
import { ActorTypes, ItemTypes, MODULE_ID, SETTINGS, STORMLIGHT_HANDBOOK, STORMLIGHT_WORLDGUIDE, SYSTEM_ID } from "../../constants";
import Fuse from "fuse.js";
import { TabFilters, TabTypes, CachedPacks, CachedPack } from "./definitions";

export class CompendiumManager {
	constructor();
	constructor(json?: CompendiumManager) {
		if (json) {
			Object.assign(this, json);
		}
	}

	get hideSystem(): boolean {
		if (game.settings?.get(MODULE_ID, SETTINGS.GENERAL_HIDE_SYSTEM_COMPENDIUMS)) {
			return game.modules?.get(STORMLIGHT_HANDBOOK)?.active;
		}
		return false;
	}

	get validSubtypes(): string[] {
		const types = this.validItemTypes;
		types.push(...this.validActorTypes);
		return types;
	};

	get validItemTypes(): string[] {
		return Object.values(ItemTypes);
	};

	get validActorTypes(): string[] {
		const types = Object.values(ActorTypes);
		return types.filter((type) => type !== ActorTypes.Character);
	}

	private isValidSubtype(subtype: ActorTypes | ItemTypes): boolean {
		return this.validSubtypes.includes(subtype);
	}

	private trackedPacks: string[] = [
		SYSTEM_ID,
		STORMLIGHT_HANDBOOK,
		STORMLIGHT_WORLDGUIDE,
	];

	private removeTrackedPacks(ids: string[]): void;
	private removeTrackedPacks(id: string, removeAll: boolean): void;
	private removeTrackedPacks(id: string | string[], removeAll?: boolean): void {
		if (id.constructor === Array) {
			const ids = id;
			this.trackedPacks = this.trackedPacks.filter(packId => !ids.includes(packId));
		} else {
			if (removeAll) {
				this.trackedPacks = this.trackedPacks.filter(packId => {
					const idHead = `${id as string}.`;
					return !(packId.includes(idHead) || packId === id);
				});
			} else {
				this.trackedPacks = this.trackedPacks.filter(packId => packId !== id);
			}
		}
	}

	get filteredPacks(): CompendiumCollection<CompendiumCollection.Metadata>[] {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const packs: CompendiumCollection<CompendiumCollection.Metadata>[] = Array.from(game.packs as Iterable<any>);
		return packs.filter((pack: CompendiumCollection<CompendiumCollection.Metadata>) => {
			return !this.isTrackedPack(pack);
		});
	}

	get includedPacks(): CompendiumCollection<CompendiumCollection.Metadata>[] {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const packs: CompendiumCollection<CompendiumCollection.Metadata>[] = Array.from(game.packs as Iterable<any>);
		return packs.filter((pack: CompendiumCollection<CompendiumCollection.Metadata>) => {
			return this.isTrackedPack(pack);
		});
	}

	private isTrackedPack(pack: CompendiumCollection<CompendiumCollection.Metadata>): boolean {
		const data = pack.metadata;
		let notSystemData = true;
		if (this.hideSystem) {
			notSystemData = data.packageName !== SYSTEM_ID;
		}
		return (
			this.isTrackedId(data.id)
			|| this.isTrackedName(data.packageName)
		)
			&& notSystemData;
	}

	private isTrackedId(id: string) {
		return this.trackedPacks.includes(id);
	}

	private isTrackedName(name: string) {
		return this.trackedPacks.includes(name);
	}

	private cacheTimer: number = 4 * 60 * 60 * 1000;

	public cachedPacks: CachedPacks = {
	};

	public async getFilteredContents(subtypes: (ItemTypes | ActorTypes)[], searchString?: string)
		: Promise<(StoredDocument<Actor | Item>)[]>;
	public async getFilteredContents(subtypes: ItemTypes | ActorTypes, searchString?: string)
		: Promise<(StoredDocument<Actor | Item>)[]>;
	public async getFilteredContents(
		subtype: ItemTypes | ActorTypes | (ItemTypes | ActorTypes)[], searchString = ''
	): Promise<(StoredDocument<Actor | Item>)[]> {
		let subtypes: (ItemTypes | ActorTypes)[] = [];
		if (subtype.constructor === Array) {
			subtypes = subtype;
		} else {
			subtypes.push(subtype as ItemTypes | ActorTypes);
		}

		const filters = game.settings?.get(MODULE_ID, SETTINGS.CLIENT_COMPENDIUM_FILTERS) as TabFilters;
		subtypes = subtypes.filter(subtype => {
			for (const tabType of Object.values(TabTypes)) {
				if (Object.keys(filters).includes(tabType) && filters[tabType][subtype]) return false;
			}
			return true;
		});

		const allDocuments: (StoredDocument<Actor | Item>)[] = [];
		for (const type of subtypes) {
			if (!(this.isValidSubtype(type))) {
				continue;
			}
			let cachedPack: CachedPack;
			if (type in this.cachedPacks) {
				cachedPack = this.cachedPacks[type];
				if (Date.now() - cachedPack.lastUpdated < this.cacheTimer) {
					allDocuments.push(...cachedPack.documents);
					continue;
				}
			} else {
				cachedPack = {
					lastUpdated: Date.now(),
					documents: [],
				};
			}

			const packs = this.includedPacks;
			for (const pack of packs) {
				const document = (await pack.getDocuments({ type: type }) as (StoredDocument<Actor | Item>)[]);
				cachedPack.documents.push(...document);
				allDocuments.push(...document);
			}
			this.cachedPacks[type] = cachedPack;
		}

		const searchResults = await this.fuzzySearchContents(allDocuments, searchString);

		return Promise.resolve(searchResults);
	}

	private async fuzzySearchContents(contents: (StoredDocument<Actor | Item>)[], searchText = '')
		: Promise<(StoredDocument<Actor | Item>)[]> {
		if (searchText === '') {
			return Promise.resolve(contents);
		}

		const fuseOptions = {
			threshold: 0.3,
			shouldSort: false,
			keys: [
				"name",
			],
		};
		const fuse = new Fuse(contents, fuseOptions);
		const results = fuse.search(searchText);

		const documents: (StoredDocument<Actor | Item>)[] = [];
		for (const result of results) {
			documents.push(result.item);
		}

		return Promise.resolve(documents);
	}
}
