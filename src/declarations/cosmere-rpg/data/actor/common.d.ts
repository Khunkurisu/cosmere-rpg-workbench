interface DeflectData extends Derived<number> {
    /**
     * The natural deflect value for this actor.
     * This value is used when deflect cannot be derived from its source, or
     * when the natural value is higher than the derived value.
     */
    natural?: number;
    /**
     * A map of which damage types are deflected or
     * not deflected by the actor.
     */
    types?: Record<DamageType, boolean>;
    /**
     * The source of the deflect value
     */
    source?: DeflectSource;
}
interface ExpertiseData {
    type: ExpertiseType;
    id: string;
    label: string;
    isCustom?: boolean;
    locked?: boolean;
}
interface CurrencyDenominationData {
    id: string;
    secondaryId?: string;
    amount: number;
    conversionRate: Derived<number>;
    convertedValue: Derived<number>;
}
interface AttributeData {
    value: number;
    bonus: number;
}
interface CommonActorData {
    size: Size;
    type: {
        id: CreatureType;
        custom?: string | null;
        subtype?: string | null;
    };
    tier: number;
    senses: {
        range: Derived<number>;
    };
    immunities: {
        damage: Record<DamageType, boolean>;
        condition: Record<Status, boolean>;
    };
    attributes: Record<Attribute, AttributeData>;
    defenses: Record<AttributeGroup, Derived<number>>;
    deflect: DeflectData;
    resources: Record<Resource, {
        value: number;
        max: Derived<number>;
    }>;
    skills: Record<Skill, {
        attribute: Attribute;
        rank: number;
        mod: Derived<number>;
        /**
         * Derived field describing whether this skill is unlocked or not.
         * This field is only present for non-core skills.
         * Core skills are always unlocked.
         */
        unlocked?: boolean;
    }>;
    injuries: Derived<number>;
    injuryRollBonus: number;
    currency: Record<string, {
        denominations: CurrencyDenominationData[];
        total: Derived<number>;
    }>;
    movement: Record<MovementType, {
        rate: Derived<number>;
    }>;
    encumbrance: {
        lift: Derived<number>;
        carry: Derived<number>;
    };
    expertises?: Record<string, ExpertiseData>;
    languages?: string[];
    biography?: string;
    appearance?: string;
    notes?: string;
    source: CosmereDocument;
}
declare class CommonActorDataModel<Schema extends CommonActorData = CommonActorData> implements Schema extends foundry.abstract.TypeDataModel<Schema, CosmereActor> {
    static defineSchema(): DataSchema;

    /**
     * Apply secondary data derivations to this Data Model.
     * This is called after Active Effects are applied.
     */
    prepareSecondaryDerivedData(): void;
}