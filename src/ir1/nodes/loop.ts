import * as AST from "../../ast";
import { Scope } from "../scopes/scope";
import { ComplexNode } from "./complex";
import { Init } from "./init";
import { Body } from "./body";
import { Range } from "./range";
import { Returns } from "./returns";
import { Condition } from "./condition";
import { Port } from "../ports/port";
import { FunctionScope } from "../scopes/function";

export class LoopExpression extends ComplexNode {
  public init: Init;
  public body: Init;
  public returns: Body;
  public range?: Range;
  public preCondition?: Condition
  public postCondition?: Condition;
  public reduction: string;

  constructor(definition: AST.LoopExpression, scope: Scope, fs: FunctionScope) {
    super("LoopExpression", definition);
    const params = scope.getParams();
    this.cloneParamsFromScope(scope);
    for (let i = 0; i < params.length; i++) {
      scope.addEdge([scope.resolve(params[i][0]), this.inPorts[i]]);
    }
    this.init = new Init("Init", definition.init, params, fs);
    let bodyInputs = this.init.getResults();
    if (definition.range) {
      this.range = new Range(definition.range, scope, fs);
      bodyInputs = bodyInputs.concat(this.range.getResults());
    }
    bodyInputs = bodyInputs.concat(params);
    if (definition.preCondition) {
      this.preCondition = new Condition("PreCondition", [definition.preCondition], bodyInputs, fs);
    }
    this.body = new Init("Body", definition.body, bodyInputs, fs);
    const returnInputs = bodyInputs.concat(this.body.getResults());
    if (definition.postCondition) {
      this.postCondition = new Condition("PostCondition", [definition.postCondition], returnInputs, fs);
    }
    this.returns = new Returns(definition.reduction, [definition.returns], returnInputs, fs);
    this.reduction = definition.reduction;
    for (const outPort of this.returns.outPorts) {
      this.outPorts.push(new Port(this.id, outPort.type));
    }
    scope.addNode(this);
  }
  public indexPorts(): void {
    super.indexPorts();
    this.init.indexPorts();
    this.body.indexPorts();
    this.returns.indexPorts();
    if (this.range) this.range.indexPorts();
    if (this.preCondition) this.preCondition.indexPorts();
    if (this.postCondition) this.postCondition.indexPorts();
  }
  public graphML(): string {
    const nodes = [this.init, this.body, this.returns];
    if (this.range) nodes.push(this.range);
    if (this.preCondition) nodes.push(this.preCondition);
    if (this.postCondition) nodes.push(this.postCondition);

    return this.graphMLComplex([nodes], new Map([["reduction", this.reduction]]));
  }
}
