import * as fs from "fs";
import * as PEG from "pegjs";
import * as AST from "./ast";

export class Parser {
  private parser: PEG.Parser;
  public constructor() {
    const grammar = fs.readFileSync("src/grammar/sisal.pegjs", "utf8");
    this.parser = PEG.generate(grammar);
  }
  public parse(program: string): AST.FunctionValue[] {
    return this.parser.parse(program);
  }
}
