// import { hello } from "../src";
import { expect } from "chai";
import { describe, it } from "mocha";
import toml from "toml";

import { Toml } from "../src";

import fs from 'fs';
import path from 'path';

describe('toml', () => {
    it('parses toml as object', () => {
        expect(typeof (toml.parse(fs.readFileSync(path.join(__dirname, './samples/tank.toml')).toString()))).to.equal('object');
    });
});

describe('Toml', () => {
    it('parse object as Toml', () => {
        expect(new Toml(toml.parse(fs.readFileSync(path.join(__dirname, './samples/tank.toml')).toString()))).to.instanceOf(Toml);
    });
    it('throws when parsing wrong object', () => {
        expect(() => {new Toml(toml.parse(fs.readFileSync(path.join(__dirname, './samples/tank_mistake1.toml')).toString()))}).to.throw('not allowed object in single-section');
    });
});
