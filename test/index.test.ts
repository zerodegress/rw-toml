// import { hello } from "../src";
import { expect } from "chai";
import { describe, it } from "mocha";
import toml from "toml";

import { implCommonToml, ClassicBuilderSync, ClassicSource, ClassicTargetFileType, implStandardIni, ClassicPostTranslator, CommonToml, commonTomlEveryKey, none, some } from "../src";

import fs from 'fs';
import path from 'path';

const myTomlCorrect = toml.parse(fs.readFileSync(path.join(__dirname, './samples/tank.toml')).toString());
const myTomlMistake1 = toml.parse(fs.readFileSync(path.join(__dirname, './samples/tank_mistake1.toml')).toString());
const myTomlMistake2 = toml.parse(fs.readFileSync(path.join(__dirname, './samples/tank_mistake2.toml')).toString());
const myTomlMistake3 = toml.parse(fs.readFileSync(path.join(__dirname, './samples/tank_mistake3.toml')).toString());

describe('toml', () => {
    it('parses toml as object', () => {
        expect(typeof (myTomlCorrect)).to.equal('object');
    });
});

describe('implCommonToml()', () => {
    it('identifies the correct CommonToml', () => {
        expect(implCommonToml(myTomlCorrect)).to.equal(true);
    });
    it('identifies the wrong CommonToml', () => {
        expect(implCommonToml(myTomlMistake1)).to.equal(false);
        expect(implCommonToml(myTomlMistake2)).to.equal(false);
        expect(implCommonToml(myTomlMistake3)).to.equal(false);
    })
});

describe('ClassicBuilderSync', () => {
    it('build toml file', () => {
        const result = new ClassicBuilderSync('.', 'src', 'dist', [ClassicSource.toml('abc.toml', 'abc', 'abc/abc.toml', { 'core': { 'name': 'az', 'defineUnitMemory': ['string az', 'string ok'] }, 'projectile': {'1': {'x': 0}}})]).buildSync('abc/abc.toml');
        expect(result.isOk()).of.equal(true);
        const target = result.unwrap();
        expect(target.filename).to.equal('abc.ini');
        expect(target.dirname).to.equal('abc');
        expect(target.targetFile.type).to.equal(ClassicTargetFileType.INI);
        expect(implStandardIni(target.targetFile.content)).to.equal(true);
        expect((() => {
            if(implStandardIni(target.targetFile.content)) {
                return target.targetFile.content['core'] != undefined;
            }
        })()).to.equal(true);
        expect((() => {
            if(implStandardIni(target.targetFile.content)) {
                if(target.targetFile.content['core'] != undefined) {
                    return target.targetFile.content['core']['name'];
                }
            }
        })()).to.equal('az');
        expect((() => {
            if(implStandardIni(target.targetFile.content)) {
                if(target.targetFile.content['core'] != undefined) {
                    return target.targetFile.content['core']['defineUnitMemory'];
                }
            }
        })()).to.equal('string az,string ok');
        expect((() => {
            if(implStandardIni(target.targetFile.content)) {
                return target.targetFile.content['projectile_1'] != undefined;
            }
        })()).to.equal(true);
        expect((() => {
            if(implStandardIni(target.targetFile.content)) {
                return target.targetFile.content['projectile_1']['x'];
            }
        })()).to.equal('0');
    });
    it('requires and puts the target', () => {
        const builder = new ClassicBuilderSync('.', 'src', 'dist', [ClassicSource.toml('abc.toml', 'abc', 'abc/abc.toml', { 'core': { 'name': 'az', 'defineUnitMemory': ['string az', 'string ok'] }, 'projectile': {'1': {'x': 0}}})]);
        expect(builder.requireSync('abc/abc.toml').isOk()).to.equal(true);
        expect(builder.context.targets.find((target) => target.source.path == 'abc/abc.toml') != undefined).to.equal(true);

    });
    it('requires the correct file path', () => {
        const builder = new ClassicBuilderSync('.', 'src', 'dist', [ClassicSource.toml('abc.toml', 'abc', 'abc/abc.toml', { 'core': { 'name': 'az', 'defineUnitMemory': ['string az', 'string ok'] }, 'projectile': {'1': {'x': 0}}})]);
        expect(builder.requireSync('abc/abc.toml').isOk()).to.equal(true);
        expect(builder.requireSync('abc/abc.toml').unwrap().source.path).to.equal('abc/abc.toml');
    });
    it('requires when need', () => {
        const builder = new ClassicBuilderSync('.', 'src', 'dist', [ClassicSource.toml('abc.toml', 'abc', 'abc/abc.toml', { 'core': { 'name': 'az', 'copyFrom': '/requires/require.toml', 'defineUnitMemory': ['string az', 'string ok'] }, 'projectile': {'1': {'x': 0}}}), ClassicSource.toml('require.toml', 'requires', 'requires/require.toml', { 'core': { 'displayName': 'require' }})]);
        expect(builder.buildSync('abc/abc.toml').isOk()).to.equal(true);
        expect(builder.context.targets.find((target) => target.source.path == 'requires/require.toml') != undefined).to.equal(true);
    });
});

describe('ClassicPostTranslator', () => {
    it('translates sources', () => {
        const trans = new ClassicPostTranslator('.', 'src', 'dist', [
            ClassicSource.toml('abc.toml', 'abc', 'abc/abc/toml', {
                'core': {
                    'name': 'abc',
                    'meme': 'def'
                }
            })
        ], [
            (source) => {
                let src = none<ClassicSource>();
                source.sourceFile.toml((toml) => {
                    src = some(ClassicSource.toml(source.filename, source.dirname, source.path, (() => {
                        let obj: CommonToml = {};
                        const gen = commonTomlEveryKey(toml);
                        while(true) {
                            const {value: v, done} = gen.next();
                            if(!done) {
                                v.some(({secMain, secSub, key, value}) => {
                                    secSub.some((secSub) => {
                                        if(!obj[secMain]) {
                                            obj[secMain] = {};
                                        }
                                        if(!obj[secMain][secSub]) {
                                            obj[secMain][secSub] = {};
                                        }
                                        obj[secMain][secSub][key] = `POST${value}`;
                                    }).none(() => {
                                        if(!obj[secMain]) {
                                            obj[secMain] = {};
                                        }
                                        obj[secMain][key] = `POST${value}`;
                                    });
                                });
                            } else {
                                break;
                            }
                        }
                        return obj;
                    })()));
                });
                return src.unwrap();
            }
        ]);
        const result = trans.buildAll();
        expect(result.isOk()).to.equal(true);
        result.unwrap()[0].sourceFile.toml((toml) => expect(toml['core']['name'].toString().startsWith('POST')).to.equal(true));
        result.unwrap()[0].sourceFile.toml((toml) => expect(toml['core']['meme'].toString().startsWith('POST')).to.equal(true));
    });
});