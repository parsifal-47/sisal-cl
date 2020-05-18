import * as AST from "../../ast";
import * as GML from "../../graphml/";
import { getOutPorts } from "../create";
import { Port } from "../ports/port";
import { FunctionScope } from "../scopes/function";
import { Scope } from "../scopes/scope";
import * as Types from "../types";
import { Node } from "./node";

export class ComplexNode extends Node implements Scope {
  public params: Array<[string, Port]>;
  public edges: Array<[Port, Port]>;
  public nodes: Node[];
  constructor(name: string, ast?: AST.Node) {
    super(name, ast);
    this.params = [];
    this.edges = [];
    this.nodes = [];
  }

  public addEdge(edge: [Port, Port]): void {
    this.edges.push(edge);
  }

  public addNode(node: Node): void {
    this.nodes.push(node);
  }

  public getParams(): Array<[string, Types.Type]> {
    const result: Array<[string, Types.Type]> = [];
    for (const [name, p] of this.params) {
      result.push([name, p.type]);
    }
    return result;
  }

  public resolve(name: string): Port {
    for (const [n, p] of this.params) {
      if (n == name) {
        return p;
      }
    }
    throw new Error("Can't resolve " + name);
  }

  public cloneParams(params: Array<[string, Types.Type]>) {
    for (const [name, type] of params) {
      const port = new Port(this.id, type);
      this.inPorts.push(port);
      this.params.push([name, port]);
    }
  }

  public cloneParamsFromScope(scope: Scope) {
    this.cloneParams(scope.getParams());
  }

  public inPortUsed(index: number): boolean {
    const port = this.inPorts[index];
    for (const [p, _] of this.edges) {
      if (p === port) { return true; }
    }
    return false;
  }

  public addFromAST(expression: AST.Expression, fs: FunctionScope): void {
    const ports = getOutPorts(expression, this, fs);
    for (const p of ports) {
      const p2 = new Port(this.id, p.type);
      this.outPorts.push(p2);
      this.edges.push([p, p2]);
    }
  }

  public indexPorts(): void {
    super.indexPorts();
    for (const n of this.nodes) {
      n.indexPorts();
    }
  }

  public graphML(): string {
    return this.graphMLComplex([], new Map([]));
  }

  protected graphMLComplex(nodes: Node[][], props: Map<string, string>): string {
    const edges = this.edges.map((e) => GML.makeEdge(e[0], e[1], this.id)).join("\n");
    const subNodes = this.nodes.map((n) => n.graphML()).join("\n");
    const extra = nodes.map((c) => c.map((n) => n.graphML()).join("\n")).join("\n");
    return this.graphMLInternal(subNodes + extra + edges, props);
  }
}
