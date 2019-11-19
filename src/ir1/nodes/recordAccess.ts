import * as AST from "../../ast/expression";
import { Scope } from "../scopes/scope";
import * as Types from "../types/";
import { Node } from "./node";
import { Port } from "../ports/port";

export class RecordAccess extends Node {
  public field: string;

  constructor(recordSource: Port, definition: AST.RecordAccess, scope: Scope) {
    super("RecordAccess", definition);
    const recordType = recordSource.type
    if (!(recordType instanceof Types.RecordType)) {
      throw new Error("Trying to record-access " + recordType.string());
    }
    this.field = definition.field;
    const index = recordType.names.indexOf(definition.field);
    if (index === -1) {
      throw new Error("Trying to access non-existing field " +
        definition.field + " of record " + recordType.string());
    }
    const inRecord = new Port(this.id, recordType);
    this.inPorts.push(inRecord);
    scope.addEdge([recordSource, inRecord]);

    this.outPorts.push(new Port(this.id, recordType.types[index]));
    scope.addNode(this);
  }

  public graphML(): string {
    return this.graphMLInternal("", new Map([["field", this.field]]));
  }
}
