import { Builder } from ".";
import { Result } from "../error";

import nFs from "fs";
import nPath from "path";
import walkdir from "walkdir";

export class ClassicSource {
    file: string;
    target?: ClassicTarget;

    constructor(file: string) {
        this.file = file;
    }

    isBuilt(): boolean {
        return this.target != undefined;
    }
}

export class ClassicTarget {
    file: string;
    source: ClassicSource;

    constructor(file: string, source: ClassicSource) {
        this.file = file;
        this.source = source;
    }

    isIni(): boolean {
        return nPath.extname(this.file) == '.ini';
    }
}