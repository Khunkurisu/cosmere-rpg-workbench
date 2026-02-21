interface TalentGrant {
    uuid: string;
    level: number;
}
interface BonusTalentsRule {
    level: number;
    quantity: number;
    restrictions: string;
}
interface AncestryItemData extends IdItemData, DescriptionItemData, TalentsProviderData {
    size: Size;
    type: {
        id: CreatureType;
        custom?: string | null;
        subtype?: string | null;
    };
    advancement: {
        extraPath: string;
        /**
         * This is a list of talents that are granted to the character
         * at specific levels.
         */
        extraTalents: TalentGrant[];
        /**
         * This is the number of bonus talents a character
         * with this ancestry can pick at each level.
         */
        bonusTalents: BonusTalentsRule[];
    };
}
declare class AncestryItemDataModel implements AncestryItemData extends foundry.abstract.TypeDataModel<AncestryItemData> {
    get typeFieldId(): foundry.data.fields.StringField;
    get sizeField(): foundry.data.fields.StringField;
    get extraTalents(): TalentGrant[];
}