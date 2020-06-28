import * as AST from "../../ast";
import { Port } from "../ports/port";
import { FunctionScope } from "../scopes/function";
import { Scope } from "../scopes/scope";
import { Body } from "./body";
import { ComplexNode } from "./complex";
import { Condition } from "./condition";
import { Init } from "./init";
import { Node } from "./node";
import { Range } from "./range";
import { Returns } from "./returns";

export class LoopExpression extends ComplexNode {
  public init: Init;
  public body: Init;
  public range?: Range;
  public preCondition?: Condition;
  public postCondition?: Condition;
  public reductions: Array<[string, Body]>;

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
    this.reductions = new Array<[string, Body]>();
    for (const r of definition.reductions) {
      const ret = new Returns(r.name, [r.expression], returnInputs, fs);
      this.reductions.push([r.name, ret]);
      for (const outPort of ret.outPorts) {
        this.outPorts.push(new Port(this.id, outPort.type));
      }
    }
    scope.addNode(this);
  }
  public indexPorts(): void {
    super.indexPorts();
    this.init.indexPorts();
    this.body.indexPorts();
    for (const [_, r] of this.reductions) {
      r.indexPorts();
    }
    if (this.range) { this.range.indexPorts(); }
    if (this.preCondition) { this.preCondition.indexPorts(); }
    if (this.postCondition) { this.postCondition.indexPorts(); }
  }
  public graphML(): string {
    const nodes: Node[] = [this.init];

    if (this.range) { nodes.push(this.range); }
    if (this.preCondition) { nodes.push(this.preCondition); }

    nodes.push(this.body);

    if (this.postCondition) { nodes.push(this.postCondition); }
    for (const [_, r] of this.reductions) {
      nodes.push(r);
    }

    return this.graphMLComplex([nodes], new Map([]));
  }
}
