import * as ASTTypes from "../../ast/types";
import { Type } from "./type";
import { typeFromAST } from "../create";

export class ArrayType extends Type {
  public element: Type;

  constructor(definition?: ASTTypes.ArrayType) {
    super(definition);
    if (!definition) {
      this.element = new Type();
      return;
    }
    this.element = typeFromAST(definition.elementType);
  }

  public static createByElement(element: Type): ArrayType {
    const t = new ArrayType();
    t.element = element;
    return t;
  }

  public string(): string {
    return "array of " + this.element.string();
  }
}
