export { };
declare global {
	namespace CosmereAPI {
		interface CurrencyDenominationConfig {
			[key: string]: string | number | unknown,
			id: string;
			label: string;
			conversionRate: number; // Value relative to base denomination
			base?: boolean; // Present if this denomination is considered the base
			unit?: string;
		}

		interface CurrencyConfigData {
			[key: string]: string | unknown,
			id: string;
			label: string;
			icon: string;
			denominations: {
				[key: string]: CosmereAPI.CurrencyDenominationConfig[] | undefined,
				primary: CurrencyDenominationConfig[];
				secondary?: CurrencyDenominationConfig[];
			};
		}

		interface SkillConfigData {
			[key: string]: string | number | boolean | undefined,
			id: string;
			label: string;
			attribute: string;
			core?: boolean;
		}

		interface PowerTypeConfigData {
			[key: string]: string | number | undefined,
			id: string;
			label: string;
			plural: string;
		}

		interface PathTypeConfigData {
			[key: string]: string | number | undefined,
			id: string;
			label: string;
		}

		interface RegistrationConfig {
			[key: string]: string | number | boolean | undefined,
			source: string;
			priority?: number;
			strict?: boolean;
		}
	}

	interface CosmereAPI {
		registerSkill(data: CosmereAPI.SkillConfigData & CosmereAPI.RegistrationConfig): boolean;
		registerPowerType(data: CosmereAPI.PowerTypeConfigData & CosmereAPI.RegistrationConfig): boolean;
		registerPathType(data: CosmereAPI.PathTypeConfigData & CosmereAPI.RegistrationConfig): boolean;
		registerCurrency(data: CosmereAPI.CurrencyConfigData & CosmereAPI.RegistrationConfig): boolean;
	}

	let cosmereRPG: {
		api: CosmereAPI;
	};
};
