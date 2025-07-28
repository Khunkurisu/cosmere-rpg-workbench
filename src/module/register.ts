import { register as registerCurrencies, CURRENCIES } from './config/currency';
import { register as registerSkills, SKILLS } from './config/skills';
import { register as registerPowers, POWER_TYPES } from './config/powers';
import { MODULE_ID } from './constants';

export function register() {
	CURRENCIES.push(...game.settings!.get(MODULE_ID, 'customCurrency') as Array<CosmereAPI.CurrencyConfigData>);
	SKILLS.push(...game.settings!.get(MODULE_ID, 'customSkills') as Array<CosmereAPI.SkillConfigData>);
	POWER_TYPES.push(...game.settings!.get(MODULE_ID, 'customPowers') as Array<CosmereAPI.PowerTypeConfigData>);

	registerSkills();
	registerPowers();
	registerCurrencies();
}
