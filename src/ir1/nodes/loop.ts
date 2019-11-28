import * as AST from "../../ast";
import { Scope } from "../scopes/scope";
import { ComplexNode } from "./complex";
import { Init } from "./init";
import { Body } from "./body";
import * as Types from "../types/";
import { Range } from "./range";
import { Condition } from "./condition";
import { Port } from "../ports/port";
import { FunctionScope } from "../scopes/function";

const KnownReductions: Map<string, (t:Types.Type) => Types.Type> = new Map([
  ["stream", (t) => Types.StreamType.createByElement(t)],
  ["array", (t) => Types.ArrayType.createByElement(t)],
  ["value", (t) => t],
  ["sum", (t) => t],
  ["product", (t) => t],
  ["greatest", (t) => t],
  ["least", (t) => t],
  ["concatenate", (t) => t]
]);

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
    if (definition.preCondition) {
      this.preCondition = new Condition("PreCondition", [definition.preCondition], bodyInputs, fs);
    }
    this.body = new Init("Body", definition.body, bodyInputs, fs);
    const returnInputs = this.body.getResults();
    if (definition.postCondition) {
      this.postCondition = new Condition("PostCondition", [definition.postCondition], returnInputs, fs);
    }
    this.returns = new Body("Returns", [definition.returns], returnInputs, fs);
    if (!KnownReductions.has(definition.reduction)) {
      throw new Error("Unknown reduction " + definition.reduction);
    }
    const reduction = KnownReductions.get(definition.reduction)!;
    this.reduction = definition.reduction;
    for (const outPort of this.returns.outPorts) {
      this.outPorts.push(new Port(this.id, reduction(outPort.type)));
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
