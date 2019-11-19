import * as ASTTypes from "../../ast/types";
import { Type } from "./type";
import { typeFromAST } from "../create";

export class StreamType extends Type {
  private element: Type;

  constructor(definition?: ASTTypes.StreamType) {
    super(definition);
    if (!definition) {
      this.element = new Type();
      return;
    }
    this.element = typeFromAST(definition.elementType);
  }

  public static createByElement(element: Type): StreamType {
    const t = new StreamType();
    t.element = element;
    return t;
  }

  public string(): string {
    return "stream[ " + this.element.string() + " ]";
  }
}
