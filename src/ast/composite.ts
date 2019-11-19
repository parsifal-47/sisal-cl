import { Definition } from "./definition";
import { Expression } from "./expression";
import { FunctionValue } from "./function";
import { Node } from "./node";
import { TypeValue } from "./types/value";

export type CompositeValue = ArrayValue | RecordValue |
                             StreamValue | FunctionValue | TypeValue;

export interface ArrayValue extends Node {
  contents: Expression[];
}

export function isArrayValue(node: Node): node is ArrayValue {
  return node.type === "Array";
}

export interface RecordValue extends Node {
  contents: Definition[];
}

export function isRecordValue(node: Node): node is RecordValue {
  return node.type === "Record";
}

export interface StreamValue extends Node {
  elementType: TypeValue;
  contents: Expression[];
}

export function isStreamValue(node: Node): node is StreamValue {
  return node.type === "Stream";
}
