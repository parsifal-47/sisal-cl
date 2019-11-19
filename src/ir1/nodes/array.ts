import * as AST from "../../ast/composite";
import { Scope } from "../scopes/scope";
import * as Types from "../types/";
import { Node } from "./node";
import { Port } from "../ports/port";
import { FunctionScope } from "../scopes/function";

export class ArrayValue extends Node {

  constructor(definition: AST.ArrayValue, scope: Scope, fs: FunctionScope) {
    super("Array", definition);
    for (const expression of definition.contents) {
      this.createAndLink(expression, scope, fs);
    }
    let element = new Types.Type();
    if (this.inPorts.length > 0) {
      element = this.inPorts[0].type;
    }
    for (const p of this.inPorts) {
      if (p.type != element) {
        throw new Error("Array elements must be uniformly typed");
      }
    }
    const t = Types.ArrayType.createByElement(element);
    this.outPorts.push(new Port(this.id, t));
    scope.addNode(this);
  }
}
