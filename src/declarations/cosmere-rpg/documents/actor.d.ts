type CharacterActor = CosmereActor<CharacterActorDataModel>;
type AdversaryActor = CosmereActor<AdversaryActorDataModel>;
interface RollSkillOptions {
    /**
     * The attribute to be used with this skill roll.
     * Used to roll a skill with an alternate attribute.
     *
     * @default - The attribute associated with this skill
     */
    attribute?: Attribute;
    /**
     * The dice roll component parts, excluding the initial d20
     * @default []
     */
    parts?: string[];
    /**
     * Who is sending the chat message for this roll?
     *
     * @default - ChatMessage.getSpeaker({ actor })`
     */
    speaker?: ChatSpeakerData;
}
interface LongRestOptions {
    /**
     * Whether or not to display the rest dialog.
     * @default true
     */
    dialog?: boolean;
}
interface ShortRestOptions extends LongRestOptions {
    /**
     * The character whose Medicine modifier to add
     * to the recovery die roll.
     */
    tendedBy?: CharacterActor;
}
interface DamageInstance {
    amount: number;
    type?: DamageType;
}
interface ApplyDamageOptions {
    /**
     * Whether or not to display a chat message
     * @default true
     */
    chatMessage?: boolean;
    /**
     * The item, if any, from which the damage is originating
     */
    originatingItem?: CosmereItem;
}
type CosmereActorRollData<T extends CommonActorData = CommonActorData> = {
    [K in keyof T]: T[K];
} & {
    name: string;
    attr: Record<string, number>;
    skills: Record<string, {
        rank: number;
        mod: number;
    }>;
    scalar: {
        damage: {
            unarmed: string;
        };
        power: Record<string, {
            die: string;
            'effect-size': Size;
        }>;
    };
    token?: {
        name: string;
    };
};
declare class CosmereActor<T extends CommonActorDataModel = CommonActorDataModel, SystemType extends CommonActorData = T extends CommonActorDataModel<infer S> ? S : never> extends Actor {
    name: string;
    system: SystemType;
    type: ActorType;
    get conditions(): Set<Status>;
    get favorites(): CosmereItem[];
    get deflect(): number;
    get ancestry(): AncestryItem | undefined;
    get cultures(): CultureItem[];
    get paths(): PathItem[];
    get goals(): GoalItem[];
    get powers(): PowerItem[];
    get talents(): TalentItem[];
    isCharacter(): this is CharacterActor;
    isAdversary(): this is AdversaryActor;
    setMode(modality: string, mode: string): Promise<void>;
    clearMode(modality: string): Promise<void>;
    rollInjury(): Promise<void>;
    /**
     * Utility function to apply damage to this actor.
     * This function will automatically apply deflect & immunities and
     * send a chat message.
     */
    applyDamage(instances: DamageInstance | DamageInstance[], options?: ApplyDamageOptions): Promise<void>;
    applyHealing(amount: number): Promise<void>;
    /**
     * Utility function to get the modifier for a given attribute for this actor.
     * @param attribute The attribute to get the modifier for
     */
    getAttributeMod(attribute: Attribute): number;
    /**
     * Utility function to get the modifier for a given skill for this actor.
     * @param skill The skill to get the modifier for
     * @param attributeOverride An optional attribute override, used instead of the default attribute
     */
    getSkillMod(skill: Skill, attributeOverride?: Attribute): number;
    /**
     * Roll a skill for this actor
     */
    rollSkill(skillId: Skill, options?: RollSkillOptions): Promise<D20Roll | null>;
    /**
     * Utility function to roll an item for this actor
     */
    rollItem(item: CosmereItem, options?: Omit<CosmereItem.RollOptions, 'actor'>): Promise<D20Roll | null>;
    /**
     * Utility function to modify a skill value
     */
    modifySkillRank(skillId: Skill, change: number, render?: boolean): Promise<void>;
    /**
     * Utility function to increment/decrement a skill value
     */
    modifySkillRank(skillId: Skill, increment: boolean, render?: boolean): Promise<void>;
    /**
     * Utility function to use an item for this actor
     */
    useItem(item: CosmereItem, options?: Omit<CosmereItem.UseOptions, 'actor'>): Promise<D20Roll | [D20Roll, ...DamageRoll[]] | null>;
    /**
     * Utility function to handle short resting.
     * This function takes care of rolling the recovery die.
     * Automatically applies the appropriate Medicine modifier.
     */
    shortRest(options?: ShortRestOptions): Promise<void>;
    /**
     * Utility function to handle long resting.
     * Long resting grants the following benefits:
     * - Recover all lost health
     * - Recover all lost focus
     * - Reduce Exhausted penalty by 1 (TODO)
     */
    longRest(options?: LongRestOptions): Promise<void>;
    getRollData(): CosmereActorRollData<SystemType>;
    getEnricherData(): {
        readonly actor: CosmereActorRollData<SystemType>;
        readonly target: import("../utils/generic").TargetDescriptor | undefined;
    };
    /**
     * Utility Function to determine a formula value based on a scalar plot of an attribute value
     */
    getFormulaFromScalarAttribute<T extends string = string>(attrId: Attribute, scale: AttributeScale<T>[]): T;
    getFormulaFromScalar<T extends string = string>(value: number, scale: AttributeScale<T>[]): T;
    /**
     * Utility function to determine if an actor has a given expertise
     */
    hasExpertise(type: ExpertiseType, id: string): boolean;
    /**
     * Utility function to determine if an actor has a given talent
     */
    hasTalent(id: string): boolean;
    /**
     * Utility function to determine if the actor meets the
     * given talent prerequisites.
     */
    hasTalentPreRequisites(prerequisites: Collection<TalentTree.Node.Prerequisite>): boolean;
    /**
     * Migrate goals from the system object to individual items.
     *
     */
    private migrateGoals;
}