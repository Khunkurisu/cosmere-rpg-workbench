export { };
declare global {
	namespace CosmereAPI {
		interface CurrencyDenominationConfig {
			id: string;
			label: string;
			conversionRate: number; // Value relative to base denomination
			base?: boolean; // Present if this denomination is considered the base
			unit?: string;
		}

		interface CurrencyConfigData {
			id: string;
			label: string;
			icon: string;
			denominations: {
				primary: CurrencyDenominationConfig[];
				secondary?: CurrencyDenominationConfig[];
			};
		}

		interface SkillConfigData {
			id: string;
			label: string;
			attribute: string;
			core?: boolean;
		}

		interface PowerTypeConfigData {
			id: string;
			label: string;
			plural: string;
		}

		interface PathTypeConfigData {
			id: string;
			label: string;
		}

		interface RegistrationConfig {
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
