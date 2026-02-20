interface GoalData {
    text: string;
    level: number;
}
interface ConnectionData {
    name: string;
    description: string;
}
interface CharacterActorData extends CommonActorData {
    level: number;
    /**
     * Derived value for the maximum rank a skill can be.
     * Based on the configured advancement rules.
     */
    maxSkillRank: number;
    recovery: {
        die: Derived<string>;
    };
    purpose: string;
    obstacle: string;
    goals?: GoalData[];
    connections: ConnectionData[];
}
declare class CharacterActorDataModel extends CommonActorDataModel<CharacterActorData> {}