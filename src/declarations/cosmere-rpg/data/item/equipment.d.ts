interface EquipmentItemData extends TypedItemData<EquipmentType>, DescriptionItemData, PhysicalItemData, ActivatableItemData, DamagingItemData {
}
declare class EquipmentItemDataModel implements EquipmentItemData extends foundry.abstract.TypeDataModel<EquipmentItemData> {}