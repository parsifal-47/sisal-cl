import * as AST from "../../ast/composite";
import { typeFromAST } from "../create";
import { Port } from "../ports/port";
import { FunctionScope } from "../scopes/function";
import { Scope } from "../scopes/scope";
import * as Types from "../types/";
import { Node } from "./node";

export class StreamValue extends Node {
  constructor(definition: AST.StreamValue, scope: Scope, fs: FunctionScope) {
    super("StreamValue", definition);
    for (const expression of definition.contents) {
      this.createAndLink(expression, scope, fs);
    }
    const element = typeFromAST(definition.elementType);

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
