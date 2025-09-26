type CollectionFieldOptions = foundry.data.fields.DataFieldOptions;
/**
 * A collection that is backed by a record object instead of a Map.
 * This allows us to persit it properly and update items easily,
 * while still having the convenience of a collection.
 */
declare class RecordCollection<T> implements Collection<T> {
    /**
     * NOTE: Must use `any` here as we need the RecordCollection
     * to be backing record object itself. This ensures its stored
     * properly.
     */
    constructor(entries?: [string, T][]);
    get contents(): T[];
    find<S extends T>(condition: (e: T, index: number, collection: Collection<T>) => e is S): S | undefined;
    find(condition: (e: T, index: number, collection: Collection<T>) => boolean): T | undefined;
    filter<S extends T>(condition: (e: T, index: number, collection: Collection<T>) => e is S): S[];
    filter(condition: (e: T, index: number, collection: Collection<T>) => boolean): T[];
    has(key: string): boolean;
    get(key: string, options: {
        strict: true;
    }): T;
    get(key: string, options?: {
        strict: false;
    }): T | undefined;
    getName(name: string, options: {
        strict: true;
    }): T;
    getName(name: string, options?: {
        strict: false;
    }): T | undefined;
    map<M>(transformer: (entity: T, index: number, collection: Collection<T>) => M): M[];
    reduce<A>(evaluator: (accumulator: A, value: T, index: number, collection: Collection<T>) => A, initialValue: A): A;
    some(condition: (value: T, index: number, collection: Collection<T>) => boolean): boolean;
    set(key: string, value: T): this;
    delete(key: string): boolean;
    clear(): void;
    get size(): number;
    entries(): IterableIterator<[string, T]>;
    keys(): IterableIterator<string>;
    values(): IterableIterator<T>;
    forEach(callbackfn: (value: T, key: string, map: this) => void, thisArg?: any): void;
    [Symbol.iterator](): IterableIterator<T>;
    get [Symbol.toStringTag](): string;
    toJSON(): any;
}
declare class CollectionField<ElementField extends foundry.data.fields.DataField = foundry.data.fields.DataField> extends foundry.data.fields.ObjectField {
    readonly model: ElementField;
    constructor(model: ElementField, options?: CollectionFieldOptions, context?: foundry.data.fields.DataFieldContext, CollectionClass?: typeof RecordCollection);
}