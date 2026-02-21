declare namespace Derived {
    enum Mode {
        Derived = "derived",
        Override = "override"
    }
    const Modes: {
        derived: string;
        override: string;
    };
}
interface DerivedValueFieldOptions extends foundry.data.fields.DataFieldOptions {
    additionalFields?: foundry.data.fields.DataSchema;
}
/**
 * Type for dealing with derived values.
 * Provides standard functionality for manual overrides
 */
type Derived<T extends number | string | boolean = number | string | boolean> = {
    /**
     * The final value.
     * This is either the derived value or the override value, depending on the `useOverride` flag.
     * Additionally if the value is a number, the bonus is added to the final value.
     */
    readonly value: T;
    /**
     * The derived value
     */
    derived: T;
    /**
     * The override value to use if `useOverride` is set to true
     */
    override?: T;
    /**
     * Whether or not the override value should be used (rather than the derived)
     */
    useOverride: boolean;
    /**
     * The mode of the derived value (derived or override).
     * This serves as a getter/setter for the `useOverride` flag
     */
    mode: Derived.Mode;
} & (T extends number ? {
    /**
     * The final value before the bonus is added.
     * This is either the derived value or the override value, depending on the `useOverride` flag.
     */
    readonly base: number;
    /**
     * Additional bonus to add to the value
     */
    bonus: number;
} : EmptyObject);
declare class DerivedValueField<ElementField extends foundry.data.fields.NumberField | foundry.data.fields.StringField> extends foundry.data.fields.SchemaField {
    constructor(element: ElementField, options?: DerivedValueFieldOptions, context?: foundry.data.fields.DataFieldContext);
}