import { Optional } from "../optional";
import { Builder } from ".";
import { Result } from "../result";
import { Ini, Toml } from "../config";
export interface FileLike {
    filename: string;
    dirname: string;
}
export declare class PathLike {
    path: string;
    constructor(path: string);
}
export declare enum ClassicSourceFileType {
    TOML = 0,
    TXT = 1,
    PNG = 2,
    OGG = 3,
    WAV = 4,
    MP3 = 5,
    UNKNOWN_ASSET = 6
}
export declare class ClassicSourceFile {
    private type;
    private content;
    private constructor();
    static toml(content: Toml): ClassicSourceFile;
    static txt(content: string): ClassicSourceFile;
    static asset(content: PathLike): ClassicSourceFile;
    isToml(): boolean;
    isTxt(): boolean;
    toml(callback: (content: Toml) => void): void;
}
export declare class ClassicSource implements FileLike {
    filename: string;
    dirname: string;
    path: string;
    sourceFile: ClassicSourceFile;
    target: Optional<ClassicTarget>;
    private constructor();
    static toml(filename: string, dirname: string, path: string, content: Toml): ClassicSource;
    static txt(filename: string, dirname: string, path: string, content: string): ClassicSource;
    static pathLike(filename: string, dirname: string, path: string, content: PathLike): ClassicSource;
    isToml(): boolean;
    isBuilt(): boolean;
    built(callback: (target: ClassicTarget) => void): ClassicSource;
    unbuilt(callback: () => void): ClassicSource;
}
export declare enum ClassicTargetFileType {
    INI = 0,
    TXT = 1,
    ASSET = 2
}
export declare class CopyFromSource {
}
export declare class ClassicTargetFile {
    type: ClassicTargetFileType;
    content: Ini | string | CopyFromSource;
    private constructor();
    static ini(content: Ini): ClassicTargetFile;
    static txt(content: string): ClassicTargetFile;
    static asset(): ClassicTargetFile;
}
export declare class ClassicTarget implements FileLike {
    filename: string;
    dirname: string;
    source: ClassicSource;
    targetFile: ClassicTargetFile;
    constructor(filename: string, dirname: string, source: ClassicSource, targetFile: ClassicTargetFile);
    isIni(): boolean;
}
export declare class ClassicBuilderSync implements Builder<ClassicSource, ClassicTarget> {
    context: {
        rootDir: string;
        srcDir: string;
        distDir: string;
        sources: ClassicSource[];
        targets: ClassicTarget[];
    };
    constructor(rootDir: string, srcDir: string, distDir: string, sources: ClassicSource[]);
    require(path: string): Promise<{
        source: ClassicSource;
        target: ClassicTarget;
    }>;
    build(path: string): Promise<ClassicTarget>;
    buildAll(): Promise<ClassicTarget[]>;
    requireSync(path: string): Result<{
        source: ClassicSource;
        target: ClassicTarget;
    }, Error>;
    buildSync(path: string): Result<ClassicTarget, Error>;
    buildAllSync(): Result<ClassicTarget[], Error>;
}
