"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassicBuilderSync = exports.ClassicTarget = exports.ClassicTargetFile = exports.CopyFromSource = exports.ClassicTargetFileType = exports.ClassicSource = exports.ClassicSourceFile = exports.ClassicSourceFileType = exports.PathLike = exports.normalize = void 0;
const optional_1 = require("../optional");
const path_browserify_1 = __importDefault(require("path-browserify"));
const normalize_path_1 = __importDefault(require("normalize-path"));
const result_1 = require("../result");
const config_1 = require("../config");
function normalize(pat) {
    return (0, normalize_path_1.default)(path_browserify_1.default.normalize(pat));
}
exports.normalize = normalize;
class PathLike {
    constructor(path) {
        this.path = path;
    }
}
exports.PathLike = PathLike;
var ClassicSourceFileType;
(function (ClassicSourceFileType) {
    ClassicSourceFileType["TOML"] = "TOML";
    ClassicSourceFileType["TXT"] = "TXT";
    ClassicSourceFileType["PNG"] = "PNG";
    ClassicSourceFileType["JPEG"] = "JPEG";
    ClassicSourceFileType["OGG"] = "OGG";
    ClassicSourceFileType["WAV"] = "WAV";
    ClassicSourceFileType["MP3"] = "MP3";
    ClassicSourceFileType["UNKNOWN_ASSET"] = "UNKNOWN_ASSET";
})(ClassicSourceFileType = exports.ClassicSourceFileType || (exports.ClassicSourceFileType = {}));
class ClassicSourceFile {
    constructor(type, content) {
        this.type = type;
        if (content instanceof PathLike) {
            content.path = normalize(content.path);
        }
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
        return this.type == ClassicSourceFileType.PNG || this.type == ClassicSourceFileType.JPEG;
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
    image(callback) {
        if (this.isImage()) {
            if (this.content instanceof PathLike) {
                callback(this.content);
            }
            else {
                throw new Error('internal error');
            }
        }
        return this;
    }
    soundOrMusic(callback) {
        if (this.isSoundOrMusic()) {
            if (this.content instanceof PathLike) {
                callback(this.content);
            }
            else {
                throw new Error('internal error');
            }
        }
        return this;
    }
    unknownAsset(callback) {
        if (this.isUnknownAsset()) {
            if (this.content instanceof PathLike) {
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
        this.dirname = normalize(dirname);
        this.path = normalize(path);
        this.target = (0, optional_1.none)();
        if (content instanceof PathLike) {
            content.path = normalize(content.path);
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
        this.dirname = normalize(dirname);
        source.dirname = normalize(source.dirname);
        source.path = normalize(source.path);
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
                    this.buildSync(path, starterPath).ok((target) => { throw (0, result_1.ok)({ source, target }); }).err((error) => { throw (0, result_1.err)(error); });
                });
            }).none(() => { throw (0, result_1.err)(new Error(`requirement "${path}" does not exists`)); });
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
                                                let outputValue = value.toString();
                                                if (secMain == 'core' && key == 'copyFrom') {
                                                    let requirePath = normalize(value.toString().trim());
                                                    if (requirePath.startsWith('/')) {
                                                        requirePath = requirePath.replace(/^\//, '');
                                                        outputValue = 'ROOT:' + requirePath;
                                                    }
                                                    else {
                                                        requirePath = normalize(path_browserify_1.default.join(source.dirname, requirePath));
                                                        outputValue = requirePath;
                                                    }
                                                    this.requireSync(requirePath, starterPath != undefined ? starterPath : source.path).err((error) => { throw (0, result_1.err)(error); });
                                                }
                                                return outputValue.replace(/\.toml$/, '.ini');
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
                    const target = new ClassicTarget(source.filename.replace(/\.toml$/, '.ini'), source.dirname, source, ClassicTargetFile.ini(ini));
                    source.target = (0, optional_1.some)(target);
                    this.context.targets.push(target);
                    throw (0, result_1.ok)(target);
                }).txt((content) => {
                    const target = new ClassicTarget(source.filename, source.dirname, source, ClassicTargetFile.txt(content));
                    source.target = (0, optional_1.some)(target);
                    this.context.targets.push(target);
                    throw (0, result_1.ok)(target);
                }).image((content) => {
                    const target = new ClassicTarget(source.filename, source.dirname, source, ClassicTargetFile.asset());
                    this.context.targets.push(target);
                    throw (0, result_1.ok)(target);
                }).soundOrMusic((content) => {
                    const target = new ClassicTarget(source.filename, source.dirname, source, ClassicTargetFile.asset());
                    this.context.targets.push(target);
                    throw (0, result_1.ok)(target);
                }).unknownAsset((content) => {
                    const target = new ClassicTarget(source.filename, source.dirname, source, ClassicTargetFile.asset());
                    this.context.targets.push(target);
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
