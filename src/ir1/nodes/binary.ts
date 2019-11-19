import * as AST from "../../ast";
import { Scope } from "../scopes/scope";
import * as Types from "../types/";
import { Node } from "./node";
import { Port } from "../ports/port";
import { FunctionScope } from "../scopes/function";

export class BinaryExpression extends Node {
  public operator: string;

  constructor(definition: AST.BinaryExpression, scope: Scope, fs: FunctionScope) {
    let type: Types.Type;
    super("Binary", definition);
    this.operator = definition.operator;
    this.createAndLink(definition.left, scope, fs);
    this.createAndLink(definition.right, scope, fs);

    if ([">", "<", ">=", "<=", "=", "!="].indexOf(this.operator) === -1) {
      type = this.inPorts[0].type;
    } else {
      type = Types.PrimitiveType.createByName("boolean");
    }
    this.outPorts.push(new Port(this.id, type));
    scope.addNode(this);
  }

  public graphML(): string {
    return this.graphMLInternal("", new Map([["operator", this.operator]]));
  }
}
