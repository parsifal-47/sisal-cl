import * as ASTTypes from "../../ast/types";
import { typeFromAST } from "../create";
import { Type } from "./type";

export class StreamType extends Type {

  public static createByElement(element: Type): StreamType {
    const t = new StreamType();
    t.element = element;
    return t;
  }
  private element: Type;

  constructor(definition?: ASTTypes.StreamType) {
    super(definition);
    if (!definition) {
      this.element = new Type();
      return;
    }
    this.element = typeFromAST(definition.elementType);
  }

  public string(): string {
    return "stream[ " + this.element.string() + " ]";
  }
}
