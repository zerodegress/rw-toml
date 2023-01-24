import { none, some } from "./optional";
import { err, ok, Result } from "./result";

export class Ini {
    [key: string]: {
        [key: string]: string
    };

    constructor(obj: Object) {
        for(let k1 in obj) {
            this[k1] = {};
            if(typeof obj[k1] == 'object') {
                for(let k2 in (obj[k1] as Object)) {
                    if(typeof (obj[k1] as Object)[k2] == 'string') {
                        this[k1][k2] = (obj[k1] as Object)[k2];
                    } else {
                        throw new Error(`not string value in key:${k2}`);
                    }
                }
            } else {
                throw new Error(`not section value in section name:${k1}`);
            }
        }
    }

    static from(obj: Object): Result<Ini> {
        try {
            return ok(new Ini(obj));
        } catch(e) {
            if(e instanceof Error) {
                return err<Ini>(e);
            } else {
                throw new Error('not a Error');
            }
        }
    }
}

export class Toml {
    [key: string]: {
        [key: string]: number | string | boolean | string[] | number[] | boolean[];
    } | {
        [key: string]: {
            [key: string]: number | string | boolean | string[] | number[] | boolean[];
        }
    };

    constructor(obj: Object) {
        for(let k1 in obj) {
            this[k1] = {};
            if(typeof obj[k1] == 'object') {
                let single = none<boolean>();
                for(let k2 in (obj[k1] as Object)) {
                    single.none(() => {
                        if(typeof (obj[k1] as Object)[k2] == 'object') {
                            single = some(false);
                            this[k1][k2] = {};
                        } else {
                            single = some(true);
                        }
                    });
                    single.some((single) => {
                        if(single) {
                            if(typeof (obj[k1] as Object)[k2] == 'number') {
                                this[k1][k2] = (obj[k1] as Object)[k2] as 'number';
                            } else if(typeof (obj[k1] as Object)[k2] == 'string') {
                                this[k1][k2] = (obj[k1] as Object)[k2] as 'string';
                            } else if(typeof (obj[k1] as Object)[k2] == 'boolean') {
                                this[k1][k2] = (obj[k1] as Object)[k2] as 'boolean';
                            } else if(Array.isArray((obj[k1] as Object)[k2])) {
                                this[k1][k2] = [];
                                let typing = none<'number' | 'boolean' | 'string'>();
                                for(let n of (obj[k1] as Object)[k2] as Array<any>) {
                                    typing.none(() => {
                                        switch(typeof n) {
                                            case 'number':
                                                typing = some('number');
                                                break;
                                            case 'boolean':
                                                typing = some('boolean');
                                                break;
                                            case 'string':
                                                typing = some('string');
                                                break;
                                            default:
                                                throw new Error(`not allowed type in array: ${typeof n}`);
                                        }
                                    });
                                    typing.some((typing) => {
                                        switch(typing) {
                                            case 'number':
                                                (this[k1][k2] as Array<number>).push(n);
                                                break;
                                            case 'string':
                                                (this[k1][k2] as Array<string>).push(n);
                                                break;
                                            case 'boolean':
                                                (this[k1][k2] as Array<boolean>).push(n);
                                                break;
                                            default:
                                                throw new Error(`not allowed type in array: ${typeof n}`);
                                        }
                                    });
                                }
                            } else {
                                throw new Error(`not allowed object in single-section`);
                            }
                        } else if(typeof (obj[k1] as Object)[k2] == 'object') {
                            for(let k3 in ((obj[k1] as Object)[k2] as Object)) {
                                if(typeof ((obj[k1] as Object)[k2] as Object)[k3] == 'object') {
                                    if(Array.isArray(((obj[k1] as Object)[k2] as Object)[k3])) {
                                        this[k1][k2][k3] = [];
                                        let typing = none<'number' | 'boolean' | 'string'>();
                                        for(let n of ((obj[k1] as Object)[k2] as Object)[k3] as Array<any>) {
                                            typing.none(() => {
                                                switch(typeof n) {
                                                    case 'number':
                                                        typing = some('number');
                                                        break;
                                                    case 'boolean':
                                                        typing = some('boolean');
                                                        break;
                                                    case 'string':
                                                        typing = some('string');
                                                        break;
                                                    default:
                                                        throw new Error(`not allowed type in array: ${typeof n}`);
                                                }
                                            });
                                            typing.some((typing) => {
                                                if(typing != typeof n) {
                                                    throw new Error(`not allowed type in ${typing} array: ${typeof n}`);
                                                }
                                                switch(typing) {
                                                    case 'number':
                                                        (this[k1][k2][k3] as Array<number>).push(n);
                                                        break;
                                                    case 'string':
                                                        (this[k1][k2][k3] as Array<string>).push(n);
                                                        break;
                                                    case 'boolean':
                                                        (this[k1][k2][k3] as Array<boolean>).push(n);
                                                        break;
                                                    default:
                                                        throw new Error(`not allowed type in array: ${typeof n}`);
                                                }
                                            });
                                        }
                                    } else {
                                        throw new Error(`not allowed type in multi-section: ${typeof ((obj[k1] as Object)[k2] as Object)[k3]}`);
                                    }
                                } else if(typeof ((obj[k1] as Object)[k2] as Object)[k3] == 'number') {
                                    this[k1][k2][k3] = ((obj[k1] as Object)[k2] as Object)[k3] as 'number';
                                } else if(((obj[k1] as Object)[k2] as Object)[k3] == 'string') {
                                    this[k1][k2][k3] = ((obj[k1] as Object)[k2] as Object)[k3] as 'string';
                                } else if(((obj[k1] as Object)[k2] as Object)[k3] == 'boolean') {
                                    this[k1][k2][k3] = ((obj[k1] as Object)[k2] as Object)[k3] as 'boolean';
                                }
                            }
                        } else {
                            throw new Error(`not allowed primitive type in multi-sections: ${typeof (obj[k1] as Object)[k2]}`);
                        }
                    });
                }
            }
        }
    }

    static from(obj: Object): Result<Toml> {
        try {
            return ok(new Toml(obj));
        } catch(e) {
            if(e instanceof Error) {
                return err<Toml>(e);
            } else {
                throw new Error('not a Error');
            }
        }
    }
}