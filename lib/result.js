"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.err = exports.ok = exports.result = exports.Result = void 0;
class Result {
    constructor(result) {
        this.result = result;
    }
    isOk() {
        return this.result instanceof (Ok);
    }
    isErr() {
        return this.result instanceof (Err);
    }
    ok(callback) {
        if (this.result instanceof (Ok)) {
            callback(this.result.value);
        }
        return this;
    }
    err(callback) {
        if (this.result instanceof (Err)) {
            callback(this.result.value);
        }
        return this;
    }
    unwrap() {
        if (this.result instanceof (Ok)) {
            return this.result.value;
        }
        else {
            throw new Error('value is Err');
        }
    }
}
exports.Result = Result;
function result(result) {
    return new Result(result);
}
exports.result = result;
class Ok {
    constructor(value) {
        this.value = value;
    }
}
function ok(value) {
    return new Result(new Ok(value));
}
exports.ok = ok;
class Err {
    constructor(value) {
        this.value = value;
    }
}
function err(value) {
    return new Result(new Err(value));
}
exports.err = err;
