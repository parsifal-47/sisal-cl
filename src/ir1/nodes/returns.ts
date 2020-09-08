import * as AST from "../../ast";
import { getOutPorts } from "../create";
import { Port } from "../ports/port";
import { FunctionScope } from "../scopes/function";
import * as Types from "../types/";
import { ComplexNode } from "./complex";
import { Reduction } from "./reduction";

export class Returns extends ComplexNode {
  constructor(retExpressions: Array<[string, AST.Expression]>, inputs: Array<[string, Types.Type]>, fs: FunctionScope) {
    super("Returns");

    this.cloneParams(inputs);
    for (const [name, expression] of retExpressions) {
      const ports = getOutPorts(expression, this, fs);
      for (const p of ports) {
        const r = new Reduction(name, p.type, this);
        const outPort = new Port(this.id, r.outPorts[0].type);

        this.outPorts.push(outPort);

        this.addEdge([p, r.inPorts[0]]);
        this.addEdge([r.outPorts[0], outPort]);
      }
    }
  }
}
