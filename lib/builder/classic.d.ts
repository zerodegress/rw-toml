import { Optional } from "../optional";
import { Builder } from ".";
import { Result } from "../result";
import { StandardIni, CommonToml } from "../config";
export declare function normalize(pat: string): string;
export interface FileLike {
    filename: string;
    dirname: string;
}
export declare class PathLike {
    path: string;
    constructor(path: string);
}
export declare enum ClassicSourceFileType {
    TOML = "TOML",
    TXT = "TXT",
    PNG = "PNG",
    JPEG = "JPEG",
    OGG = "OGG",
    WAV = "WAV",
    MP3 = "MP3",
    UNKNOWN_ASSET = "UNKNOWN_ASSET"
}
export declare class ClassicSourceFile {
    private type;
    private content;
    private constructor();
    static toml(content: CommonToml): ClassicSourceFile;
    static txt(content: string): ClassicSourceFile;
    static asset(content: PathLike): ClassicSourceFile;
    isCommonToml(): boolean;
    isTxt(): boolean;
    isImage(): boolean;
    isSoundOrMusic(): boolean;
    isUnknownAsset(): boolean;
    toml(callback: (content: CommonToml) => void): ClassicSourceFile;
    txt(callback: (content: string) => void): ClassicSourceFile;
    image(callback: (content: PathLike) => void): ClassicSourceFile;
    soundOrMusic(callback: (content: PathLike) => void): ClassicSourceFile;
    unknownAsset(callback: (content: PathLike) => void): ClassicSourceFile;
}
export declare class ClassicSource implements FileLike {
    filename: string;
    dirname: string;
    path: string;
    sourceFile: ClassicSourceFile;
    target: Optional<ClassicTarget>;
    private constructor();
    static toml(filename: string, dirname: string, path: string, content: CommonToml): ClassicSource;
    static txt(filename: string, dirname: string, path: string, content: string): ClassicSource;
    static pathLike(filename: string, dirname: string, path: string, content: PathLike): ClassicSource;
    isCommonToml(): boolean;
    isBuilt(): boolean;
    built(callback: (target: ClassicTarget) => void): ClassicSource;
    unbuilt(callback: () => void): ClassicSource;
}
export declare enum ClassicTargetFileType {
    INI = "INI",
    TXT = "TXT",
    ASSET = "ASSET"
}
export declare class CopyFromSource {
}
export declare class ClassicTargetFile {
    type: ClassicTargetFileType;
    content: StandardIni | string | CopyFromSource;
    private constructor();
    static ini(content: StandardIni): ClassicTargetFile;
    static txt(content: string): ClassicTargetFile;
    static asset(): ClassicTargetFile;
}
export declare class ClassicTarget implements FileLike {
    filename: string;
    dirname: string;
    source: ClassicSource;
    targetFile: ClassicTargetFile;
    constructor(filename: string, dirname: string, source: ClassicSource, targetFile: ClassicTargetFile);
    isStandardIni(): boolean;
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
    requireSync(path: string, starterPath?: string): Result<{
        source: ClassicSource;
        target: ClassicTarget;
    }, Error>;
    buildSync(path: string, starterPath?: string): Result<ClassicTarget, Error>;
    buildAllSync(): Result<ClassicTarget[], Error>;
}
