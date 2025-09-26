interface ActivatableItemData {
    activation: {
        type: ActivationType;
        cost: {
            value?: number;
            type?: ActionCostType;
        };
        consume?: {
            type: ItemConsumeType;
            value: number;
            resource?: Resource;
        };
        uses?: {
            type: ItemUseType;
            value: number;
            max: number;
            recharge?: ItemRechargeType;
        };

        flavor?: string;

        /* -- Skill test activation -- */
        skill?: Skill;
        attribute?: Attribute;
        modifierFormula?: string;
        plotDie?: boolean;

        /**
         * The value of d20 result which represents an opportunity
         */
        opportunity?: number;

        /**
         * The value of d20 result which represent an complication
         */
        complication?: number;
    };
}