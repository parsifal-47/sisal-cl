import * as AST from "../../ast";
import { ComplexNode } from "./complex";
import * as Types from "../types/";
import { Port } from "../ports/port";
import { Reduction } from "./reduction";
import { getOutPorts } from "../create";
import { FunctionScope } from "../scopes/function";

export class Returns extends ComplexNode {
  constructor(reduction: string, expressions: AST.Expression[], inputs: Array<[string, Types.Type]>, fs: FunctionScope) {
    super("Returns");

    this.cloneParams(inputs);
    for (const expression of expressions) {
      const ports = getOutPorts(expression, this, fs);
      for (const p of ports) {
        const r = new Reduction(reduction, p.type, this);
        const outPort = new Port(this.id, r.outPorts[0].type);

        this.outPorts.push(outPort);

        this.addEdge([p, r.inPorts[0]]);
        this.addEdge([r.outPorts[0], outPort]);
      }
    }
  }
}
