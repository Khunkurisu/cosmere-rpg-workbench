/**
 * String identifier for the module used throughout other scripts.
 */
export const MODULE_ID = 'cosmere-rpg-workbench';

/**
 * Full title string of the module.
 */
export const MODULE_NAME = 'Cosmere RPG Workbench';

/**
 * String identifier for the system used throughout other scripts.
 */
export const SYSTEM_ID = 'cosmere-rpg';

/**
 * String identifiers for official modules used throughout other scripts.
 */
export const STORMLIGHT_HANDBOOK = 'cosmere-rpg-stormlight-handbook';
export const STORMLIGHT_WORLDGUIDE = 'cosmere-rpg-stormlight-world-guide';

/**
 * Author name of the module.
 */
export const AUTHOR_NAME = 'Khunkurisu';

export const SETTINGS = {
	CUSTOM_SKILLS: 'customSkills',
	CUSTOM_CURRENCIES: 'customCurrency',
	MENU_CUSTOM_CURRENCY: 'customCurrencyMenu',
	MENU_CUSTOM_SKILL: 'customSkillMenu',
	MENU_TRACKED_COMPENDIUMS: 'trackedCompendiumsMenu',
	SHEET_ENCUMBRANCE_BAR_CLIENT: 'encumbranceBarClient',
	SHEET_ENCUMBRANCE_BAR_WORLD: 'encumbranceBarWorld',
	GENERAL_COMPENDIUM_MANAGER: 'compendiumManager',
	GENERAL_TRACKED_COMPENDIUMS: 'trackedCompendiums',
	GENERAL_HIDE_SYSTEM_COMPENDIUMS: 'hideSystemCompendiums',
	CLIENT_COMPENDIUM_FILTERS: 'clientCompendiumFilters',
} as const;

export enum ItemTypes {
	Weapon = 'weapon',
	Armor = 'armor',
	Equipment = 'equipment',
	Loot = 'loot',
	Ancestry = 'ancestry',
	Culture = 'culture',
	Path = 'path',
	Talent = 'talent',
	Ability = 'trait',
	Action = 'action',
	Connection = 'connection',
	Goal = 'goal',
	Power = 'power',
};

export enum ActorTypes {
	Character = 'character',
	Adversary = 'adversary',
};

export enum DocumentTypes {
	Item = 'item',
	Actor = 'actor',
	Journal = 'journal',
}
