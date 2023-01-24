"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toml = exports.Ini = void 0;
const optional_1 = require("./optional");
const result_1 = require("./result");
class Ini {
    constructor(obj) {
        for (let k1 in obj) {
            this[k1] = {};
            if (typeof obj[k1] == 'object') {
                for (let k2 in obj[k1]) {
                    if (typeof obj[k1][k2] == 'string') {
                        this[k1][k2] = obj[k1][k2];
                    }
                    else {
                        throw new Error(`not string value in key:${k2}`);
                    }
                }
            }
            else {
                throw new Error(`not section value in section name:${k1}`);
            }
        }
    }
    static from(obj) {
        try {
            return (0, result_1.ok)(new Ini(obj));
        }
        catch (e) {
            if (e instanceof Error) {
                return (0, result_1.err)(e);
            }
            else {
                throw new Error('not a Error');
            }
        }
    }
}
exports.Ini = Ini;
class Toml {
    constructor(obj) {
        for (let k1 in obj) {
            this[k1] = {};
            if (typeof obj[k1] == 'object') {
                let single = (0, optional_1.none)();
                for (let k2 in obj[k1]) {
                    single.none(() => {
                        if (typeof obj[k1][k2] == 'object') {
                            single = (0, optional_1.some)(false);
                            this[k1][k2] = {};
                        }
                        else {
                            single = (0, optional_1.some)(true);
                        }
                    });
                    single.some((single) => {
                        if (single) {
                            if (typeof obj[k1][k2] == 'number') {
                                this[k1][k2] = obj[k1][k2];
                            }
                            else if (typeof obj[k1][k2] == 'string') {
                                this[k1][k2] = obj[k1][k2];
                            }
                            else if (typeof obj[k1][k2] == 'boolean') {
                                this[k1][k2] = obj[k1][k2];
                            }
                            else if (Array.isArray(obj[k1][k2])) {
                                this[k1][k2] = [];
                                let typing = (0, optional_1.none)();
                                for (let n of obj[k1][k2]) {
                                    typing.none(() => {
                                        switch (typeof n) {
                                            case 'number':
                                                typing = (0, optional_1.some)('number');
                                                break;
                                            case 'boolean':
                                                typing = (0, optional_1.some)('boolean');
                                                break;
                                            case 'string':
                                                typing = (0, optional_1.some)('string');
                                                break;
                                            default:
                                                throw new Error(`not allowed type in array: ${typeof n}`);
                                        }
                                    });
                                    typing.some((typing) => {
                                        switch (typing) {
                                            case 'number':
                                                this[k1][k2].push(n);
                                                break;
                                            case 'string':
                                                this[k1][k2].push(n);
                                                break;
                                            case 'boolean':
                                                this[k1][k2].push(n);
                                                break;
                                            default:
                                                throw new Error(`not allowed type in array: ${typeof n}`);
                                        }
                                    });
                                }
                            }
                            else {
                                throw new Error(`not allowed object in single-section`);
                            }
                        }
                        else if (typeof obj[k1][k2] == 'object') {
                            for (let k3 in obj[k1][k2]) {
                                if (typeof obj[k1][k2][k3] == 'object') {
                                    if (Array.isArray(obj[k1][k2][k3])) {
                                        this[k1][k2][k3] = [];
                                        let typing = (0, optional_1.none)();
                                        for (let n of obj[k1][k2][k3]) {
                                            typing.none(() => {
                                                switch (typeof n) {
                                                    case 'number':
                                                        typing = (0, optional_1.some)('number');
                                                        break;
                                                    case 'boolean':
                                                        typing = (0, optional_1.some)('boolean');
                                                        break;
                                                    case 'string':
                                                        typing = (0, optional_1.some)('string');
                                                        break;
                                                    default:
                                                        throw new Error(`not allowed type in array: ${typeof n}`);
                                                }
                                            });
                                            typing.some((typing) => {
                                                if (typing != typeof n) {
                                                    throw new Error(`not allowed type in ${typing} array: ${typeof n}`);
                                                }
                                                switch (typing) {
                                                    case 'number':
                                                        this[k1][k2][k3].push(n);
                                                        break;
                                                    case 'string':
                                                        this[k1][k2][k3].push(n);
                                                        break;
                                                    case 'boolean':
                                                        this[k1][k2][k3].push(n);
                                                        break;
                                                    default:
                                                        throw new Error(`not allowed type in array: ${typeof n}`);
                                                }
                                            });
                                        }
                                    }
                                    else {
                                        throw new Error(`not allowed type in multi-section: ${typeof obj[k1][k2][k3]}`);
                                    }
                                }
                                else if (typeof obj[k1][k2][k3] == 'number') {
                                    this[k1][k2][k3] = obj[k1][k2][k3];
                                }
                                else if (obj[k1][k2][k3] == 'string') {
                                    this[k1][k2][k3] = obj[k1][k2][k3];
                                }
                                else if (obj[k1][k2][k3] == 'boolean') {
                                    this[k1][k2][k3] = obj[k1][k2][k3];
                                }
                            }
                        }
                        else {
                            throw new Error(`not allowed primitive type in multi-sections: ${typeof obj[k1][k2]}`);
                        }
                    });
                }
            }
        }
    }
    static from(obj) {
        try {
            return (0, result_1.ok)(new Toml(obj));
        }
        catch (e) {
            if (e instanceof Error) {
                return (0, result_1.err)(e);
            }
            else {
                throw new Error('not a Error');
            }
        }
    }
}
exports.Toml = Toml;
