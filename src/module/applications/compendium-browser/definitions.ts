import { AnyObject, StoredDocument } from "@league-of-foundry-developers/foundry-vtt-types/src/types/utils.mjs"
import { COSMERE_WORKBENCH } from "@src/module/helpers/config.mjs"
import { TagData } from "@yaireo/tagify";

export type CachedPacks = Record<string, CachedPack>;

export interface CachedPack {
	[key: string]: (StoredDocument<Actor | Item>)[] | number,
	lastUpdated: number,
	documents: (StoredDocument<Actor | Item>)[],
}

export type Tabs = Record<string, any>;

export enum TabTypes {
	Action = 'action',
	Background = 'background',
	Equipment = 'equipment',
	Meta = 'meta',
	Actor = 'actor',
}

export type TagsList = Record<TabTypes, TagData[]>;

export interface Context extends AnyObject {
	tabs: Tabs,
	items: StoredDocument<Actor | Item>[],
	tabTitle: string,
	tabPlural: string,
	config: typeof COSMERE_WORKBENCH,
	search: string,
}

export type TabFilters = Record<string, SubtypeFilter>;

export type SubtypeFilter = Record<string, boolean>;
