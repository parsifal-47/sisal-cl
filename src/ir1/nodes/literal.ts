import * as AST from "../../ast";
import { Port } from "../ports/port";
import { Scope } from "../scopes/scope";
import * as Types from "../types/";
import { Node } from "./node";

export class Literal extends Node {
  public static createByTypeValue(typeName: string, value: string, scope: Scope): Literal {
    const t = new Literal(scope);
    t.value = value;
    t.outPorts.push(new Port(t.id, Types.PrimitiveType.createByName(typeName)));
    return t;
  }

  public value: string;

  constructor(scope: Scope, definition?: AST.Literal) {
    super("Literal", definition);
    let t: Types.Type;

    if (definition) {
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
      this.outPorts.push(new Port(this.id, t));
    } else {
      this.value = "";
    }

    scope.addNode(this);
  }

  public graphML(): string {
    return this.graphMLInternal("", new Map([["value", this.value]]));
  }
}
