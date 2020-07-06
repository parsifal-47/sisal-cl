import { Port } from "../ports/port";
import { FunctionScope } from "../scopes/function";
import { Scope } from "../scopes/scope";
import * as Types from "../types/";
import { Node } from "./node";

export class TypeCast extends Node {
  constructor(input:Types.Type, output:Types.Type, scope: Scope, fs: FunctionScope) {
    super("TypeCast");
    this.inPorts.push(new Port(this.id, input));
    this.outPorts.push(new Port(this.id, output));
    scope.addNode(this);
  }

  public graphML(): string {
    return this.graphMLInternal("", new Map([]));
  }
}
