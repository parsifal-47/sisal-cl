import * as AST from "../../ast";
import { typeFromAST } from "../create";
import { Port } from "../ports/port";
import { FunctionScope } from "../scopes/function";
import { FunctionType } from "../types";
import { Type } from "../types/type";
import { ComplexNode } from "./complex";

export class FunctionValue extends ComplexNode {
  public functionName?: string;
  constructor(definition: AST.FunctionValue, fs: FunctionScope) {
    super("Lambda", definition);
    this.functionName = definition.name;
    const params: Type[] = [];
    const returns: Type[] = [];

    for (const field of definition.params) {
      for (const name of field.names) {
        const t = typeFromAST(field.dataType);
        const p = new Port(this.id, t);
        params.push(t);
        this.inPorts.push(p);
        this.params.push([name, p]);
      }
    }

    for (const field of definition.returns) {
      const t = typeFromAST(field);
      returns.push(t);
    }

    if (this.functionName) {
      fs.add(this.functionName, FunctionType.createByElements(params, returns));
    }

    for (const expression of definition.body) {
      this.addFromAST(expression, fs);
    }

    if (definition.returns.length != this.outPorts.length) {
      throw new Error("The number of expressions does not match returns: "
        + definition.returns.length + " != " + this.outPorts.length);
    }

    for (let i = 0; i < returns.length; i++) {
      const declared = returns[i];
      const derived = this.outPorts[i].type;
      if (declared.string() != derived.string()) {
        throw new Error("Declared type for argument #" + i + " does not match derived "
          + declared.string() + " != " + derived.string());
      }
    }
  }
  public graphML(): string {
    const props = new Map<string, string>();
    if (this.functionName) { props.set("functionName", this.functionName); }
    return this.graphMLComplex([], props);
  }
}
