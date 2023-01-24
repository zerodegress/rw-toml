"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassicSyncBuilder = exports.ClassicTarget = exports.ClassicSource = exports.ClassicSourceFile = exports.ClassicSourceFileType = exports.PathLike = void 0;
const optional_1 = require("../optional");
const path_browserify_1 = __importDefault(require("path-browserify"));
const result_1 = require("../result");
class PathLike {
    path;
    constructor(path) {
        this.path = path;
    }
}
exports.PathLike = PathLike;
var ClassicSourceFileType;
(function (ClassicSourceFileType) {
    ClassicSourceFileType[ClassicSourceFileType["TOML"] = 0] = "TOML";
    ClassicSourceFileType[ClassicSourceFileType["TXT"] = 1] = "TXT";
    ClassicSourceFileType[ClassicSourceFileType["PNG"] = 2] = "PNG";
    ClassicSourceFileType[ClassicSourceFileType["OGG"] = 3] = "OGG";
    ClassicSourceFileType[ClassicSourceFileType["WAV"] = 4] = "WAV";
    ClassicSourceFileType[ClassicSourceFileType["MP3"] = 5] = "MP3";
    ClassicSourceFileType[ClassicSourceFileType["UNKNOWN_ASSET"] = 6] = "UNKNOWN_ASSET";
})(ClassicSourceFileType = exports.ClassicSourceFileType || (exports.ClassicSourceFileType = {}));
class ClassicSourceFile {
    type;
    content;
    constructor(type, content) {
        this.type = type;
        this.content = content;
    }
    static toml(content) {
        return new ClassicSourceFile(ClassicSourceFileType.TOML, content);
    }
    static txt(content) {
        return new ClassicSourceFile(ClassicSourceFileType.TXT, content);
    }
    static asset(content) {
        return new ClassicSourceFile((() => {
            if (path_browserify_1.default.extname(content.path) == '.png') {
                return ClassicSourceFileType.PNG;
            }
            else if (path_browserify_1.default.extname(content.path) == '.ogg') {
                return ClassicSourceFileType.OGG;
            }
            else if (path_browserify_1.default.extname(content.path) == '.mp3') {
                return ClassicSourceFileType.MP3;
            }
            else if (path_browserify_1.default.extname(content.path) == '.wav') {
                return ClassicSourceFileType.WAV;
            }
            else {
                return ClassicSourceFileType.UNKNOWN_ASSET;
            }
        })(), content);
    }
    isToml() {
        return this.type == ClassicSourceFileType.TOML;
    }
    isTxt() {
        return this.type == ClassicSourceFileType.TXT;
    }
    toml(callback) {
        if (this.isToml() && typeof this.content == 'object') {
            callback(this.content);
        }
    }
}
exports.ClassicSourceFile = ClassicSourceFile;
class ClassicSource {
    filename;
    dirname;
    path;
    sourceFile;
    target;
    constructor(filename, dirname, path, content) {
        this.filename = filename;
        this.dirname = dirname;
        this.path = path;
        this.target = (0, optional_1.none)();
        if (content instanceof PathLike) {
            this.sourceFile = ClassicSourceFile.asset(content);
        }
        else if (typeof content == 'object') {
            this.sourceFile = ClassicSourceFile.toml(content);
        }
        else {
            this.sourceFile = ClassicSourceFile.txt(content);
        }
    }
    static toml(filename, dirname, path, content) {
        return new ClassicSource(filename, dirname, path, content);
    }
    static txt(filename, dirname, path, content) {
        return new ClassicSource(filename, dirname, path, content);
    }
    static pathLike(filename, dirname, path, content) {
        return new ClassicSource(filename, dirname, path, content);
    }
    isToml() {
        return this.sourceFile.isToml();
    }
    isBuilt() {
        return this.target != undefined;
    }
    built(callback) {
        this.target.some((value) => callback(value));
        return this;
    }
    unbuilt(callback) {
        this.target.none(() => callback());
        return this;
    }
}
exports.ClassicSource = ClassicSource;
class ClassicTarget {
    filename;
    dirname;
    source;
    constructor(filename, dirname, source) {
        this.filename = filename;
        this.dirname = dirname;
        this.source = source;
    }
    isIni() {
        return path_browserify_1.default.extname(this.filename) == '.ini';
    }
}
exports.ClassicTarget = ClassicTarget;
class ClassicSyncBuilder {
    context;
    constructor(rootDir, srcDir, distDir, sources) {
        this.context = {
            rootDir: rootDir,
            srcDir: srcDir,
            distDir: distDir,
            sources: sources,
            targets: []
        };
    }
    require(path) {
        return new Promise((resolve, reject) => {
            this.requireSync(path).ok((value) => resolve(value)).err((value) => reject(value));
        });
    }
    build(path) {
        return new Promise((resolve, reject) => {
            this.buildSync(path).ok((value) => resolve(value)).err((value) => reject(value));
        });
    }
    buildAll() {
        return new Promise((resolve, reject) => {
            this.buildAllSync().ok((value) => resolve(value)).err((value) => reject(value));
        });
    }
    requireSync(path) {
        let { source, target } = { source: (0, optional_1.none)(), target: (0, optional_1.none)() };
        let error = (0, optional_1.none)();
        (0, optional_1.optional)(this.context.sources.find((value) => value.path == path)).some((value) => {
            source = (0, optional_1.some)(value);
            value.built((value) => target = (0, optional_1.some)(value)).unbuilt(() => {
                this.buildSync(path).ok((result) => target = (0, optional_1.some)(result)).err((result) => error = (0, optional_1.some)(result));
            });
        }).none(() => error = (0, optional_1.some)(new Error('requirement does not exists')));
        if (error.isSome()) {
            return (0, result_1.err)(error.unwrap());
        }
        else {
            return (0, result_1.ok)({ source: source.unwrap(), target: target.unwrap() });
        }
    }
    buildSync(path) {
        let target = (0, optional_1.none)();
        let error = (0, optional_1.none)();
        (0, optional_1.optional)(this.context.sources.find((value) => value.path == path)).some((source) => {
            source.built((value) => target = (0, optional_1.some)(value)).unbuilt(() => {
            });
        }).none(() => error = (0, optional_1.some)(new Error('source does not exists')));
        if (error.isSome()) {
            return (0, result_1.err)(error.unwrap());
        }
        else {
            return (0, result_1.ok)(target.unwrap());
        }
    }
    buildAllSync() {
        let error = (0, optional_1.none)();
        for (const source of this.context.sources) {
            const result = this.buildSync(source.path).err((result) => error = (0, optional_1.some)(result));
            if (result.isErr()) {
                return (0, result_1.err)(error.unwrap());
            }
        }
        return (0, result_1.ok)(this.context.targets);
    }
}
exports.ClassicSyncBuilder = ClassicSyncBuilder;
