import * as AST from "../../ast";
import { Scope } from "../scopes/scope";
import * as GML from "../../graphml/";
import { Port } from "../ports/port";
import { getOutPorts } from "../create";
import { FunctionScope } from "../scopes/function";

export class Node {
  private static lastId: number = 0;

  public name: string;
  public location: string;
  public outPorts: Port[];
  public inPorts: Port[];
  public id: string;

  constructor(name: string, ast?: AST.Node) {
    Node.lastId++;

    this.name = name;
    if (ast && ast.location) {
      const locString = (position: AST.Position) => {
        return String(position.line) + ":" + String(position.column);
      };
      this.location = locString(ast.location.start) + "-" +
                      locString(ast.location.end);
    } else {
      this.location = "not applicable";
    }
    this.outPorts = [];
    this.inPorts = [];
    this.id = "node" + String(Node.lastId);
  }

  public createAndLink(expression: AST.Expression, scope: Scope, fs: FunctionScope): void {
    const sourcePorts = getOutPorts(expression, scope, fs);
    if (sourcePorts.length != 1) {
      throw new Error("Element cannot resolve to multiple");
    }
    const destPort = new Port(this.id, sourcePorts[0].type); 
    this.inPorts.push(destPort);
    scope.addEdge([sourcePorts[0], destPort]);
  }

  public indexPorts(): void {
    let index = 0;
    for (const p of this.inPorts) {
      p.index = index++;
    }
    index = 0;
    for (const p of this.outPorts) {
      p.index = index++;
    }
  }

  public graphML(): string {
    return this.graphMLInternal("", new Map<string, string>());
  }

  protected graphMLInternal(subGraph: string, props: Map<string, string>): string {
    return GML.makeNode(this.id, this.name, this.location, this.inPorts, this.outPorts, props, subGraph);
  }
}
