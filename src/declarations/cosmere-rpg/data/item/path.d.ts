interface PathItemData extends IdItemData, TypedItemData<PathType>, DescriptionItemData, TalentsProviderData {
    /**
     * The non-core skills linked to this path.
     * These skills are displayed with the path in the sheet.
     */
    linkedSkills: Skill[];
}

declare class PathItemDataModel implements PathItemData, foundry.abstract.TypeDataModel<PathItemData> {
    get typeLabel(): string;
}