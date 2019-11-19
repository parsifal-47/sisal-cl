import * as AST from "../../ast";
import { ComplexNode } from "./complex";
import { Type } from "../types/type";
import { Port } from "../ports/port";
import { getOutPorts } from "../create";
import { FunctionScope } from "../scopes/function";

export class Condition extends ComplexNode {
  constructor(name: string, expressions: AST.Expression[], inputs: Array<[string, Type]>, fs: FunctionScope) {
    super(name);
    this.cloneParams(inputs);
    for (const expression of expressions) {
      const ports = getOutPorts(expression, this, fs);
      if (ports.length != 1 || ports[0].type.string() != "boolean") {
        throw new Error("Each condition has to be boolean");
      }
      for (const p of ports) {
        const outPort = new Port(this.id, p.type);
        this.outPorts.push(outPort);
        this.addEdge([p, outPort]);
      }
    }
  }
}
