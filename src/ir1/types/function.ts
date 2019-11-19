import * as ASTTypes from "../../ast/types";
import { Type } from "./type";
import { typeFromAST } from "../create";

export class FunctionType extends Type {
  public params: Type[];
  public returns: Type[];

  constructor(definition?: ASTTypes.FunctionType) {
    super(definition);

    this.params = [];
    this.returns = [];

    if (!definition) return;

    for (const type of definition.params) {
      this.params.push(typeFromAST(type));
    }

    for (const type of definition.returns) {
      this.returns.push(typeFromAST(type));
    }
  }

  public static createByElements(params: Type[], returns: Type[]): FunctionType {
    const t = new FunctionType();
    t.params = params;
    t.returns = returns;
    return t;
  }

  public string(): string {
    return "function[" + this.params.map((x) => x.string()).join(", ") + "] " + 
    "returns [" + this.returns.map((x) => x.string()).join(", ") + "]";
  }
}
