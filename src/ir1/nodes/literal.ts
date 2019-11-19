import * as AST from "../../ast";
import * as Types from "../types/";
import { Node } from "./node";
import { Scope } from "../scopes/scope";
import { Port } from "../ports/port";

export class Literal extends Node {
  public value: string;

  constructor(definition: AST.Literal, scope: Scope) {
    super("Literal", definition);
    let t: Types.Type;

    if (AST.isBooleanLiteral(definition)) {
      this.value = String(definition.value);
      t = Types.PrimitiveType.createByName("boolean");
    } else if (AST.isIntegerLiteral(definition)) {
      this.value = String(definition.value);
      t = Types.PrimitiveType.createByName("integer");
    } else if (AST.isFloatLiteral(definition)) {
      this.value = String(definition.value);
      t = Types.PrimitiveType.createByName("real");
    } else if (AST.isStringLiteral(definition)) {
      this.value = definition.value;
      t = Types.PrimitiveType.createByName("string");
    } else {
      throw new Error("Unexpected literal type " + JSON.stringify(definition));
    }
    scope.addNode(this);
    this.outPorts.push(new Port(this.id, t));
  }
}
