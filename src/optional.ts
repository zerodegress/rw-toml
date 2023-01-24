export class Optional<T> {
    private value?: T;

    constructor(value?: T) {
        this.value = value;
    }

    isSome(): boolean {
        return this.value != undefined;
    }

    isNone(): boolean {
        return this.value == undefined;
    }

    some(callback: (value: T) => void): Optional<T> {
        if(this.value != undefined) {
            callback(this.value);
        }
        return this;
    }

    none(callback: () => void): Optional<T> {
        if(this.value == undefined) {
            callback();
        }
        return this;
    }

    unwrap(): T {
        if(this.value != undefined) {
            return this.value;
        } else {
            throw new Error('value is none');
            
        }
    }
}

export function optional<T>(value?: T): Optional<T> {
    return new Optional(value);
}

export function some<T>(value: T): Optional<T> {
    return new Optional(value);
}

export function none<T>(): Optional<T> {
    return new Optional();
}