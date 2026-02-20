interface GoalItemData extends IdItemData, DescriptionItemData {
    /**
     * The progress level of the goal
     */
    level: number;
    /**
     * The rewards for completing the goal
     */
    rewards: Collection<Goal.Reward>;
}

declare class GoalItemDataModel implements GoalItemData extends foundry.abstract.TypeDataModel<GoalItemData> {}