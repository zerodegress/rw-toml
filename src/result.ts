export class Result<T, E = Error> {
    private result: Ok<T> | Err<E>;

    constructor(result: Ok<T> | Err<E>) {
        this.result = result;
    }

    isOk(): boolean {
        return this.result instanceof Ok<T>;
    }

    isErr(): boolean {
        return this.result instanceof Err<E>;
    }

    ok(callback: (result: T) => void): Result<T, E> {
        if(this.result instanceof Ok<T>) {
            callback(this.result.value);
        }
        return this;
    }

    err(callback: (result: E) => void): Result<T, E> {
        if(this.result instanceof Err<E>) {
            callback(this.result.value);
        }
        return this;
    }

    unwrap(): T {
        if(this.result instanceof Ok<T>) {
            return this.result.value;
        } else {
            throw new Error('value is Err');
        }
    }
}

export function result<T, E = Error>(result: Ok<T> | Err<E>): Result<T, E> {
    return new Result(result);
}

class Ok<T> {
    value: T;
    constructor(value: T) {
        this.value = value;
    }
}

export function ok<T, E = Error>(value: T): Result<T, E> {
    return new Result<T, E>(new Ok(value));
}

class Err<E> {
    value: E;
    constructor(value: E) {
        this.value = value;
    }
}

export function err<T, E = Error>(value: E): Result<T, E> {
    return new Result<T, E>(new Err(value));
}