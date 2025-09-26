interface ArmorItemData extends IdItemData, DescriptionItemData, EquippableItemData, ActivatableItemData, ExpertiseItemData, TraitsItemData<ArmorTraitId>, DeflectItemData, PhysicalItemData {
}
declare class ArmorItemDataModel implements ArmorItemData extends foundry.abstract.TypeDataModel<ArmorItemData> {}