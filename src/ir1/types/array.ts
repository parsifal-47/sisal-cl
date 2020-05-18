import * as ASTTypes from "../../ast/types";
import { typeFromAST } from "../create";
import { Type } from "./type";

export class ArrayType extends Type {

  public static createByElement(element: Type): ArrayType {
    const t = new ArrayType();
    t.element = element;
    return t;
  }
  public element: Type;

  constructor(definition?: ASTTypes.ArrayType) {
    super(definition);
    if (!definition) {
      this.element = new Type();
      return;
    }
    this.element = typeFromAST(definition.elementType);
  }

  public string(): string {
    return "array of " + this.element.string();
  }
}
