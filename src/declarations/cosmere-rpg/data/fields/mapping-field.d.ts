type MappingFieldOptions = foundry.data.fields.DataFieldOptions;
declare class MappingField<ElementField extends foundry.data.fields.DataField> extends foundry.data.fields.ObjectField {
    readonly model: ElementField;
    constructor(model: ElementField, options?: MappingFieldOptions);
}