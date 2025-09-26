import { AnyObject, StoredDocument } from "@league-of-foundry-developers/foundry-vtt-types/src/types/utils.mjs"

export interface CachedPacks {
	[key: string]: CachedPack
}

export interface CachedPack {
	[key: string]: (StoredDocument<Actor | Item>)[] | number,
	lastUpdated: number,
	documents: (StoredDocument<Actor | Item>)[],
}

export interface Tabs {
	[key: string]: any
}

export enum TabTypes {
	Action = 'action',
	Background = 'background',
	Equipment = 'equipment',
	Meta = 'meta',
	Actor = 'actor',
}

export interface Context extends AnyObject {
	tabs: Tabs,
	items: StoredDocument<Actor | Item>[],
	tabTitle: string,
	tabPlural: string,
	config: typeof COSMERE_WORKBENCH,
	search: string,
}

export interface TabFilters {
	[key: string]: SubtypeFilter,
}

export interface SubtypeFilter {
	[key: string]: boolean,
}
