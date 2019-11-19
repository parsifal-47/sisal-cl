import { Port } from "../ports/port"
import { Node } from "../nodes/node"
import { Type } from "../types/type";

export interface Scope {
  resolve: (name: string) => Port;
  addNode: (node: Node) => void;
  addEdge: (edge: [Port, Port]) => void;
  getParams: () => Array<[string, Type]>;
}
