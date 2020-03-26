import { Scope } from "../scopes/scope";
import * as Types from "../types/";
import { Port } from "../ports/port";
import { Node } from "./node";

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

export class Reduction extends Node {
  private operator: string;

  constructor(name: string, type: Types.Type, scope: Scope) {
    super("Reduction");
    this.operator = name;

    if (!KnownReductions.has(name)) {
      throw new Error("Unknown reduction " + name);
    }
    const reductionFun = KnownReductions.get(name)!;
    this.inPorts.push(new Port(this.id, type));
    this.outPorts.push(new Port(this.id, reductionFun(type)));

    scope.addNode(this);
  }

  public graphML(): string {
    return this.graphMLInternal("", new Map([["operator", this.operator]]));
  }
}
