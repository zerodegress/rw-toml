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

export function ok<T>(value: T): Ok<T> {
    return new Ok(value);
}

class Err<E> {
    value: E;
    constructor(value: E) {
        this.value = value;
    }
}

export function err<E>(value: E): Err<E> {
    return new Err(value);
}