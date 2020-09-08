import * as AST from "../../ast";
import { Port } from "../ports/port";
import { FunctionScope } from "../scopes/function";
import { Scope } from "../scopes/scope";
import * as Types from "../types/";
import { Node } from "./node";
import { StreamType } from "../types/stream";

export class Scatter extends Node {
  constructor(type: Types.Type, scope: Scope, fs: FunctionScope) {
    super("Scatter");

    this.inPorts.push(new Port(this.id, StreamType.createByElement(type)));

    // The first out port represents the value being scattered, second is its index
    this.outPorts.push(new Port(this.id, type));
    this.outPorts.push(new Port(this.id, Types.PrimitiveType.createByName("integer")));
    scope.addNode(this);
  }
}
