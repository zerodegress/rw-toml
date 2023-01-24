import { none, optional, Optional, some } from "../optional";

import path, { resolve } from "path-browserify";
import { Builder } from ".";
import { err, ok, Result } from "../result";
import { Ini, Toml } from "../config";

export interface FileLike {
    filename: string;
    dirname: string;
}

export class PathLike {
    path: string;

    constructor(path: string) {
        this.path = path;
    }
}

export enum ClassicSourceFileType {
    TOML,
    TXT,
    PNG,
    OGG,
    WAV,
    MP3,
    UNKNOWN_ASSET
}

export class ClassicSourceFile {
    private type: ClassicSourceFileType;
    private content: Toml | string | PathLike;

    private constructor(type: ClassicSourceFileType, content: Toml | string | PathLike) {
        this.type = type;
        this.content = content;
    }

    static toml(content: Toml): ClassicSourceFile {
        return new ClassicSourceFile(ClassicSourceFileType.TOML, content);
    }

    static txt(content: string): ClassicSourceFile {
        return new ClassicSourceFile(ClassicSourceFileType.TXT, content);
    }

    static asset(content: PathLike): ClassicSourceFile {
        return new ClassicSourceFile((() => {
            if(path.extname(content.path) == '.png') {
                return ClassicSourceFileType.PNG;
            } else if(path.extname(content.path) == '.ogg') {
                return ClassicSourceFileType.OGG;
            } else if(path.extname(content.path) == '.mp3') {
                return ClassicSourceFileType.MP3;
            } else if(path.extname(content.path) == '.wav') {
                return ClassicSourceFileType.WAV;
            } else {
                return ClassicSourceFileType.UNKNOWN_ASSET;
            }
        })(), content);
    }

    isToml(): boolean {
        return this.type == ClassicSourceFileType.TOML;
    }

    isTxt(): boolean {
        return this.type == ClassicSourceFileType.TXT;
    }


    toml(callback: (content: Toml) => void) {
        if(this.isToml() && this.content instanceof Toml) {
            callback(this.content);
        }
    }
}

export class ClassicSource implements FileLike {
    filename: string;
    dirname: string;
    path: string;
    sourceFile: ClassicSourceFile;
    target: Optional<ClassicTarget>;

    private constructor(filename: string, dirname: string, path: string, content: Toml | string | PathLike) {
        this.filename = filename;
        this.dirname = dirname;
        this.path = path;
        this.target = none();
        if(content instanceof PathLike) {
            this.sourceFile = ClassicSourceFile.asset(content);
        } else if(typeof content == 'object') {
            this.sourceFile = ClassicSourceFile.toml(content);
        } else {
            this.sourceFile = ClassicSourceFile.txt(content);
        }
    }

    static toml(filename: string, dirname: string, path: string, content: Toml): ClassicSource {
        return new ClassicSource(filename, dirname, path, content);
    }

    static txt(filename: string, dirname: string, path: string, content: string): ClassicSource {
        return new ClassicSource(filename, dirname, path, content);
    }

    static pathLike(filename: string, dirname: string, path: string, content: PathLike): ClassicSource {
        return new ClassicSource(filename, dirname, path, content);
    }

    isToml(): boolean {
        return this.sourceFile.isToml();
    }

    isBuilt(): boolean {
        return this.target != undefined;
    }

    built(callback: (target: ClassicTarget) => void): ClassicSource {
        this.target.some((value) => callback(value));
        return this;
    }

    unbuilt(callback: () => void): ClassicSource {
        this.target.none(() => callback());
        return this;
    }
}

export enum ClassicTargetFileType {
    INI,
    TXT,
    ASSET
}

export class CopyFromSource {}

export class ClassicTargetFile {
    type: ClassicTargetFileType;
    content: Ini | string | CopyFromSource;

    private constructor(type: ClassicTargetFileType, content: Ini | string | CopyFromSource) {
        this.type = type;
        this.content = content;
    }

    static ini(content: Ini) {
        return new ClassicTargetFile(ClassicTargetFileType.INI, content);
    }

    static txt(content: string) {
        return new ClassicTargetFile(ClassicTargetFileType.TXT, content);
    }

    static asset() {
        return new ClassicTargetFile(ClassicTargetFileType.ASSET, new CopyFromSource());
    }
}

export class ClassicTarget implements FileLike {
    filename: string;
    dirname: string;
    source: ClassicSource;

    constructor(filename: string, dirname: string, source: ClassicSource) {
        this.filename = filename;
        this.dirname = dirname;
        this.source = source;
    }

    isIni(): boolean {
        return path.extname(this.filename) == '.ini';
    }
}

export class ClassicSyncBuilder implements Builder<ClassicSource, ClassicTarget> {
    context: {
        rootDir: string;
        srcDir: string;
        distDir: string;
        sources: ClassicSource[];
        targets: ClassicTarget[];
    };

    constructor(rootDir: string, srcDir: string, distDir: string, sources: ClassicSource[]) {
        this.context = {
            rootDir: rootDir,
            srcDir: srcDir,
            distDir: distDir,
            sources: sources,
            targets: []
        }
    }

    require(path: string): Promise<{ source: ClassicSource; target: ClassicTarget; }> {
        return new Promise<{ source: ClassicSource; target: ClassicTarget; }>((resolve, reject) => {
            this.requireSync(path).ok((value) => resolve(value)).err((value) => reject(value));
        });
    }
    build(path: string): Promise<ClassicTarget> {
        return new Promise<ClassicTarget>((resolve, reject) => {
            this.buildSync(path).ok((value) => resolve(value)).err((value) => reject(value));
        });
    }
    buildAll(): Promise<ClassicTarget[]> {
        return new Promise<ClassicTarget[]>((resolve, reject) => {
            this.buildAllSync().ok((value) => resolve(value)).err((value) => reject(value));
        });
    }

    requireSync(path: string): Result<{ source: ClassicSource; target: ClassicTarget; }, Error> {
        let {source, target} = {source: none<ClassicSource>(), target: none<ClassicTarget>()};
        let error = none<Error>();
        optional(this.context.sources.find((value) => value.path == path)).some((value) => {
            source = some(value);
            value.built((value) => target = some(value)).unbuilt(() => {
                this.buildSync(path).ok((result) => target = some(result)).err((result) => error = some(result));
            });
        }).none(() => error = some(new Error('requirement does not exists')));
        if(error.isSome()) {
            return err(error.unwrap());
        } else {
            return ok({source: source.unwrap(), target: target.unwrap()});
        }
    }
    buildSync(path: string): Result<ClassicTarget, Error> {
        let target = none<ClassicTarget>();
        let error = none<Error>();
        optional(this.context.sources.find((value) => value.path == path)).some((source) => {
            source.built((value) => target = some(value)).unbuilt(() => {
            });
        }).none(() => error = some(new Error('source does not exists')));
        if(error.isSome()) {
            return err(error.unwrap());
        } else {
            return ok(target.unwrap());
        }
    }
    buildAllSync(): Result<ClassicTarget[], Error> {
        let error = none<Error>();
        for(const source of this.context.sources) {
            const result = this.buildSync(source.path).err((result) => error = some(result));
            if(result.isErr()) {
                return err(error.unwrap());
            }
        }
        return ok(this.context.targets);
    }
    
}