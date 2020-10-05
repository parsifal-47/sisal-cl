import { Port } from "../ports/port";
import { Scope } from "../scopes/scope";
import * as Types from "../types/";
import { Node } from "./node";
import { Literal } from "./literal";
import { PrimitiveType } from "../types/";

const KnownReductions: Map<string, (t: Types.Type) => Types.Type> = new Map([
  ["stream", (t) => Types.StreamType.createByElement(t)],
  ["array", (t) => Types.ArrayType.createByElement(t)],
  ["value", (t) => t],
  ["sum", (t) => t],
  ["product", (t) => t],
  ["greatest", (t) => t],
  ["least", (t) => t],
  ["concatenate", (t) => t],
]);

export class Reduction extends Node {
  private operator: string;

  constructor(name: string, type: Types.Type, scope: Scope) {
    super("Reduction");
    this.operator = name;

    if (!KnownReductions.has(name)) {
      throw new Error("Unknown reduction " + name);
    }
    const reductionFun = KnownReductions.get(name)!;
    const guard = Literal.createByTypeValue("boolean", "true", scope);

    this.inPorts.push(new Port(this.id, type));
    this.inPorts.push(new Port(this.id, PrimitiveType.createByName("boolean")));

    scope.addEdge([guard.outPorts[0], this.inPorts[0]]);

    this.outPorts.push(new Port(this.id, reductionFun(type)));

    scope.addNode(this);
  }

  public graphML(): string {
    return this.graphMLInternal("", new Map([["operator", this.operator]]));
  }
}
