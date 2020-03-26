import * as AST from "../../ast";
import { ComplexNode } from "./complex";
import { Port } from "../ports/port";
import { Type } from "../types/type";
import { getOutPorts } from "../create";
import { FunctionScope } from "../scopes/function";

export class Init extends ComplexNode {
  public results: Array<[string, Port]>;
  constructor(name: string, definitions: AST.Definition[], params: Array<[string, Type]>, fs: FunctionScope) {
    super(name);
    this.cloneParams(params);
    this.results = [];
    for (const d of definitions) {
      let ports: Port[] = [];
      for (let i = 0; i < d.right.length; i++) {
        const p = getOutPorts(d.right[i], this, fs);
        ports = ports.concat(p);
      }
      if (d.left.length != ports.length) {
        throw new Error("Definition arity has to match");
      }
      for (let i = 0; i < d.left.length; i++) {
        const outPort = new Port(this.id, ports[i].type);
        this.outPorts.push(outPort);
        this.results.push([d.left[i], outPort]);
        this.addEdge([ports[i], outPort]);
      }
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
