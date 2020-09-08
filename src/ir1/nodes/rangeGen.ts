import * as AST from "../../ast";
import { Port } from "../ports/port";
import { FunctionScope } from "../scopes/function";
import { Scope } from "../scopes/scope";
import { Type } from "../types/type";
import { ComplexNode } from "./complex";
import { Scatter } from "./scatter";
import { Range } from "./range";

export class RangeGen extends ComplexNode {
  public results: Array<[string, Port]>;
  constructor(definition: AST.RangeList, scope: Scope, fs: FunctionScope) {
    super("RangeGen");
    this.cloneParamsFromScope(scope);
    this.results = [];
    for (let i = 0; i < definition.names.length; i++) {
      const range = new Range(definition.ranges, this, fs);
      if (range.outPorts.length != 1) {
        throw new Error("Range must have one resulting port");
      }
      const scatter = new Scatter(range.inPorts[0].type, this, fs);
      this.addEdge([range.outPorts[0], scatter.inPorts[0]]);

      const outPort = new Port(this.id, scatter.outPorts[0].type);
      this.addEdge([scatter.outPorts[0], outPort]);
      this.outPorts.push(outPort);
      this.results.push([definition.names[i], outPort]);
    }
  }

  public getResults(): Array<[string, Type]> {
    const result: Array<[string, Type]> = [];
    for (const [name, p] of this.results) {
      result.push([name, p.type]);
    }
    return result;
  }
}
