import { Result } from "./result";
export declare class Ini {
    [key: string]: {
        [key: string]: string;
    };
    constructor(obj: Object);
    static from(obj: Object): Result<Ini>;
}
export declare class Toml {
    [key: string]: {
        [key: string]: number | string | boolean | string[] | number[] | boolean[];
    } | {
        [key: string]: {
            [key: string]: number | string | boolean | string[] | number[] | boolean[];
        };
    };
    constructor(obj: Object);
    static from(obj: Object): Result<Toml>;
}
