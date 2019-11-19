import * as AST from "../../ast";
import { Scope } from "../scopes/scope";
import * as Types from "../types/";
import { Node } from "./node";
import { Port } from "../ports/port";
import { FunctionScope } from "../scopes/function";

export class Scatter extends Node {
  constructor(sources: AST.Expression[], scope: Scope, fs: FunctionScope) {
    super("Scatter");
    for (const s of sources) {
      this.createAndLink(s, scope, fs);
    }

    const type = this.inPorts[0].type;
    this.outPorts.push(new Port(this.id, type));
    scope.addNode(this);
  }
}
