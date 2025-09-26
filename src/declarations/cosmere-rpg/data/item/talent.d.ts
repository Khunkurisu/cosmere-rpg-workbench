interface TalentItemData extends IdItemData, TypedItemData<Talent.Type>, DescriptionItemData, ActivatableItemData, DamagingItemData, ModalityItemData {
    /**
     * The id of the Path this Talent belongs to.
     */
    path?: string;
    /**
     * Derived value that indicates whether or not the parent
     * Actor has the required path. If no path is defined for this
     * Talent, this value will be undefined.
     */
    hasPath?: boolean;
    /**
     * The id of the Speciality this Talent belongs to.
     */
    specialty?: string;
    /**
     * Derived value that indicates whether or not the parent
     * Actor has the required specialty. If no specialty is defined
     * for this Talent, this value will be undefined.
     */
    hasSpecialty?: boolean;
    /**
     * The id of the Ancestry this Talent belongs to.
     */
    ancestry?: string;
    /**
     * Derived value that indicates whether or not the parent
     * Actor has the required ancestry. If no ancestry is defined
     * for this Talent, this value will be undefined.
     */
    hasAncestry?: boolean;
    /**
     * The id of the Power this Talent belongs to.
     */
    power?: string;
    /**
     * Derived value that indicates whether or not the parent
     * Actor has the required power. If no power is defined for this
     * Talent, this value will be undefined.
     */
    hasPower?: boolean;
    /**
     * Rules that are executed when this talent is
     * obtained by an actor.
     */
    grantRules: Collection<Talent.GrantRule>;
}

declare class TalentItemDataModel implements TalentItemData, foundry.abstract.TypeDataModel<TalentItemData> {}