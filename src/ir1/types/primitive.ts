import * as ASTTypes from "../../ast/types";
import { Type } from "./type";

export class PrimitiveType extends Type {
  public name: string;

  constructor(definition?: ASTTypes.PrimitiveType) {
    super(definition);

    if (!definition) {
      this.name = "";
      return;
    }

    if (ASTTypes.isBooleanType(definition)) {
      this.name = "boolean";
    } else if (ASTTypes.isIntegerType(definition)) {
      this.name = "integer";
    } else if (ASTTypes.isFloatType(definition)) {
      this.name = "real";
    } else if (ASTTypes.isStringType(definition)) {
      this.name = "string";
    } else {
      throw new Error("Unexpected primitive type " + JSON.stringify(definition));
    }
  }

  public static createByName(name: string): PrimitiveType {
    if (["boolean", "integer", "real", "string"].indexOf(name) === -1) {
      throw new Error("Unexpected primitive type " + name);
    }

    const t = new PrimitiveType();
    t.name = name;
    return t;
  }

  public string(): string {
    return this.name;
  }
}
