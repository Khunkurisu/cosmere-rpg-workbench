import { CollectionField, CollectionFieldOptions } from '@system/data/fields';
export declare class TalentTreeNodeCollectionField extends CollectionField<TalentTreeNodeField> {
    constructor(options?: CollectionFieldOptions, context?: foundry.data.fields.DataFieldContext);
}
declare class TalentTreeNodeField extends foundry.data.fields.SchemaField {
    constructor(options?: foundry.data.fields.DataFieldOptions, context?: foundry.data.fields.DataFieldContext);
}
export {};
