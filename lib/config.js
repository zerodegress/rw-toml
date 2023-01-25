"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonTomlEveryKey = exports.implCommonToml = exports.arrayType = exports.implClassicToml = exports.implStandardIni = void 0;
const optional_1 = require("./optional");
function implStandardIni(obj) {
    if (typeof obj == 'object') {
        const objx = obj;
        for (const sec in objx) {
            if (typeof objx[sec] != 'object') {
                return false;
            }
            else {
                const secObj = objx[sec];
                for (const key in secObj) {
                    if (typeof secObj[key] != 'string') {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    else {
        return false;
    }
}
exports.implStandardIni = implStandardIni;
function implClassicToml(obj) {
    if (typeof obj == 'object' && !Array.isArray(obj)) {
        const objx = obj;
        for (const sec in objx) {
            if (typeof objx[sec] != 'object' || Array.isArray(objx[sec])) {
                return false;
            }
            else {
                const section = objx[sec];
                for (const key in section) {
                    if (typeof section[key] != 'string') {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    else {
        return false;
    }
}
exports.implClassicToml = implClassicToml;
function arrayType(arr) {
    let type = (0, optional_1.none)();
    for (const v of arr) {
        type.none(() => {
            switch (typeof v) {
                case 'number':
                    type = (0, optional_1.some)('number');
                    break;
                case 'string':
                    type = (0, optional_1.some)('string');
                    break;
                case 'boolean':
                    type = (0, optional_1.some)('boolean');
                    break;
            }
        });
        if (type.isNone()) {
            return (0, optional_1.none)();
        }
        try {
            type.some((type) => {
                if (type != typeof v) {
                    throw (0, optional_1.none)();
                }
            });
        }
        catch (none) {
            if (none instanceof (optional_1.Optional)) {
                return none;
            }
            else {
                throw none;
            }
        }
    }
    return type;
}
exports.arrayType = arrayType;
function implCommonToml(obj) {
    if (typeof obj == 'object') {
        const objx = obj;
        for (const secOrSecs in objx) {
            if (typeof objx[secOrSecs] != 'object') {
                return false;
            }
            else {
                const secOrSecsObj = objx[secOrSecs];
                let isObject = (0, optional_1.none)();
                for (const keyOrSec in secOrSecsObj) {
                    try {
                        isObject.none(() => {
                            if (Array.isArray(secOrSecsObj[keyOrSec])) {
                                isObject = (0, optional_1.some)(false);
                                arrayType(secOrSecsObj[keyOrSec]).none(() => { throw false; });
                            }
                            else if (typeof secOrSecsObj[keyOrSec] == 'object') {
                                isObject = (0, optional_1.some)(true);
                            }
                            else {
                                isObject = (0, optional_1.some)(false);
                            }
                        });
                        isObject.some((flag) => {
                            if (flag) {
                                if (typeof secOrSecsObj[keyOrSec] != 'object') {
                                    throw false;
                                }
                                const secObj = secOrSecsObj[keyOrSec];
                                for (const key in secObj) {
                                    const value = secObj[key];
                                    if (Array.isArray(value)) {
                                        arrayType(value).none(() => { throw false; });
                                    }
                                    else if (typeof value == 'object') {
                                        throw false;
                                    }
                                    else {
                                        switch (typeof value) {
                                            case 'string':
                                            case 'number':
                                            case 'boolean':
                                                break;
                                            default:
                                                throw false;
                                        }
                                    }
                                }
                            }
                            else {
                                const secObj = secOrSecsObj;
                                for (const key in secObj) {
                                    const value = secObj[key];
                                    if (Array.isArray(value)) {
                                        arrayType(value).none(() => { throw false; });
                                    }
                                    else if (typeof value == 'object') {
                                        throw false;
                                    }
                                    else {
                                        switch (typeof value) {
                                            case 'string':
                                            case 'number':
                                            case 'boolean':
                                                break;
                                            default:
                                                throw false;
                                        }
                                    }
                                }
                            }
                        });
                    }
                    catch (result) {
                        if (typeof result == 'boolean') {
                            return result;
                        }
                        else {
                            throw result;
                        }
                    }
                }
            }
        }
        return true;
    }
    else {
        return false;
    }
}
exports.implCommonToml = implCommonToml;
function* commonTomlEveryKey(toml) {
    if (Object.keys(toml).length == 0) {
        return (0, optional_1.none)();
    }
    else {
        for (const secOrSecs in toml) {
            for (const keyOrSec in toml[secOrSecs]) {
                if (typeof toml[secOrSecs][keyOrSec] == 'object' && !Array.isArray(toml[secOrSecs][keyOrSec])) {
                    const sec = toml[secOrSecs][keyOrSec];
                    for (const key in sec) {
                        yield (0, optional_1.some)({ secMain: secOrSecs, secSub: (0, optional_1.some)(keyOrSec), key: key, value: sec[key] });
                    }
                }
                else {
                    const value = toml[secOrSecs][keyOrSec];
                    yield (0, optional_1.some)({ secMain: secOrSecs, secSub: (0, optional_1.none)(), key: keyOrSec, value: value });
                }
            }
        }
    }
    return (0, optional_1.none)();
}
exports.commonTomlEveryKey = commonTomlEveryKey;
