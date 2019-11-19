import * as AST from "../../ast";
import { Scope } from "../scopes/scope";
import { Condition } from "./condition";
import { ComplexNode } from "./complex";
import { Body } from "./body";
import { Port } from "../ports/port";
import { FunctionScope } from "../scopes/function";

export class IfExpression extends ComplexNode {
  public condition: Condition;
  public branches: Body[];
  constructor(definition: AST.IfExpression, scope: Scope, fs: FunctionScope) {
    super("If", definition);
    const inputs = scope.getParams();
    let conditions: AST.Expression[] = [];

    this.cloneParams(inputs);

    this.branches = [];
    this.branches.push(new Body("Then", definition.thenBranch, inputs, fs));

    conditions.push(definition.condition);
    for (const branch of definition.elseIfs) {
      conditions.push(branch.condition);
      this.branches.push(new Body("ElseIf", branch.branch, inputs, fs));
    }
    this.condition = new Condition("Condition", conditions, inputs, fs);
    this.branches.push(new Body("Else", definition.elseBranch, inputs, fs));
    scope.addNode(this);

    const thenBranch = this.branches[0];
    for (const n of this.branches) {
      if (n.outPorts.length != thenBranch.outPorts.length) {
        throw new Error("Branch arity does not match " + String(n.outPorts.length) + " != " + String(thenBranch.outPorts.length));
      }
      for (let i = 0; i < n.outPorts.length; i++) {
        if (n.outPorts[i].type.string() != thenBranch.outPorts[i].type.string()) {
          throw new Error("Branch types do not match");
        }
      }
    }

    for (const outPort of thenBranch.outPorts) {
      this.outPorts.push(new Port(this.id, outPort.type));
    }

    let index = 0;
    while (index < this.condition.inPorts.length) {
      if (this.condition.inPortUsed(index)) {
        index++;
        continue;
      }
      for (const n of this.branches) {
        if (n.inPortUsed(index)) {
          index++;
          continue;
        }
      }
      this.inPorts.splice(index, 1);
      this.condition.inPorts.splice(index, 1);
      for (const n of this.branches) {
        n.inPorts.splice(index, 1);
      }
    }
  }
  public indexPorts(): void {
    super.indexPorts();
    for (const n of this.branches) {
      n.indexPorts();
    }
    this.condition.indexPorts();
  }
  public graphML(): string {
    return this.graphMLComplex([[this.condition], this.branches], new Map([]));
  }
}
