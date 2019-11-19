import * as fs from "fs";
import { pd } from "pretty-data";
import { Parser } from "./parser";
import { Module } from "./module";

const args = process.argv;
let graph = false;

if (args.indexOf("--graph") !== -1) {
  args.splice(args.indexOf("--graph"), 1);
  graph = true;
}

if (args.length < 3) {
  process.stdout.write("Please specify Sisal program to convert.\n");
  process.exit(1);
}

const parser = new Parser();
const m = new Module(parser.parse(fs.readFileSync(args[2], "utf8")));

if (graph) {
  process.stdout.write(pd.xml(m.graphML()));
} else {
  process.stdout.write(JSON.stringify(m));
}
