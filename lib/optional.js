"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.none = exports.some = exports.optional = exports.Optional = void 0;
class Optional {
    constructor(value) {
        this.value = value;
    }
    isSome() {
        return this.value != undefined;
    }
    isNone() {
        return this.value == undefined;
    }
    some(callback) {
        if (this.value != undefined) {
            callback(this.value);
        }
        return this;
    }
    none(callback) {
        if (this.value == undefined) {
            callback();
        }
        return this;
    }
    unwrap() {
        if (this.value != undefined) {
            return this.value;
        }
        else {
            throw new Error('value is none');
        }
    }
}
exports.Optional = Optional;
function optional(value) {
    return new Optional(value);
}
exports.optional = optional;
function some(value) {
    return new Optional(value);
}
exports.some = some;
function none() {
    return new Optional();
}
exports.none = none;
