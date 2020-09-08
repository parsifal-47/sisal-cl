import * as AST from "../../ast";
import { Port } from "../ports/port";
import { FunctionScope } from "../scopes/function";
import { Scope } from "../scopes/scope";
import { Node } from "./node";
import { StreamType } from "../types/stream";

export class Range extends Node {
  constructor(sources: AST.Expression[], scope: Scope, fs: FunctionScope) {
    super("Range");
    for (const s of sources) {
      this.createAndLink(s, scope, fs);
    }

    const type = this.inPorts[0].type;
    this.outPorts.push(new Port(this.id, StreamType.createByElement(type)));
    scope.addNode(this);
  }
}
