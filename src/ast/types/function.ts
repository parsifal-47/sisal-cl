import { TypeValue } from "./value";

export interface FunctionType extends TypeValue {
  params: TypeValue[];
  returns: TypeValue[];
}

export function isFunctionType(node: TypeValue): node is FunctionType {
  return node.name === "Function";
}
