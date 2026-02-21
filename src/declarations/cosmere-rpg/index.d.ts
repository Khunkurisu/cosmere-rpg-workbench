declare type CosmereDocument =
    | CosmereActor
    | CosmereItem
    | CosmereCombat
    | CosmereCombatant
    | CosmereChatMessage
    | CosmereTokenDocument
    | CosmereActiveEffect;

declare module "@league-of-foundry-developers/foundry-vtt-types/configuration" {
    interface DocumentClassConfig {
        Actor: CosmereActor;
        Item: CosmereItem;
        Combat: CosmereCombat;
        Combatant: CosmereCombatant;
        ChatMessage: CosmereChatMessage;
        Token: CosmereTokenDocument;
        ActiveEffect: CosmereActiveEffect;
    }
}
