import { none, optional, Optional, some } from "../optional";

import pathb from "path-browserify";
import normalizePath from "normalize-path";
import { Builder, BuilderContext, PathBuilder, PathBuilderContext } from ".";
import { err, ok, Result } from "../result";
import { StandardIni, CommonToml, implCommonToml, commonTomlEveryKey } from "../config";
import { Filter, Transform } from "../function";

export function normalize(pat: string): string {
    return normalizePath(pathb.normalize(pat));
}

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
    TOML = 'TOML',
    TXT = 'TXT',
    PNG = 'PNG',
    JPEG = 'JPEG',
    OGG = 'OGG',
    WAV = 'WAV',
    MP3 = 'MP3',
    UNKNOWN_ASSET = 'UNKNOWN_ASSET'
}

export class ClassicSourceFile {
    private type: ClassicSourceFileType;
    private content: CommonToml | string | PathLike;

    private constructor(type: ClassicSourceFileType, content: CommonToml | string | PathLike) {
        this.type = type;
        if(content instanceof PathLike) {
            content.path = normalize(content.path);
        }
        this.content = content;
    }

    static toml(content: CommonToml): ClassicSourceFile {
        return new ClassicSourceFile(ClassicSourceFileType.TOML, content);
    }

    static txt(content: string): ClassicSourceFile {
        return new ClassicSourceFile(ClassicSourceFileType.TXT, content);
    }

    static asset(content: PathLike): ClassicSourceFile {
        return new ClassicSourceFile((() => {
            if(pathb.extname(content.path) == '.png') {
                return ClassicSourceFileType.PNG;
            } else if(pathb.extname(content.path) == '.jpg' || pathb.extname(content.path) == '.jpeg') {
                return ClassicSourceFileType.JPEG;
            } else if(pathb.extname(content.path) == '.ogg') {
                return ClassicSourceFileType.OGG;
            } else if(pathb.extname(content.path) == '.mp3') {
                return ClassicSourceFileType.MP3;
            } else if(pathb.extname(content.path) == '.wav') {
                return ClassicSourceFileType.WAV;
            } else {
                return ClassicSourceFileType.UNKNOWN_ASSET;
            }
        })(), content);
    }

    isCommonToml(): boolean {
        return this.type == ClassicSourceFileType.TOML;
    }

    isTxt(): boolean {
        return this.type == ClassicSourceFileType.TXT;
    }

    isImage(): boolean {
        return this.type == ClassicSourceFileType.PNG || this.type == ClassicSourceFileType.JPEG;
    }

    isSoundOrMusic(): boolean {
        return this.type == ClassicSourceFileType.OGG || this.type == ClassicSourceFileType.MP3 || this.type == ClassicSourceFileType.WAV;
    }

    isUnknownAsset(): boolean {
        return this.type == ClassicSourceFileType.UNKNOWN_ASSET;
    }

    toml(callback: (content: CommonToml) => void): ClassicSourceFile {
        if(this.isCommonToml()) {
            if(implCommonToml(this.content)) {
                callback(this.content);
            } else {
                throw new Error('internal error');
            }
        }
        return this;
    }

    txt(callback: (content: string) => void): ClassicSourceFile {
        if(this.isTxt()) {
            if(typeof this.content == 'string') {
                callback(this.content);
            } else {
                throw new Error('internal error');
            }
        }
        return this;
    }

    image(callback: (content: PathLike) => void): ClassicSourceFile {
        if(this.isImage()) {
            if(this.content instanceof PathLike) {
                callback(this.content);
            } else {
                throw new Error('internal error');
            }
        }
        return this;
    }

    soundOrMusic(callback: (content: PathLike) => void): ClassicSourceFile {
        if(this.isSoundOrMusic()) {
            if(this.content instanceof PathLike) {
                callback(this.content);
            } else {
                throw new Error('internal error');
            }
        }
        return this;
    }

    unknownAsset(callback: (content: PathLike) => void): ClassicSourceFile {
        if(this.isUnknownAsset()) {
            if(this.content instanceof PathLike) {
                callback(this.content);
            } else {
                throw new Error('internal error');
            }
        }
        return this;
    }
}

export class ClassicSource implements FileLike {
    filename: string;
    dirname: string;
    path: string;
    sourceFile: ClassicSourceFile;
    target: Optional<ClassicTarget>;

    private constructor(filename: string, dirname: string, path: string, content: CommonToml | string | PathLike) {
        this.filename = filename;
        this.dirname = normalize(dirname);
        this.path = normalize(path);
        this.target = none();
        if(content instanceof PathLike) {
            content.path = normalize(content.path);
            this.sourceFile = ClassicSourceFile.asset(content);
        } else if(typeof content == 'object') {
            this.sourceFile = ClassicSourceFile.toml(content);
        } else {
            this.sourceFile = ClassicSourceFile.txt(content);
        }
    }

    static toml(filename: string, dirname: string, path: string, content: CommonToml): ClassicSource {
        return new ClassicSource(filename, dirname, path, content);
    }

    static txt(filename: string, dirname: string, path: string, content: string): ClassicSource {
        return new ClassicSource(filename, dirname, path, content);
    }

    static pathLike(filename: string, dirname: string, path: string, content: PathLike): ClassicSource {
        return new ClassicSource(filename, dirname, path, content);
    }

    isCommonToml(): boolean {
        return this.sourceFile.isCommonToml();
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
    INI = 'INI',
    TXT = 'TXT',
    ASSET = 'ASSET'
}

export class CopyFromSource {}

export class ClassicTargetFile {
    type: ClassicTargetFileType;
    content: StandardIni | string | CopyFromSource;

    private constructor(type: ClassicTargetFileType, content: StandardIni | string | CopyFromSource) {
        this.type = type;
        this.content = content;
    }

    static ini(content: StandardIni) {
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
    targetFile: ClassicTargetFile;

    constructor(filename: string, dirname: string, source: ClassicSource, targetFile: ClassicTargetFile) {
        this.filename = filename;
        this.dirname = normalize(dirname);
        source.dirname = normalize(source.dirname);
        source.path = normalize(source.path);
        this.source = source;
        this.targetFile = targetFile;
    }

    isStandardIni(): boolean {
        return pathb.extname(this.filename) == '.ini';
    }
}

export class ClassicBuilderSync implements PathBuilder<ClassicSource, ClassicTarget> {
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

    require(path: string, starterPath?: string): Result<{source: ClassicSource;target: ClassicTarget;}, Error> {
        try {
            if(starterPath == path) {
                throw err<ClassicTarget, Error>(new Error(`circle require ${starterPath} by ${path}`));
            }
            optional(this.context.sources.find((value) => value.path == path)).some((source) => {
                source.built((target) => {throw ok({source, target})}).unbuilt(() => {
                    this.build(path, starterPath).ok((target) => {throw ok({source, target})}).err((error) => {throw err<{source: ClassicSource;target: ClassicTarget;}, Error>(error)});
                });
            }).none(() => {throw err(new Error(`requirement "${path}" does not exists`))});
            throw new Error('unreachable!');
        } catch(result) {
            if(result instanceof Result<{source: ClassicSource;target: ClassicTarget;}, Error>) {
                return result;
            } else {
                throw result;
            }
        }
    }
    build(path: string, starterPath?: string): Result<ClassicTarget, Error> {
        try {
            optional(this.context.sources.find((value) => value.path == path)).some((source) => {
                source.sourceFile.toml((toml) => {
                    let ini: StandardIni = {};
                    const gen = commonTomlEveryKey(toml);
                    while(true) {
                        const { value, done } = gen.next();
                        if(!done) {
                            value.some(({secMain, secSub, key, value}) => {
                                secSub.some((secSub) => {
                                    optional(ini[`${secMain}_${secSub}`]).none(() => {
                                        ini[`${secMain}_${secSub}`] = {};
                                    });
                                    optional(ini[`${secMain}_${secSub}`]).some((section) => {
                                        section[key] = (() => {
                                            if(Array.isArray(value)) {
                                                return value.join();
                                            } else {
                                                return value.toString();
                                            }
                                        })();
                                    });
                                }).none(() => {
                                    optional(ini[secMain]).none(() => {
                                        ini[secMain] = {};
                                    });
                                    optional(ini[secMain]).some((section) => {
                                        section[key] = (() => {
                                            if(Array.isArray(value)) {
                                                return value.join();
                                            } else {
                                                let outputValue = value.toString();
                                                if(secMain == 'core' && key == 'copyFrom') {
                                                    let requirePath = normalize(value.toString().trim());
                                                    if(requirePath.startsWith('/')) {
                                                        requirePath = requirePath.replace(/^\//, '');
                                                        outputValue = 'ROOT:' + requirePath;
                                                    } else {
                                                        requirePath = normalize(pathb.join(source.dirname, requirePath));
                                                        outputValue = requirePath;
                                                    }
                                                    this.require(requirePath, starterPath != undefined ? starterPath : source.path).err((error) => {throw err(error)});
                                                }
                                                return outputValue.replace(/\.toml$/, '.ini');
                                            }
                                        })();
                                    });
                                });
                            });
                        } else {
                            break;
                        }
                    }
                    const target = new ClassicTarget(source.filename.replace(/\.toml$/, '.ini'), source.dirname, source, ClassicTargetFile.ini(ini));
                    source.target = some(target);
                    this.context.targets.push(target);
                    throw ok(target);
                }).txt((content) => {
                    const target = new ClassicTarget(source.filename, source.dirname, source, ClassicTargetFile.txt(content));
                    source.target = some(target);
                    this.context.targets.push(target);
                    throw ok(target);
                }).image((content) => {
                    const target = new ClassicTarget(source.filename, source.dirname, source, ClassicTargetFile.asset());
                    this.context.targets.push(target);
                    throw ok(target);
                }).soundOrMusic((content) => {
                    const target = new ClassicTarget(source.filename, source.dirname, source, ClassicTargetFile.asset());
                    this.context.targets.push(target);
                    throw ok(target);
                }).unknownAsset((content) => {
                    const target = new ClassicTarget(source.filename, source.dirname, source, ClassicTargetFile.asset());
                    this.context.targets.push(target);
                    throw ok(target);
                });
            }).none(() => {throw err<ClassicTarget, Error>(new Error('source does not exists'))});
            throw new Error('unreachable!');
        } catch(result) {
            if(result instanceof Result<ClassicTarget, Error>) {
                return result;
            } else {
                throw result;
            }
        }
    }
    buildAll(): Result<ClassicTarget[], Error> {
        try {
            for(const source of this.context.sources) {
                const result = this.build(source.path).err((error) => {throw err<ClassicTarget[], Error>(error)});
            }
            throw ok(this.context.targets);
        } catch(result) {
            if(result instanceof Result<ClassicTarget[], Error>) {
                return result;
            } else {
                throw result;
            }
        }
    }

    requireSync(path: string, starterPath?: string): Result<{source: ClassicSource;target: ClassicTarget;}, Error> {
        return this.require(path, starterPath);
    }
    buildSync(path: string, starterPath?: string): Result<ClassicTarget, Error> {
        return this.build(path, starterPath);
    }
    buildAllSync(): Result<ClassicTarget[], Error> {
        return this.buildAll();
    }
}

export interface ClassicPostBuilder<P, T extends Transform<P> = (x: P) => P, M  = (x: P) => ClassicSource> extends PathBuilder<P, ClassicSource> {
    rules: Iterable<T>;
    complete: M;
}

export class ClassicPostTranslator implements PathBuilder<[ClassicSource, Optional<ClassicSource>], ClassicSource> {
    rules: Array<Transform<ClassicSource>>;
    complete: (x: ClassicSource) => ClassicSource;
    context: PathBuilderContext<[ClassicSource, Optional<ClassicSource>], ClassicSource>;

    constructor(rootDir: string, srcDir: string, distDir: string, sources: ClassicSource[], rules: Transform<ClassicSource>[]) {
        this.context = {
            rootDir: rootDir,
            srcDir: srcDir,
            distDir: distDir,
            sources: sources.map((x) => [x, none()]),
            targets: []
        }
        this.rules = rules;
        this.complete = (x) => x;
    }

    require(path: string, starterPath?: string): Result<{ source: [ClassicSource, Optional<ClassicSource>]; target: ClassicSource; }, Error> {
        try {
            if(starterPath == path) {
                throw err<{ source: [ClassicSource, Optional<ClassicSource>]; target: ClassicSource; }, Error>(new Error(`circle require ${starterPath} by ${path}`));
            }
            optional(this.context.sources.find(([x, _]) => x.path == path)).some(([x, build]) => {
                build.some((build) => {throw ok(build)}).none(() => {
                    this.build(path, starterPath).ok((build) => {throw ok(build)}).err((error) => {
                        throw err<{ source: [ClassicSource, Optional<ClassicSource>]; target: ClassicSource; }, Error>(error);
                    });
                });
            }).none(() => {throw err(new Error(`requirement "${path}" does not exists`))});
            throw new Error('unreachable!');
        } catch(result) {
            if(result instanceof Result<{ source: [ClassicSource, Optional<ClassicSource>]; target: ClassicSource; }, Error>) {
                return result;
            } else {
                throw result;
            }
        }
    }
    build(path: string, starter?: string): Result<ClassicSource, Error> {
        try {
            optional(this.context.sources.find(([source, _]) => source.path == path)).some((src) => {
                src[1].some((target) => {
                    throw ok(target);
                }).none(() => {
                    let mid = src[0];
                    for(const rule of this.rules) {
                        mid = rule(mid);
                    }
                    mid = this.complete(mid);
                    this.context.targets.push(mid);
                    src[1] = some(mid);
                    throw ok(mid);
                });
            }).none(() => {throw err<ClassicTarget, Error>(new Error('source does not exists'))});
        } catch(result) {
            if(result instanceof Result<ClassicSource, Error>) {
                return result;
            } else {
                throw result;
            }
        }
        throw new Error('unreachable!');
    }
    buildAll(): Result<ClassicSource[], Error> {
        try {
            for(const [source, target] of this.context.sources) {
                if(target.isSome()) {
                    continue;
                } else {
                    this.build(source.path).err((error) => {throw err<ClassicSource[], Error>(error)});
                }
            }
            throw ok(this.context.targets);
        } catch(result) {
            if(result instanceof Result<ClassicSource[], Error>) {
                return result;
            } else {
                throw result;
            }
        }
    }
}