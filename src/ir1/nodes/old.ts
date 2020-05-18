import * as AST from "../../ast";
import { getOutPorts } from "../create";
import { Port } from "../ports/port";
import { FunctionScope } from "../scopes/function";
import { Scope } from "../scopes/scope";
import { Node } from "./node";

export class OldValue extends Node {
  public constructor(definition: AST.OldValue, scope: Scope, fs: FunctionScope) {
    super("OldValue", definition);
    const ports = getOutPorts(definition.id, scope, fs);
    if (ports.length != 1) {
      throw new Error("Old value must be applied to identifier");
    }
    const type = ports[0].type;
    const inPort = new Port(this.id, type);
    this.inPorts.push(inPort);
    scope.addEdge([ports[0], inPort]);
    this.outPorts.push(new Port(this.id, type));
    scope.addNode(this);
  }
}
