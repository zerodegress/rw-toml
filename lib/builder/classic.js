"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassicBuilderSync = exports.ClassicTarget = exports.ClassicTargetFile = exports.CopyFromSource = exports.ClassicTargetFileType = exports.ClassicSource = exports.ClassicSourceFile = exports.ClassicSourceFileType = exports.PathLike = void 0;
const optional_1 = require("../optional");
const path_browserify_1 = __importDefault(require("path-browserify"));
const result_1 = require("../result");
const config_1 = require("../config");
class PathLike {
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
    ClassicSourceFileType[ClassicSourceFileType["JPEG"] = 3] = "JPEG";
    ClassicSourceFileType[ClassicSourceFileType["OGG"] = 4] = "OGG";
    ClassicSourceFileType[ClassicSourceFileType["WAV"] = 5] = "WAV";
    ClassicSourceFileType[ClassicSourceFileType["MP3"] = 6] = "MP3";
    ClassicSourceFileType[ClassicSourceFileType["UNKNOWN_ASSET"] = 7] = "UNKNOWN_ASSET";
})(ClassicSourceFileType = exports.ClassicSourceFileType || (exports.ClassicSourceFileType = {}));
class ClassicSourceFile {
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
            else if (path_browserify_1.default.extname(content.path) == '.jpg' || path_browserify_1.default.extname(content.path) == '.jpeg') {
                return ClassicSourceFileType.JPEG;
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
    isCommonToml() {
        return this.type == ClassicSourceFileType.TOML;
    }
    isTxt() {
        return this.type == ClassicSourceFileType.TXT;
    }
    isImage() {
        return this.type == ClassicSourceFileType.PNG;
    }
    isSoundOrMusic() {
        return this.type == ClassicSourceFileType.OGG || this.type == ClassicSourceFileType.MP3 || this.type == ClassicSourceFileType.WAV;
    }
    isUnknownAsset() {
        return this.type == ClassicSourceFileType.UNKNOWN_ASSET;
    }
    toml(callback) {
        if (this.isCommonToml()) {
            if ((0, config_1.implCommonToml)(this.content)) {
                callback(this.content);
            }
            else {
                throw new Error('internal error');
            }
        }
        return this;
    }
    txt(callback) {
        if (this.isTxt()) {
            if (typeof this.content == 'string') {
                callback(this.content);
            }
            else {
                throw new Error('internal error');
            }
        }
        return this;
    }
}
exports.ClassicSourceFile = ClassicSourceFile;
class ClassicSource {
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
    isCommonToml() {
        return this.sourceFile.isCommonToml();
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
var ClassicTargetFileType;
(function (ClassicTargetFileType) {
    ClassicTargetFileType["INI"] = "INI";
    ClassicTargetFileType["TXT"] = "TXT";
    ClassicTargetFileType["ASSET"] = "ASSET";
})(ClassicTargetFileType = exports.ClassicTargetFileType || (exports.ClassicTargetFileType = {}));
class CopyFromSource {
}
exports.CopyFromSource = CopyFromSource;
class ClassicTargetFile {
    constructor(type, content) {
        this.type = type;
        this.content = content;
    }
    static ini(content) {
        return new ClassicTargetFile(ClassicTargetFileType.INI, content);
    }
    static txt(content) {
        return new ClassicTargetFile(ClassicTargetFileType.TXT, content);
    }
    static asset() {
        return new ClassicTargetFile(ClassicTargetFileType.ASSET, new CopyFromSource());
    }
}
exports.ClassicTargetFile = ClassicTargetFile;
class ClassicTarget {
    constructor(filename, dirname, source, targetFile) {
        this.filename = filename;
        this.dirname = dirname;
        this.source = source;
        this.targetFile = targetFile;
    }
    isStandardIni() {
        return path_browserify_1.default.extname(this.filename) == '.ini';
    }
}
exports.ClassicTarget = ClassicTarget;
class ClassicBuilderSync {
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
    requireSync(path, starterPath) {
        try {
            (0, optional_1.optional)(starterPath).some((starterPath) => {
                if (starterPath == path) {
                    throw (0, result_1.err)(new Error(`circle require ${starterPath} by ${path}`));
                }
            });
            (0, optional_1.optional)(this.context.sources.find((value) => value.path == path)).some((source) => {
                source.built((target) => { throw (0, result_1.ok)({ source, target }); }).unbuilt(() => {
                    this.buildSync(path).ok((target) => { throw (0, result_1.ok)({ source, target }); }).err((error) => { throw (0, result_1.err)(error); });
                });
            }).none(() => { throw (0, result_1.err)(new Error('requirement does not exists')); });
            throw new Error('unreachable!');
        }
        catch (result) {
            if (result instanceof (result_1.Result)) {
                return result;
            }
            else {
                throw result;
            }
        }
    }
    buildSync(path, starterPath) {
        try {
            (0, optional_1.optional)(this.context.sources.find((value) => value.path == path)).some((source) => {
                source.sourceFile.toml((toml) => {
                    let ini = {};
                    const gen = (0, config_1.commonTomlEveryKey)(toml);
                    while (true) {
                        const { value, done } = gen.next();
                        if (!done) {
                            value.some(({ secMain, secSub, key, value }) => {
                                secSub.some((secSub) => {
                                    (0, optional_1.optional)(ini[`${secMain}_${secSub}`]).none(() => {
                                        ini[`${secMain}_${secSub}`] = {};
                                    });
                                    (0, optional_1.optional)(ini[`${secMain}_${secSub}`]).some((section) => {
                                        section[key] = (() => {
                                            if (Array.isArray(value)) {
                                                return value.join();
                                            }
                                            else {
                                                return value.toString();
                                            }
                                        })();
                                    });
                                }).none(() => {
                                    (0, optional_1.optional)(ini[secMain]).none(() => {
                                        ini[secMain] = {};
                                    });
                                    (0, optional_1.optional)(ini[secMain]).some((section) => {
                                        section[key] = (() => {
                                            if (Array.isArray(value)) {
                                                return value.join();
                                            }
                                            else {
                                                return value.toString();
                                            }
                                        })();
                                    });
                                });
                            });
                        }
                        else {
                            break;
                        }
                    }
                    const target = new ClassicTarget(source.filename.replace('.toml', '.ini'), source.dirname, source, ClassicTargetFile.ini(ini));
                    source.target = (0, optional_1.some)(target);
                    throw (0, result_1.ok)(target);
                });
            }).none(() => { throw (0, result_1.err)(new Error('source does not exists')); });
            throw new Error('unreachable!');
        }
        catch (result) {
            if (result instanceof (result_1.Result)) {
                return result;
            }
            else {
                throw result;
            }
        }
    }
    buildAllSync() {
        let error = (0, optional_1.none)();
        try {
            for (const source of this.context.sources) {
                const result = this.buildSync(source.path).err((error) => { throw (0, result_1.err)(error); });
            }
            throw (0, result_1.ok)(this.context.targets);
        }
        catch (result) {
            if (result instanceof (result_1.Result)) {
                return result;
            }
            else {
                throw result;
            }
        }
    }
}
exports.ClassicBuilderSync = ClassicBuilderSync;
