import { Optional } from "./optional";
export interface StandardIni {
    [key: string]: {
        [key: string]: string;
    };
}
export declare function implStandardIni(obj: any): obj is StandardIni;
export interface ClassicToml {
    [key: string]: {
        [key: string]: string;
    };
}
export declare function implClassicToml(obj: any): obj is ClassicToml;
export interface CommonToml {
    [key: string]: {
        [key: string]: number | string | boolean | string[] | number[] | boolean[];
    } | {
        [key: string]: {
            [key: string]: number | string | boolean | string[] | number[] | boolean[];
        };
    };
}
export declare function arrayType(arr: Array<any>): Optional<'string' | 'number' | 'boolean'>;
export declare function implCommonToml(obj: any): obj is CommonToml;
export declare function commonTomlEveryKey(toml: CommonToml): Generator<Optional<{
    secMain: string;
    secSub: Optional<string>;
    key: string;
    value: string | number | boolean | string[] | number[] | boolean[];
}>, Optional<{
    secMain: string;
    secSub: Optional<string>;
    key: string;
    value: string | number | boolean | string[] | number[] | boolean[];
}>, unknown>;
