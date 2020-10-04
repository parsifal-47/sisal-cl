import * as AST from "../../ast";
import { Port } from "../ports/port";
import { FunctionScope } from "../scopes/function";
import { Scope } from "../scopes/scope";
import { Body } from "./body";
import { ComplexNode } from "./complex";
import { Condition } from "./condition";
import { Init } from "./init";
import { Node } from "./node";
import { RangeGen } from "./rangeGen";
import { Returns } from "./returns";

export class LoopExpression extends ComplexNode {
  public init: Init;
  public body: Init;
  public RangeGen?: RangeGen;
  public preCondition?: Condition;
  public postCondition?: Condition;
  public reduction: Returns;

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
      this.RangeGen = new RangeGen(definition.range, scope, fs);
      bodyInputs = bodyInputs.concat(this.RangeGen.getResults());
    }
    bodyInputs = bodyInputs.concat(params);
    if (definition.preCondition) {
      this.preCondition = new Condition("PreCondition", [definition.preCondition], bodyInputs, fs);
    }
    this.body = new Init("Body", definition.body, bodyInputs, fs);
    const returnInputs = this.body.getResults().concat(bodyInputs);
    if (definition.postCondition) {
      this.postCondition = new Condition("PostCondition", [definition.postCondition], returnInputs, fs);
    }
    let retExpressions = new Array<[string, AST.Expression]>();
    for (const r of definition.reductions) {
      retExpressions.push([r.name, r.expression]);
    }
    this.reduction = new Returns(retExpressions, returnInputs, fs);
    for (const outPort of this.reduction.outPorts) {
      this.outPorts.push(new Port(this.id, outPort.type));
    }

    scope.addNode(this);
  }
  public indexPorts(): void {
    super.indexPorts();
    this.init.indexPorts();
    this.body.indexPorts();
    this.reduction.indexPorts();
    if (this.RangeGen) { this.RangeGen.indexPorts(); }
    if (this.preCondition) { this.preCondition.indexPorts(); }
    if (this.postCondition) { this.postCondition.indexPorts(); }
  }
  public graphML(): string {
    const nodes: Node[] = [];
    if (this.init.outPorts.length > 0) { nodes.push(this.init); }

    if (this.RangeGen) { nodes.push(this.RangeGen); }
    if (this.preCondition) { nodes.push(this.preCondition); }

    nodes.push(this.body);

    if (this.postCondition) { nodes.push(this.postCondition); }
    nodes.push(this.reduction);

    return this.graphMLComplex([nodes], new Map([]));
  }
}
