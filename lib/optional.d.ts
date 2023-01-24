export declare class Optional<T> {
    private value?;
    constructor(value?: T);
    isSome(): boolean;
    isNone(): boolean;
    some(callback: (value: T) => void): Optional<T>;
    none(callback: () => void): Optional<T>;
    unwrap(): T;
}
export declare function optional<T>(value?: T): Optional<T>;
export declare function some<T>(value: T): Optional<T>;
export declare function none<T>(): Optional<T>;
