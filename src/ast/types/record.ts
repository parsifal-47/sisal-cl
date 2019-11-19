import { IdWithType } from "../function";
import { TypeValue } from "./value";

export interface RecordType extends TypeValue {
  fields: IdWithType[];
}

export function isRecordType(node: TypeValue): node is RecordType {
  return node.name === "Record";
}
