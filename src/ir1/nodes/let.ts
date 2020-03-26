import * as AST from "../../ast";
import { Scope } from "../scopes/scope";
import { Init } from "./init";
import { Body } from "./body";
import { ComplexNode } from "./complex";
import { Port } from "../ports/port";
import { FunctionScope } from "../scopes/function";

export class LetExpression extends ComplexNode {
  public init: Init;
  public body: Body;

  constructor(definition: AST.LetExpression, scope: Scope, fs: FunctionScope) {
    super("Let", definition);
    this.cloneParamsFromScope(scope);
    this.init = new Init("Init", definition.definitions, scope.getParams(), fs);
    this.body = new Body("Body", definition.expressions, this.init.getResults().concat(scope.getParams()), fs);

    for (const p of this.body.outPorts) {
      const outPort = new Port(this.id, p.type);
      this.outPorts.push(outPort);
    }

    let index = 0;
    while (index < this.inPorts.length) {
      if (!this.init.inPortUsed(index) && !this.body.inPortUsed(index)) {
        this.inPorts.splice(index, 1);
        this.init.inPorts.splice(index, 1);
        this.init.outPorts.splice(index, 1);
        this.body.inPorts.splice(index, 1);
        continue;
      }
      index++;
    }
    scope.addNode(this);
  }
  public indexPorts(): void {
    super.indexPorts();
    this.init.indexPorts();
    this.body.indexPorts();
  }
  public graphML(): string {
    return this.graphMLComplex([[this.init, this.body]], new Map([]));
  }
}
