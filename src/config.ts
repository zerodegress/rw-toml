export class Ini {
    [key: string]: {
        [key: string]: string
    };
}

export class Toml {
    [key: string]: {
        [key: string]: number | string | string[] | number[] | {
            [key: string]: number | string | string[] | number[];
        };
    };
}