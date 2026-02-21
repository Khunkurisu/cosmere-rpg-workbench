interface EquippableItemData {
    equipped: boolean;
    alwaysEquipped?: boolean;
    equip: {
        type: EquipType;
        hold?: HoldType; // Derived from two handed trait
        hand?: EquipHand;
    };
}