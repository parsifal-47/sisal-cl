import * as AST from "../../ast/expression";
import { Port } from "../ports/port";
import { FunctionScope } from "../scopes/function";
import { Scope } from "../scopes/scope";
import * as Types from "../types/";
import { Node } from "./node";

export class FunctionCall extends Node {

  public static createFromSourcePort(functionSource: Port, definition: AST.FunctionCall, scope: Scope, fs: FunctionScope): FunctionCall {
    const functionType = functionSource.type;
    if (!(functionType instanceof Types.FunctionType)) {
      throw new Error("Trying to call " + functionSource.type.string());
    }
    const call = new FunctionCall(functionType, definition, scope, fs);
    const inFunction = new Port(call.id, functionType);
    call.inPorts.unshift(inFunction);
    scope.addEdge([functionSource, inFunction]);
    return call;
  }
  public callee?: string;
  constructor(functionType: Types.FunctionType, definition: AST.FunctionCall, scope: Scope, fs: FunctionScope) {
    super("FunctionCall", definition);
    if (definition.arguments.length != functionType.params.length) {
      throw new Error("Call arity mismatch");
    }
    for (const expression of definition.arguments) {
      this.createAndLink(expression, scope, fs);
    }
    for (const returnType of functionType.returns) {
      this.outPorts.push(new Port(this.id, returnType));
    }
    scope.addNode(this);
  }

  public graphML(): string {
    const props: Map<string, string> = new Map([]);
    if (this.callee) { props.set("callee", this.callee); }
    return this.graphMLInternal("", props);
  }
}
