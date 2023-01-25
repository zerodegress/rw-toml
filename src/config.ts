import { none, Optional, some } from "./optional";

export interface StandardIni {
    [key: string]: {
        [key: string]: string
    };
}

export function implStandardIni(obj: any): obj is StandardIni {
    if(typeof obj == 'object') {
        const objx = obj as object;
        for(const sec in objx) {
            if(typeof objx[sec] != 'object') {
                return false;
            } else {
                const secObj = objx[sec] as object;
                for(const key in secObj) {
                    if(typeof secObj[key] != 'string') {
                        return false;
                    }
                }
            }
        }
        return true;
    } else {
        return false;
    }
}

export interface ClassicToml {
    [key: string]: {
        [key: string]: string
    }
}

export function implClassicToml(obj: any): obj is ClassicToml {
    if(typeof obj == 'object' && !Array.isArray(obj)) {
        const objx = obj as object;
        for(const sec in objx) {
            if(typeof objx[sec] != 'object' || Array.isArray(objx[sec])) {
                return false
            } else {
                const section = objx[sec] as object;
                for(const key in section) {
                    if(typeof section[key] != 'string') {
                        return false;
                    }
                }
            }
        }
        return true;
    } else {
        return false;
    }
}

export interface CommonToml {
    [key: string]: {
        [key: string]: number | string | boolean | string[] | number[] | boolean[];
    } | {
        [key: string]: {
            [key: string]: number | string | boolean | string[] | number[] | boolean[];
        }
    }
}

type ValueOf<T> = T[keyof T];

export function arrayType(arr: Array<any>): Optional<'string' | 'number' | 'boolean'> {
    let type = none<'string' | 'number' | 'boolean'>();
    for(const v of arr) {
        type.none(() => {
            switch(typeof v) {
                case 'number':
                    type = some('number');
                    break;
                case 'string':
                    type = some('string');
                    break;
                case 'boolean':
                    type = some('boolean');
                    break;
            }
        });
        if(type.isNone()) {
            return none();
        }
        try {
            type.some((type) => {
                if(type != typeof v) {
                    throw none<'string' | 'number' | 'boolean'>();
                }
            });
        } catch(none) {
            if(none instanceof Optional<'string' | 'number' | 'boolean'>) {
                return none;
            } else {
                throw none;
            }
        }
    }
    return type;
}

export function implCommonToml(obj: any): obj is CommonToml {
    if(typeof obj == 'object') {
        const objx = obj as object;
        for(const secOrSecs in objx) {
            if(typeof objx[secOrSecs] != 'object') {
                return false;
            } else {
                const secOrSecsObj = objx[secOrSecs] as object;
                let isObject = none<boolean>();
                for(const keyOrSec in secOrSecsObj) {
                    try {
                        isObject.none(() => {
                            if(Array.isArray(secOrSecsObj[keyOrSec])) {
                                isObject = some(false);
                                arrayType(secOrSecsObj[keyOrSec]).none(() => {throw false});
                            } else if(typeof secOrSecsObj[keyOrSec] == 'object') {
                                isObject = some(true);
                            } else {
                                isObject = some(false);
                            }
                        });
                        isObject.some((flag) => {
                            if(flag) {
                                if(typeof secOrSecsObj[keyOrSec] != 'object') {
                                    throw false;
                                }
                                const secObj = secOrSecsObj[keyOrSec] as object;
                                for(const key in secObj) {
                                    const value = secObj[key];
                                    if(Array.isArray(value)) {
                                        arrayType(value).none(() => {throw false});
                                    } else if(typeof value == 'object') {
                                        throw false;
                                    } else {
                                        switch(typeof value) {
                                            case 'string':
                                            case 'number':
                                            case 'boolean':
                                                break;
                                            default:
                                                throw false;
                                        }
                                    }
                                }
                            } else {
                                const secObj = secOrSecsObj;
                                for(const key in secObj) {
                                    const value = secObj[key];
                                    if(Array.isArray(value)) {
                                        arrayType(value).none(() => {throw false});
                                    } else if(typeof value == 'object') {
                                        throw false;
                                    } else {
                                        switch(typeof value) {
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
                    } catch (result) {
                        if(typeof result == 'boolean') {
                            return result;
                        } else {
                            throw result;
                        }
                    }
                }
            }
        }
        return true;
    } else {
        return false;
    }
}

export function* commonTomlEveryKey(toml: CommonToml) {
    if(Object.keys(toml).length == 0) {
        return none<{secMain: string, secSub: Optional<string>, key: string, value: string | number | boolean | string[] | number[] | boolean[]}>();
    } else {
        for(const secOrSecs in toml) {
            for(const keyOrSec in toml[secOrSecs]) {
                if(typeof toml[secOrSecs][keyOrSec] == 'object' && !Array.isArray(toml[secOrSecs][keyOrSec])) {
                    const sec = toml[secOrSecs][keyOrSec] as {
                        [key: string]: string | number | boolean | string[] | number[] | boolean[];
                    };
                    for(const key in sec) {
                        yield some({secMain: secOrSecs, secSub: some(keyOrSec), key: key, value: sec[key]});
                    }
                } else {
                    const value = toml[secOrSecs][keyOrSec] as string | number | boolean | string[] | number[] | boolean[];
                    yield some({secMain: secOrSecs, secSub: none<string>(), key: keyOrSec, value: value});
                }
            }
        }
    }
    return none<{secMain: string, secSub: Optional<string>, key: string, value: string | number | boolean | string[] | number[] | boolean[]}>();
}