interface ShowConsumeDialogOptions {
    /**
     * The default state of the consume checkbox in the dialog
     */
    shouldConsume?: boolean;
    /**
     * The title of the dialog window
     */
    title?: string;
    /**
     * The consumption type
     */
    consumeType?: ItemConsumeType;
}
declare class CosmereItem<
    SystemType = {}
> extends Item {
    name: string;
    type: ItemType;
    system: SystemType;

    isWeapon(): this is WeaponItem;
    isArmor(): this is ArmorItem;
    isAncestry(): this is AncestryItem;
    isCulture(): this is CultureItem;
    isPath(): this is PathItem;
    isTalent(): this is TalentItem
    isConnection(): this is ConnectionItem;
    isInjury(): this is InjuryItem;
    isAction(): this is ActionItem;
    isTrait(): this is TraitItem;
    isEquipment(): this is EquipmentItem;
    isGoal(): this is GoalItem;
    isPower(): this is PowerItem;
    isTalentTree(): this is TalentTreeItem;
    /**
     * Can this item be activated?
     */
    hasActivation(): this is CosmereItem<ActivatableItemData>;
    /**
     * Does this item have an attack?
     */
    hasAttack(): this is CosmereItem<AttackingItemData>;
    /**
     * Does this item deal damage?
     */
    hasDamage(): this is CosmereItem<DamagingItemData>;
    /**
     * Is this item physical?
     */
    isPhysical(): this is CosmereItem<PhysicalItemData>;
    /**
     * Does this item have a sub-type?
     */
    isTyped(): this is CosmereItem<TypedItemData>;
    /**
     * Does this item have traits?
     * Not to be confused adversary traits. (Which are their own item type.)
     */
    hasTraits(): this is CosmereItem<TraitsItemData>;
    /**
     * Does this item have a deflect value?
     */
    hasDeflect(): this is CosmereItem<DeflectItemData>;
    /**
     * Can this item be equipped?
     */
    isEquippable(): this is CosmereItem<EquippableItemData>;
    /**
     * Does this item have a description?
     */
    hasDescription(): this is CosmereItem<DescriptionItemData>;
    /**
     * Does this item have an id in it system?
     */
    hasId(): this is CosmereItem<IdItemData>;
    /**
     * Does this item have modality?
     */
    hasModality(): this is CosmereItem<ModalityItemData>;
    /**
     * Does this item provide talents?
     */
    isTalentsProvider(): this is CosmereItem<TalentsProviderData>;
    get isFavorite(): boolean;
    /**
     * Checks if the talent item mode is active.
     * Only relevant for talents that have a modality configured.
     */
    get isModeActive(): boolean;
    /**
     * The source of this item.
     * Only used for:
     * - Talents
     */
    get source(): T extends TalentItemDataModel ? Talent.Source | null : never;
    /**
     * Sets the source of this item.
     * Only used for:
     * - Talents
     */
    set source(value: T extends TalentItemDataModel ? Talent.Source | null : never);
    
    protected handleGoalComplete(): void;
    /**
     * Roll utility for activable items.
     * This function **only** performs the roll, it does not consume resources.
     * For item usages with resource consumtion use `item.use` instead.
     */
    roll(options?: CosmereItem.RollOptions): Promise<D20Roll | null>;
    /**
     * Utility for rolling damage.
     * Only works for items that have damage configured.
     */
    rollDamage(options?: CosmereItem.RollDamageOptions): Promise<DamageRoll[] | null>;
    /**
     * Utility for rolling attacks with this item.
     * This function rolls both the skill test and the damage.
     */
    rollAttack(options?: CosmereItem.RollAttackOptions): Promise<[D20Roll, DamageRoll[]] | null>;
    /**
     * Utility for using activatable items.
     * This function handles resource validation/consumption and dice rolling.
     */
    use(options?: CosmereItem.UseOptions): Promise<D20Roll | [D20Roll, ...DamageRoll[]] | null>;
    protected showConsumeDialog(options?: ShowConsumeDialogOptions): Promise<boolean | null>;
    recharge(): Promise<void>;
    markFavorite(index: number, render?: boolean): Promise<void>;
    clearFavorite(): Promise<void>;
    protected getDescriptionHTML(): Promise<string | undefined>;
    protected getSkillTestRollData(skillId: Nullable<Skill>, attributeId: Nullable<Attribute>, actor: CosmereActor, isAttack?: boolean): D20RollData;
    protected getDamageRollData(skillId: Skill | undefined, attributeId: Nullable<Attribute> | undefined, actor: CosmereActor): DamageRollData;
    getEnricherData(): {
        readonly actor: CosmereActorRollData<CommonActorData> | undefined;
        readonly item: {
            readonly name: string;
            readonly charges: {
                value: any;
                max: any;
            } | undefined;
        };
        readonly target: TargetDescriptor | undefined;
    };
}
declare namespace CosmereItem {
    interface RollOptions {
        /**
         * The actor for which to roll this item.
         * Used to determine the modifier for the roll.
         */
        actor?: CosmereActor;
        /**
         * The skill to be used with this item roll.
         * Used to roll the item with an alternate skill.
         */
        skill?: Skill;
        /**
         * The attribute to be used with this item roll.
         * Used to roll the item with an alternate attribute.
         */
        attribute?: Nullable<Attribute>;
        /**
         * Whether or not to generate a chat message for this roll.
         *
         * @default true
         */
        chatMessage?: boolean;
        /**
         * Who is sending the chat message for this roll?
         *
         * @default - ChatMessage.getSpeaker({ actor })`
         */
        speaker?: ChatSpeakerData;
        /**
         * Whether or not the roll is configurable.
         * If true, the roll configuration dialog will be shown before the roll.
         */
        configurable?: boolean;
        rollMode?: RollMode;
        /**
         * Whether or not to include a plot die in the roll
         */
        plotDie?: boolean;
        /**
         * The value of d20 result which represents an opportunity
         * @default 20
         */
        opportunity?: number;
        /**
         * The value of d20 result which represent an complication
         * @default 1
         */
        complication?: number;
        /**
         * The dice roll component parts, excluding the initial d20
         *
         * @default []
         */
        parts?: string[];
        /**
         * A formula to override the default formula passed in for the damage roll.
         * Used when configuring individual dice in a damage roll with advantage/disadvantage.
         */
        overrideFormula?: string;
        /**
         * A dice formula stating any miscellanious other bonuses or negatives to the specific roll
         */
        temporaryModifiers?: string;
        /**
         * What advantage modifier to apply to the roll
         *
         * @default AdvantageMode.None
         */
        advantageMode?: AdvantageMode;
        /**
         * What advantage modifer to apply to the plot die roll
         */
        advantageModePlot?: AdvantageMode;
        /**
         * Whether the current roll is an attack, for hook context
         */
        isAttack?: boolean;
    }
    type RollDamageOptions = Omit<RollOptions, 'parts' | 'opportunity' | 'complication' | 'plotDie' | 'configurable' | 'advantageModePlot'>;
    interface RollAttackOptions extends Omit<RollOptions, 'skill' | 'attribute' | 'parts' | 'opportunity' | 'complication' | 'plotDie' | 'advantageMode' | 'advantageModePlot'> {
        skillTest?: Pick<RollOptions, 'skill' | 'attribute' | 'parts' | 'temporaryModifiers' | 'opportunity' | 'complication' | 'plotDie' | 'advantageMode' | 'advantageModePlot'>;
        damage?: Pick<RollOptions, 'overrideFormula' | 'skill' | 'attribute'>;
    }
    interface UseOptions extends RollOptions {
        /**
         * Whether or not the item usage should consume.
         * Only used if the item has consumption configured.
         */
        shouldConsume?: boolean;
        /**
         * What advantage modifier to apply to the damage roll.
         * Only used if the item has damage configured.
         */
        advantageModeDamage?: AdvantageMode;
    }
}
type CultureItem = CosmereItem<CultureItemData>;
type AncestryItem = CosmereItem<AncestryItemData>;
type PathItem = CosmereItem<PathItemData>;
type ConnectionItem = CosmereItem<ConnectionItemData>;
type InjuryItem = CosmereItem<InjuryItemData>;
type SpecialtyItem = CosmereItem<SpecialtyItemData>;
type LootItem = CosmereItem<LootItemData>;
type ArmorItem = CosmereItem<ArmorItemData>;
type TraitItem = CosmereItem<TraitItemData>;
type ActionItem = CosmereItem<ActionItemData>;
type TalentItem = CosmereItem<TalentItemData>;
type EquipmentItem = CosmereItem<EquipmentItemData>;
type WeaponItem = CosmereItem<WeaponItemData>;
type GoalItem = CosmereItem<GoalItemData>;
type PowerItem = CosmereItem<PowerItemData>;
type TalentTreeItem = CosmereItem<TalentTreeItemData>;