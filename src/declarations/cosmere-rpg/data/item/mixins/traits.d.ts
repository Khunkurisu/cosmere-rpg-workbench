interface TraitData {
    /**
     * The default (not expertise) value of this trait
     */
    defaultValue?: number;

    /**
     * The current value of this trait.
     * This is a derived value
     */
    value?: number;

    /**
     * Whether or not this trait is active by default (not expertise)
     */
    defaultActive: boolean;

    /**
     * Whether or not this trait is currently active.
     * This is a derived value
     */
    active: boolean;

    /**
     * How is this trait modified when the actor has expertise with the item?
     */
    expertise: {
        /**
         * Toggle whether or not the trait is active.
         * If it is active by default, it becomes inactive and vice versa.
         */
        toggleActive?: boolean;

        /**
         * Change the value of this trait to this value.
         */
        value?: number;
    };
}

interface TraitsItemData<
    TraitId extends WeaponTraitId | ArmorTraitId = WeaponTraitId | ArmorTraitId,
> {
    traits: Record<TraitId, TraitData>;
    readonly traitsArray: ({ id: TraitId } & TraitData)[];
}