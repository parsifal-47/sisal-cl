import { Module } from "../src/module";
import { Parser } from "../src/parser";
import { expect } from "chai";
import "mocha";
import * as fs from "fs";

const testPath = "test/programs/";

describe("All tests", () => {
  const parser = new Parser();

  it("Should not crash", () => {
    const m = new Module(parser.parse(fs.readFileSync(testPath + "smoke.sis", "utf8")));
    expect(m.graphML()).to.be.a("string");
  });

  const folder = fs.readdirSync(testPath);
  for (const fileName of folder) {
    if (fs.lstatSync(testPath + fileName).isDirectory()) {
      continue;
    }
    it("Check " + fileName, () => {
      const m = new Module(parser.parse(fs.readFileSync(testPath + fileName, "utf8")));
      expect(m.graphML()).to.be.a("string");
    });
  }
});
