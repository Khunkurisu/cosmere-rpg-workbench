interface PowerItemData extends IdItemData, TypedItemData<PowerType>, DamagingItemData, DescriptionItemData {
    /**
     * Wether to a custom skill is used, or
     * the skill is derived from the power's id.
     */
    customSkill: boolean;
    /**
     * The skill associated with this power.
     * This cannot be a core skill.
     * If `customSkill` is `false`, the skill with the same id as the power is used.
     */
    skill: Skill | null;
}

declare class PowerItemDataModel implements PowerItemData, foundry.abstract.TypeDataModel<PowerItemData> {}