interface InjuryItemData extends TypedItemData<InjuryType>, DescriptionItemData {
    duration: {
        /**
         * Rolled duration, in days.
         * This value is not defined in the case of a permanent injury.
         */
        initial?: number;
        /**
         * Time until the injury is healed, in days.
         * This value is not defined in the case of a permanent injury.
         */
        remaining?: number;
    };
}
declare class InjuryItemDataModel implements InjuryItemData, foundry.abstract.TypeDataModel<InjuryItemData> {
    get typeLabel(): string;
}
