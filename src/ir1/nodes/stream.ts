import * as AST from "../../ast/composite";
import { Scope } from "../scopes/scope";
import { typeFromAST } from "../create";
import * as Types from "../types/";
import { Node } from "./node";
import { Port } from "../ports/port";
import { FunctionScope } from "../scopes/function";

export class StreamValue extends Node {
  constructor(definition: AST.StreamValue, scope: Scope, fs: FunctionScope) {
    super("StreamValue", definition);
    for (const expression of definition.contents) {
      this.createAndLink(expression, scope, fs);
    }
    let element = typeFromAST(definition.elementType);

    for (const p of this.inPorts) {
      if (p.type != element) {
        throw new Error("Stream elements must be uniformly typed");
      }
    }
    const t = Types.StreamType.createByElement(element);
    this.outPorts.push(new Port(this.id, t));
    scope.addNode(this);
  }
}
