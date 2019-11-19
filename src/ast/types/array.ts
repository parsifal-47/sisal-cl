import { TypeValue } from "./value";

export interface ArrayType extends TypeValue {
  elementType: TypeValue;
}

export function isArrayType(node: TypeValue): node is ArrayType {
  return node.name === "Array";
}
