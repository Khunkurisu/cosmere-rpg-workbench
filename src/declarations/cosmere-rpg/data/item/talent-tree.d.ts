interface TalentTreeItemData {
    /**
     * The list of nodes in the tree
     */
    nodes: Collection<TalentTree.Node>;
    /**
     * The view bounds of the talent tree when
     * not in edit mode.
     */
    viewBounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    /**
     * The display size of the talent tree
     */
    display: {
        width?: number;
        height?: number;
    };
    /**
     * The background image of the talent tree
     */
    background: {
        img?: string;
        width: number;
        height: number;
        position: {
            x: number;
            y: number;
        };
    };
}
export declare class TalentTreeItemDataModel implements TalentTreeItemData, foundry.abstract.TypeDataModel<TalentTreeItemData> {}