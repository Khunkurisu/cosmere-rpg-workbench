import { MODULE_ID, SETTINGS } from "./constants";
import { CustomCurrencyMenu, CustomSkillMenu, TrackedCompendiumsMenu } from "./applications";
import { CompendiumManager } from "./helpers/compendium-manager.mjs";

export function getModuleSetting<
	T extends string | boolean | number = string | boolean | number,
>(settingKey: string) {
	return game.settings!.get(MODULE_ID, settingKey) as T;
}

export function setModuleSetting<T = unknown>(settingKey: string, value: T) {
	return game.settings!.set(MODULE_ID, settingKey, value);
}

export function registerModuleSettings() {
	// SETTINGS MENUS
	const menuButtons = [
		{
			name: SETTINGS.MENU_CUSTOM_SKILL,
			type: CustomSkillMenu,
		},
		{
			name: SETTINGS.MENU_CUSTOM_CURRENCY,
			type: CustomCurrencyMenu,
		},
		/* {
			name: SETTINGS.MENU_TRACKED_COMPENDIUMS,
			type: TrackedCompendiumsMenu,
		}, */
	];

	menuButtons.forEach(menu => {
		game.settings!.registerMenu(MODULE_ID, menu.name, {
			name: game.i18n!.localize(`workbench.settings.${menu.name}.name`),
			label: game.i18n!.localize(`workbench.settings.${menu.name}.label`),
			hint: game.i18n!.localize(`workbench.settings.${menu.name}.hint`),
			icon: 'fas fa-bars',
			// @ts-ignore
			type: menu.type,
			restricted: true,
		});
	});

	// CONFIG REGISTRATION
	const configOptions = [
		{
			name: SETTINGS.CUSTOM_SKILLS,
			scope: 'world',
		},
		{
			name: SETTINGS.CUSTOM_CURRENCIES,
			scope: 'world',
		},
	];

	configOptions.forEach(option => {
		game.settings!.register(MODULE_ID, option.name, {
			scope: option.scope as "world" | "client" | undefined,
			default: [],
			type: Array,
			config: false,
		});
	});

	// SHEET SETTINGS
	const sheetOptions = [
		{
			name: SETTINGS.SHEET_ENCUMBRANCE_BAR_CLIENT,
			default: true,
			scope: 'client',
			config: true,
			type: Boolean,
			requiresReload: true,
		},
		{
			name: SETTINGS.SHEET_ENCUMBRANCE_BAR_WORLD,
			default: false,
			scope: 'world',
			config: true,
			type: Boolean,
			requiresReload: true,
		}
	];

	sheetOptions.forEach(option => {
		game.settings!.register(MODULE_ID, option.name, {
			name: game.i18n!.localize(`workbench.settings.${option.name}.name`),
			hint: game.i18n!.localize(`workbench.settings.${option.name}.hint`),
			scope: option.scope as "world" | "client" | undefined,
			default: option.default,
			type: option.type,
			config: option.config,
			requiresReload: option.requiresReload,
		});
	});

	// GENERAL SETTINGS
	const generalOptions = [
		{
			name: SETTINGS.GENERAL_COMPENDIUM_MANAGER,
			scope: 'world',
			config: false,
			type: CompendiumManager,
			default: new CompendiumManager,
			requiresReload: false,
		},
		{
			name: SETTINGS.GENERAL_TRACKED_COMPENDIUMS,
			scope: 'world',
			config: false,
			type: Array<any>,
			default: new Array<any>,
			requiresReload: false,
		},
	];

	generalOptions.forEach(option => {
		game.settings!.register(MODULE_ID, option.name, {
			name: game.i18n!.localize(`workbench.settings.${option.name}.name`),
			hint: game.i18n!.localize(`workbench.settings.${option.name}.hint`),
			scope: option.scope as "world" | "client" | undefined,
			default: option.default,
			type: option.type,
			config: option.config,
			requiresReload: option.requiresReload,
		});
	});
}
