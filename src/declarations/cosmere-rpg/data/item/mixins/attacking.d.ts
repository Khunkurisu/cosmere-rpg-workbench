interface AttackingItemData {
    attack: {
        type: AttackType;
        range?: {
            value?: number;
            long?: number;
            unit?: string;
        };
    };
}