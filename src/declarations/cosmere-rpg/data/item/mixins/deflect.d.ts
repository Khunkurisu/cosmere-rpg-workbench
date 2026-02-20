interface DeflectData {
    /**
     * Whether or not this trait is currently active.
     */
    active: boolean;
}

interface DeflectItemData {
    deflect: number;
    deflects: Record<DamageType, DeflectData>;
    readonly deflectsArray: ({ id: DamageType } & DeflectData)[];
}