import * as AST from "./ast";
import * as GML from "./graphml/";
import * as Nodes from "./ir1/nodes";
import { FunctionScope } from "./ir1/scopes/function";
import { FunctionType } from "./ir1/types";

export class Module implements FunctionScope {
  public functions: Nodes.FunctionValue[];
  public declarations: Map<string, FunctionType>;

  public constructor(functions: AST.FunctionValue[]) {
    this.functions = [];
    this.declarations = new Map<string, FunctionType>();
    for (const f of functions) {
      const n = new Nodes.FunctionValue(f, this);
      n.indexPorts();
      this.functions.push(n);
    }
  }

  public add(name: string, type: FunctionType) {
    this.declarations.set(name, type);
  }

  public resolve(name: string): FunctionType {
    if (!this.declarations.has(name)) {
      throw new Error("Undefined function: " + name);
    }
    return this.declarations.get(name)!;
  }

  public graphML(): string {
    return GML.makeDocument(GML.makeGraph("module", this.functions.map((x) => x.graphML()).join("\n")));
  }

  public serialize(): string {
    return "Not implemented";
  }
}
