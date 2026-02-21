interface WeaponItemData extends IdItemData<WeaponId>, TypedItemData<WeaponType>, DescriptionItemData, EquippableItemData, ActivatableItemData, AttackingItemData, DamagingItemData, ExpertiseItemData, TraitsItemData<WeaponTraitId>, Partial<PhysicalItemData> {
}
declare class WeaponItemDataModel implements WeaponItemData extends foundry.abstract.TypeDataModel<WeaponItemData> {}