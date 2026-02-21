enum Size {
    Small = 'small',
    Medium = 'medium',
    Large = 'large',
    Huge = 'huge',
    Garguantuan = 'gargantuan',
}

/**
 * A non-exhaustive list of creature types.
 * Used to provide standard options.
 */
enum CreatureType {
    Custom = 'custom',
    Humanoid = 'humanoid',
    Animal = 'animal',
}

/**
 * A non-exhaustive list of conditions
 */
enum Status {
    Afflicted = 'afflicted',
    Blind = 'blind',
    Burrowing = 'burrowing',
    Determined = 'determined',
    Disoriented = 'disoriented',
    Empowered = 'empowered',
    Enhanced = 'enhanced',
    Exhausted = 'exhausted',
    Flying = 'flying',
    Focused = 'focused',
    Hidden = 'hidden',
    Immobilized = 'immobilized',
    Invisible = 'invisible',
    Prone = 'prone',
    Restrained = 'restrained',
    Slowed = 'slowed',
    Stunned = 'stunned',
    Surprised = 'surprised',
    Unconscious = 'unconscious',
    Dead = 'dead',
}

enum InjuryType {
    FleshWound = 'flesh_wound',
    ShallowInjury = 'shallow_injury',
    ViciousInjury = 'vicious_injury',
    PermanentInjury = 'permanent_injury',
    Death = 'death',
}

enum AttributeGroup {
    Physical = 'phy',
    Cognitive = 'cog',
    Spiritual = 'spi',
}

enum Attribute {
    Strength = 'str',
    Speed = 'spd',
    Intellect = 'int',
    Willpower = 'wil',
    Awareness = 'awa',
    Presence = 'pre',
}

enum Resource {
    Health = 'hea',
    Focus = 'foc',
    Investiture = 'inv',
}

export enum Skill {
    Agility = 'agi',
    Athletics = 'ath',
    HeavyWeapons = 'hwp',
    LightWeapons = 'lwp',
    Stealth = 'stl',
    Thievery = 'thv',

    Crafting = 'cra',
    Deduction = 'ded',
    Discipline = 'dis',
    Intimidation = 'inm',
    Lore = 'lor',
    Medicine = 'med',

    Deception = 'dec',
    Insight = 'ins',
    Leadership = 'lea',
    Perception = 'prc',
    Persuasion = 'prs',
    Survival = 'sur',
}
// export type Skill = (typeof Skills)[keyof typeof Skills];

enum DerivedStatistic {
    MovementRate = 'mvr',
    LiftingCapactiy = 'lif',
    RecoveryDie = 'rcd',
}

enum PathType {
    Heroic = 'heroic',
}

enum PowerType {
    None = 'none',
}

/**
 * The categories of weapon available
 */
enum WeaponType {
    Light = 'light_wpn',
    Heavy = 'heavy_wpn',
    Special = 'special_wpn',
}

/**
 * The ids of all default system weapons.
 * This is not an exhaustive list of all possible weapons,
 * but is used to populate the `CONFIG.COSMERE.weapons` property.
 */
enum WeaponId {
    // Special
    Improvised = 'improvised',
    Unarmed = 'unarmed',
}

/**
 * The ids of all default system armors.
 * This is not an exhaustive list of all possible weapons,
 * but is used to populate the `CONFIG.COSMERE.armors` property.
 */
enum ArmorId {}

enum ExpertiseType {
    Armor = 'armor',
    Cultural = 'cultural',
    Specialist = 'specialist',
    Utility = 'utility',
    Weapon = 'weapon',
}

/**
 * The ids of all default system weapon traits.
 * This is not an exhaustive list of all possible weapon traits,
 * but is used to populate the `CONFIG.COSMERE.traits.weaponTraitIds` property.
 */
enum WeaponTraitId {
    Cumbersome = 'cumbersome',
    Dangerous = 'dangerous',
    Deadly = 'deadly',
    Defensive = 'defensive',
    Discreet = 'discreet',
    Indirect = 'indirect',
    Loaded = 'loaded',
    Momentum = 'momentum',
    Offhand = 'offhand',
    Pierce = 'pierce',
    Quickdraw = 'quickdraw',
    Thrown = 'thrown',
    TwoHanded = 'two_handed',
    Unique = 'unique',
    Fragile = 'fragile',
    Reach = 'reach',
}

/**
 * The ids of all default system armor traits.
 * This is not an exhaustive list of all possible armor traits,
 * but is used to populate the `CONFIG.COSMERE.traits.armorTraitIds` property.
 */
enum ArmorTraitId {
    Cumbersome = 'cumbersome',
    Dangerous = 'dangerous',
    Presentable = 'presentable',
    Unique = 'unique',
}

enum AdversaryRole {
    Minion = 'minion',
    Rival = 'rival',
    Boss = 'boss',
}

enum DeflectSource {
    None = 'none',
    Armor = 'armor',
}

enum ActivationType {
    None = 'none',
    Utility = 'utility',
    SkillTest = 'skill_test',
}

enum ItemConsumeType {
    Resource = 'resource', // E.g. health, focus, investiture
    Item = 'item',
}

enum ItemUseType {
    Use = 'use',
    Charge = 'charge',
}

enum ItemRechargeType {
    PerScene = 'per_scene',
}

enum EquipType {
    Hold = 'hold', // Item that you equip by holding it (either in one or two hands)
    Wear = 'wear', // Item that you equip by wearing it
}

enum HoldType {
    OneHanded = 'one_handed',
    TwoHanded = 'two_handed',
}

enum EquipHand {
    Main = 'main_hand',
    Off = 'off_hand',
}

enum EquipmentType {
    Basic = 'basic',
}

enum ActionType {
    Basic = 'basic',
    Ancestry = 'ancestry',
    Adversary = 'adversary',
}

enum ActionCostType {
    Action = 'act',
    Reaction = 'rea',
    FreeAction = 'fre',
    Special = 'spe',
}

enum AttackType {
    Melee = 'melee',
    Ranged = 'ranged',
}

export enum DamageType {
    Energy = 'energy',
    Impact = 'impact',
    Keen = 'keen',
    Spirit = 'spirit',
    Vital = 'vital',
    Healing = 'heal',
}

enum MovementType {
    Walk = 'walk',
    Swim = 'swim',
    Fly = 'fly',
}

enum RestType {
    Short = 'short',
    Long = 'long',
}

enum ImmunityType {
    Damage = 'damage',
    Condition = 'condition',
}

/* --- System --- */

enum ActorType {
    Character = 'character',
    Adversary = 'adversary',
}

enum ItemType {
    Weapon = 'weapon',
    Armor = 'armor',
    Equipment = 'equipment',
    Loot = 'loot',

    Ancestry = 'ancestry',
    Culture = 'culture',
    Path = 'path',
    Talent = 'talent',
    Trait = 'trait',

    Action = 'action',

    Injury = 'injury',
    Connection = 'connection',
    Goal = 'goal',

    Power = 'power',

    TalentTree = 'talent_tree',
}

enum TurnSpeed {
    Fast = 'fast',
    Slow = 'slow',
}

enum Theme {
    Default = 'default',
}
