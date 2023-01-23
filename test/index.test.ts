// import { hello } from "../src";
import { expect } from "chai";
import { describe, it } from "mocha";
import toml from "toml";

import fs from 'fs';
import path from 'path';

describe('toml', () => {
    it('parses toml', () => {
        expect(typeof (toml.parse(fs.readFileSync(path.join(__dirname, './samples/tank.toml')).toString()))).to.equal('object');
    });
});
