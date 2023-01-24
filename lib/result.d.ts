export declare class Result<T, E = Error> {
    private result;
    constructor(result: Ok<T> | Err<E>);
    isOk(): boolean;
    isErr(): boolean;
    ok(callback: (result: T) => void): Result<T, E>;
    err(callback: (result: E) => void): Result<T, E>;
    unwrap(): T;
}
export declare function result<T, E = Error>(result: Ok<T> | Err<E>): Result<T, E>;
declare class Ok<T> {
    value: T;
    constructor(value: T);
}
export declare function ok<T, E = Error>(value: T): Result<T, E>;
declare class Err<E> {
    value: E;
    constructor(value: E);
}
export declare function err<T, E = Error>(value: E): Result<T, E>;
export {};
