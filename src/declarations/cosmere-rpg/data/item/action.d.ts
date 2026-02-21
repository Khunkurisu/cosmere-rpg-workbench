interface ActionItemData extends DescriptionItemData, ActivatableItemData, IdItemData, TypedItemData<ActionType>, DamagingItemData, ModalityItemData {
    /**
     * The id of the Ancestry this Talent belongs to.
     */
    ancestry?: string;
}
declare class ActionItemDataModel implements ActionItemData, foundry.abstract.TypeDataModel<ActionItemData> {}
