import { Definition } from "./definition";
import { Expression } from "./expression";
import { Node } from "./node";

export interface LoopExpression extends Node {
  range?: RangeList;
  init: Definition[];
  preCondition?: Expression;
  postCondition?: Expression;
  body: Definition[];
  reductions: Reduction[];
}

export function isLoopExpression(node: Node): node is LoopExpression {
  return node.type === "Loop";
}

export interface RangeList extends Node {
  names: string[];
  ranges: Expression[];
}

export function isRangeList(node: Node): node is RangeList {
  return node.type === "RangeList";
}

export interface Reduction extends Node {
  name: string;
  expression: Expression;
}

export function isReduction(node: Node): node is Reduction {
  return node.type === "Reduction";
}
