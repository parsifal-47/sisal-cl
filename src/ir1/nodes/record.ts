import * as AST from "../../ast/composite";
import { Port } from "../ports/port";
import { Scope } from "../scopes/scope";
import * as Types from "../types/";
import { Node } from "./node";
import { FunctionScope } from "../scopes/function";

export class RecordValue extends Node {
  constructor(record: AST.RecordValue, scope: Scope, fs: FunctionScope) {
    super("Record");
    const elements: Array<[string, Types.Type]> = [];
    for (const definition of record.contents) {
      if (definition.left.length != definition.right.length) {
        throw new Error("Invalid record initialization, non-equal arity");
      }
      for (let i = 0; i < definition.left.length; i++) {
        this.createAndLink(definition.right[i], scope, fs);
        const lastPort = this.inPorts[this.inPorts.length - 1];
        elements.push([definition.left[i], lastPort.type]);
      }
    }
    const t = Types.RecordType.createByElements(elements);
    this.outPorts.push(new Port(this.id, t));
    scope.addNode(this);
  }
}
