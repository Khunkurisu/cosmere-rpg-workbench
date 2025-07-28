class PackItemList {
	constructor(subtypes) {
		subtypes.forEach(subtype => {
			this.subtypes[subtype] = [];
		});
	}

	subtypes = {};
	filtered = [];
	filters = new PackFilter;
}

class PackFilter {
	constructor(json) {
		if (json) {
			Object.assign(this, json);
		}
	}

	sources = [];
	types = [];

	doesMatch(filter) {
		const sourcesMatch = this.sources.sort().join(',') === filter.sources.sort().join(',');
		const typesMatch = this.types.sort().join(',') === filter.types.sort().join(',');

		return sourcesMatch && typesMatch;
	}
}

class TrackedCompendiums {
	constructor(addNew = false, packs = []) {
		if (addNew) {
			Array.from(game.packs).forEach(pack => {
				const packName = pack.metadata.name;
				if (!(packName in packs)) { packs.push(packName); }
			});
		}
		this.addNew = addNew;
		this.packs = packs;
	}

	packs = [];
	addNew = false;
}

export class CompendiumManager {
	constructor(json) {
		if (json) {
			Object.assign(this, json);
		}
		this.loadTrackedPacks();
	}

	lastLoaded = 0;
	lastTab = 'action';
	sort = 'default';
	packItems = {
		action: new PackItemList(['action', 'talent', 'trait']),
		background: new PackItemList(['culture', 'path', 'ancestry']),
		equipment: new PackItemList(['weapon', 'armor', 'equipment']),
		power: new PackItemList(['power']),
		meta: new PackItemList(['goal', 'connection']),
	}
	tracked = {
		'cosmere-rpg': new TrackedCompendiums(true),
		'cosmere-rpg-stormlight-handbook': new TrackedCompendiums(true),
		'cosmere-rpg-playtest': new TrackedCompendiums(true),
		'cosmere-radiant-homebrew': new TrackedCompendiums(true),
	}

	getFilteredItems(type) {
		return this.packItems[type]?.filtered;
	}

	filterItems(type, filter, force = false) {
		const packItems = this.packItems[type];
		if (force || !filter.doesMatch(packItems.filters)) {
			packItems.filters = filter;
			let filteredItems = [];
			console.log(filter.sources);
			for (let key in this.tracked) {
				if (key in filter.sources) { continue; }
				const packs = []
				this.tracked[key].packs.forEach(pack => {
					const packName = pack.metadata.name;
					if (!(packName in filter.sources) && !(`${key}.${packName}` in filter.sources)) {
						packs.push(pack);
					}
				});
			}
		}
	}

	addTrackedModule(module, packs = [], addNew = false) {
		if (typeof (module) !== 'string') {
			module = module.id;
		}
		if (!module) { return; }

		this.tracked[module] = {
			packs: packs,
			addNew: addNew,
		}
	}

	removeTrackedModule(module) {
		if (typeof (module) !== 'string') {
			module = module.id;
		}
		if (!module) { return; }

		delete this.tracked[module];
	}

	addTrackedPack(pack) {
		if (typeof (pack) === 'string') {
			pack = game.packs.get(pack);
		}

		const packName = pack.metadata.name;
		const packModule = pack.metadata.packageName;

		if (packModule in this.tracked) {
			const trackedModule = this.tracked[packModule];
			if (!trackedModule.packs.includes(packName)) {
				trackedModule.packs.push(packName);
			}
		} else {
			this.addTrackedModule(packModule, [packName]);
		}
	}

	removeTrackedPack(pack) {
		if (typeof (pack) === 'string') {
			pack = game.packs.get(pack);
		}

		const packName = pack.metadata.name;
		const packModule = pack.metadata.packageName;

		if (packModule in this.tracked) {
			const trackedModule = this.tracked[packModule];
			if (trackedModule.packs.includes(packName)) {
				trackedModule.packs = trackedModule.packs.filter(e => e !== packName);
			}
		}
	}

	isTrackedPack(pack) {
		if (typeof (pack) === 'string') {
			pack = game.packs.get(pack);
		}

		const packName = pack.metadata.name;
		const packModule = pack.metadata.packageName;

		if (packModule in this.tracked) {
			const trackedModule = this.tracked[packModule];
			return trackedModule.packs.includes(packName);
		}
		return false;
	}

	loadTrackedPacks() {
		/* const loadDelta = Date.now() - this.lastLoaded;
		if (loadDelta > 2.592e+8) { return; } */
		let compendiumPacks = [];
		Array.from(game.packs).forEach(compendiumPack => {
			if (this.isTrackedPack(compendiumPack)) {
				compendiumPacks.push(compendiumPack);
			}
		});

		let packIndex = 1;
		compendiumPacks.forEach(async (pack) => {
			const packBarTitle = `Compiling Packs (${packIndex}/${compendiumPacks.length})`;
			const packBarPercent = (packIndex / compendiumPacks.length) * 100;
			SceneNavigation.displayProgressBar({
				label: packBarTitle,
				pct: packBarPercent,
			});

			pack._getVisibleTreeContents().forEach(async (document) => {
				const item = await pack.getDocument(document._id);
				for (let key in this.packItems) {
					const packItemList = this.packItems[key];
					if (packItemList.subtypes[item.type]) {
						if (!packItemList.subtypes[item.type].includes(item)) {
							packItemList.subtypes[item.type].push(item);
							packItemList.filtered.push(item);
						}
						break;
					}
				}
			});

			packIndex++;
		});
		this.lastLoaded = Date.now();
	}
}
