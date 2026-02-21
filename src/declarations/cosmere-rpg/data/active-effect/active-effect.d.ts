interface ActiveEffectData {
    /**
     * Whether the effect can stack be stacked.
     */
    isStackable: boolean;
    /**
     * The number of stacked instances of this effect. Used for stackable effects.
     */
    stacks?: number;
}
declare class ActiveEffectDataModel implements ActiveEffectData extends foundry.abstract.TypeDataModel<ActiveEffectData, ActiveEffect> {
}