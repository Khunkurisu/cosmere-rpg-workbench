export interface DamagingItemData {
    damage: {
        formula?: string;
        type?: DamageType;
        grazeOverrideFormula?: string;
        skill?: Skill;
        attribute?: Attribute;
    };
}