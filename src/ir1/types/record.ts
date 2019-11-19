import * as ASTTypes from "../../ast/types";
import { Type } from "./type";
import { typeFromAST } from "../create";

export class RecordType extends Type {
  public types: Type[];
  public names: string[];

  constructor(definition?: ASTTypes.RecordType) {
    super(definition);
    this.types = [];
    this.names = [];

    if (!definition) {
      return;
    }

    for (const field of definition.fields) {
      for (const name of field.names) {
        this.names.push(name);
        this.types.push(typeFromAST(field.dataType));
      }
    }
  }

  public static createByElements(elements: Array<[string, Type]>): RecordType {
    const t = new RecordType();
    for (const [name, type] of elements) {
      t.names.push(name);
      t.types.push(type);
    }
    return t;
  }

  public string(): string {
    return "record[" + this.types.map((x) => x.string()).join(", ") + " ]";
  }
}
