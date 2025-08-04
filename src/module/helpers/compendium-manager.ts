import { StoredDocument } from "@league-of-foundry-developers/foundry-vtt-types/src/types/utils.mjs";
import { ActorTypes, ItemTypes, MODULE_ID, SETTINGS, STORMLIGHT_HANDBOOK, STORMLIGHT_WORLDGUIDE, SYSTEM_ID } from "../constants";

export class CompendiumManager {
	constructor();
	constructor(json?: CompendiumManager) {
		if (json) {
			Object.assign(this, json);
		}
	}

	get hideSystem(): boolean {
		if (game.settings?.get(MODULE_ID, SETTINGS.GENERAL_HIDE_SYSTEM_COMPENDIUMS)) {
			return game.modules?.get(STORMLIGHT_HANDBOOK).active;
		}
		return false;
	}

	get validSubtypes(): string[] {
		let types = this.validItemTypes;
		types.push(...this.validActorTypes);
		return types;
	};

	get validItemTypes(): string[] {
		return Object.values(ItemTypes);
	};

	get validActorTypes(): string[] {
		let types = Object.values(ActorTypes);
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
			const ids = id as string[];
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
		let packs: CompendiumCollection<CompendiumCollection.Metadata>[] = Array.from(game.packs as Iterable<any>);
		return packs.filter((pack: CompendiumCollection<CompendiumCollection.Metadata>) => {
			return !this.isTrackedPack(pack);
		});
	}

	get includedPacks(): CompendiumCollection<CompendiumCollection.Metadata>[] {
		let packs: CompendiumCollection<CompendiumCollection.Metadata>[] = Array.from(game.packs as Iterable<any>);
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

	public async getFilteredContents(subtypes: (ItemTypes | ActorTypes)[]): Promise<(StoredDocument<Actor | Item>)[]>;
	public async getFilteredContents(subtypes: ItemTypes | ActorTypes): Promise<(StoredDocument<Actor | Item>)[]>;
	public async getFilteredContents(
		subtype: ItemTypes | ActorTypes | (ItemTypes | ActorTypes)[]
	): Promise<(StoredDocument<Actor | Item>)[]> {
		var subtypes: (ItemTypes | ActorTypes)[] = [];
		if (subtype.constructor === Array) {
			subtypes = subtype as (ItemTypes | ActorTypes)[];
		} else {
			subtypes.push(subtype as ItemTypes | ActorTypes);
		}

		let allDocuments: (StoredDocument<Actor | Item>)[] = [];
		console.log(this.cachedPacks);
		for (let type of subtypes) {
			if (!(this.isValidSubtype(type as ItemTypes | ActorTypes))) {
				continue;
			}
			let cachedPack: CachedPack;
			if (type in this.cachedPacks) {
				cachedPack = this.cachedPacks[type];
				console.log(cachedPack);
				if (Date.now() - cachedPack.lastUpdated < this.cacheTimer) {
					console.log('THE CACHE IS NOT OLD YET');
					allDocuments.push(...cachedPack.documents);
					continue;
				}
			} else {
				cachedPack = {
					lastUpdated: Date.now(),
					documents: [],
				};
			}

			let packs = this.includedPacks;
			for (let pack of packs) {
				const document = (await pack.getDocuments({ type: type }) as (StoredDocument<Actor | Item>)[]);
				cachedPack.documents.push(...document);
				allDocuments.push(...document);
			}
			this.cachedPacks[type] = cachedPack;
		}

		return Promise.resolve(allDocuments);
	}
}

interface CachedPacks {
	[key: string]: CachedPack
}

interface CachedPack {
	[key: string]: (StoredDocument<Actor | Item>)[] | number,
	lastUpdated: number,
	documents: (StoredDocument<Actor | Item>)[],
}
