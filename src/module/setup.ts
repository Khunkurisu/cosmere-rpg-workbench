import { register as registerCurrencies, localize as localizeCurrencies, CURRENCIES } from './config/currency';
import { register as registerSkills, localize as localizeSkills, SKILLS } from './config/skills';
import { register as registerPowers, localize as localizePowers, POWER_TYPES } from './config/powers';
import { MODULE_ID, SETTINGS } from './constants';

export function register() {
	CURRENCIES.push(...game.settings!.get(MODULE_ID, SETTINGS.CUSTOM_CURRENCIES) as Array<CosmereAPI.CurrencyConfigData>);
	SKILLS.push(...game.settings!.get(MODULE_ID, SETTINGS.CUSTOM_SKILLS) as Array<CosmereAPI.SkillConfigData>);
	/* POWER_TYPES.push(...game.settings!.get(MODULE_ID, 'customPowers') as Array<CosmereAPI.PowerTypeConfigData>); */

	registerSkills();
	registerPowers();
	registerCurrencies();
}

export function localize() {
	CURRENCIES.push(...game.settings!.get(MODULE_ID, SETTINGS.CUSTOM_CURRENCIES) as Array<CosmereAPI.CurrencyConfigData>);
	SKILLS.push(...game.settings!.get(MODULE_ID, SETTINGS.CUSTOM_SKILLS) as Array<CosmereAPI.SkillConfigData>);
	/* POWER_TYPES.push(...game.settings!.get(MODULE_ID, 'customPowers') as Array<CosmereAPI.PowerTypeConfigData>); */

	localizeSkills();
	localizePowers();
	localizeCurrencies();
}
