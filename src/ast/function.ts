import { Expression } from "./expression";
import { Node } from "./node";
import { TypeValue } from "./types";

export interface FunctionValue extends Node {
  name?: string;
  params: IdWithType[];
  body: Expression[];
  returns: TypeValue[];
}

export function isFunctionValue(node: Node): node is FunctionValue {
  return node.type === "Lambda";
}

export interface IdWithType extends Node {
  names: string[];
  dataType: TypeValue;
}

export function IdWithType(node: Node): node is IdWithType {
  return node.type === "TypedIdentifiers";
}
