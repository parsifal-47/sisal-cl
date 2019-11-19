import * as AST from "../../ast";
import { ComplexNode } from "./complex";
import { Type } from "../types/type";
import { Port } from "../ports/port";
import { getOutPorts } from "../create";
import { FunctionScope } from "../scopes/function";

export class Body extends ComplexNode {
  constructor(name: string, expressions: AST.Expression[], inputs: Array<[string, Type]>, fs: FunctionScope) {
    super(name);
    this.cloneParams(inputs);
    for (const expression of expressions) {
      const ports = getOutPorts(expression, this, fs);
      for (const p of ports) {
        const outPort = new Port(this.id, p.type);
        this.outPorts.push(outPort);
        this.addEdge([p, outPort]);
      }
    }
  }
}
