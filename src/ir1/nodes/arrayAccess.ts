import * as AST from "../../ast/expression";
import { Port } from "../ports/port";
import { Scope } from "../scopes/scope";
import * as Types from "../types/";
import { Node } from "./node";
import { FunctionScope } from "../scopes/function";

export class ArrayAccess extends Node {
  constructor(arraySource: Port, definition: AST.ArrayAccess, scope: Scope, fs: FunctionScope) {
    super("ArrayAccess", definition);
    const arrayType = arraySource.type;
    if (!(arrayType instanceof Types.ArrayType)) {
      throw new Error("Trying to random-access " + arraySource.type.string());
    }
    const inArray = new Port(this.id, arrayType);
    this.inPorts.push(inArray);
    scope.addEdge([arraySource, inArray]);
    this.createAndLink(definition.index, scope, fs);

    this.outPorts.push(new Port(this.id, arrayType.element));
    scope.addNode(this);
  }
}
