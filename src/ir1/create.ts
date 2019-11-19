import * as AST from "../ast";
import * as ASTTypes from "../ast/types";
import * as Types from "./types";
import * as Nodes from "./nodes/";
import { Port } from "./ports/port";
import { Scope } from "./scopes/scope";
import { FunctionScope } from "./scopes/function";

export function typeFromAST(node: ASTTypes.TypeValue): Types.Type {
  if (ASTTypes.isIntegerType(node) || ASTTypes.isFloatType(node) ||
      ASTTypes.isBooleanType(node) || ASTTypes.isStringType(node)) {
    return new Types.PrimitiveType(node);
  }
  if (ASTTypes.isArrayType(node)) {
    return new Types.ArrayType(node);
  }
  if (ASTTypes.isFunctionType(node)) {
    return new Types.FunctionType(node);
  }
  if (ASTTypes.isRecordType(node)) {
    return new Types.RecordType(node);
  }
  if (ASTTypes.isStreamType(node)) {
    return new Types.StreamType(node);
  }
  throw new Error("Unexpected expression type value " + JSON.stringify(node));
}

export function portFromPostfix(postfix: AST.Postfix, scope: Scope, fs: FunctionScope): Port[] {
  let ports: Port[];
  let operations = postfix.operationList;
  if (typeof postfix.base === "string" && AST.isFunctionCall(operations[0])) {
    const functionType = fs.resolve(postfix.base);
    const call = new Nodes.FunctionCall(functionType, operations[0], scope, fs);
    call.callee = postfix.base;
    ports = call.outPorts;
    operations.pop();
  } else {
    ports = getOutPorts(postfix.base, scope, fs);
  }

  for (const operation of operations) {
    if (ports.length != 1) {
      throw new Error("Postfix is applied to tuple");
    }
    const port = ports[0];

    if (AST.isFunctionCall(operation)) {
      const call = Nodes.FunctionCall.createFromSourcePort(port, operation, scope, fs);
      ports = call.outPorts;
      continue;
    }
    if (AST.isRecordAccess(operation)) {
      const recordAccess = new Nodes.RecordAccess(port, operation, scope);
      ports = recordAccess.outPorts;
      continue;
    }
    if (AST.isArrayAccess(operation)) {
      const recordAccess = new Nodes.ArrayAccess(port, operation, scope, fs);
      ports = recordAccess.outPorts;
      continue;
    }
    throw new Error("Unexpected postfix operation " + JSON.stringify(operation));
  }
  return ports;
}

export function getOutPorts(expression: AST.Expression, scope: Scope, fs: FunctionScope): Port[] {
  if (typeof expression === "string") {
    return [scope.resolve(expression)];
  }
  if (AST.isLiteral(expression)) {
    const literal = new Nodes.Literal(expression, scope);
    return literal.outPorts;
  }
  if (AST.isArrayValue(expression)) {
    const array = new Nodes.ArrayValue(expression, scope, fs);
    return array.outPorts;
  }
  if (AST.isStreamValue(expression)) {
    const stream = new Nodes.StreamValue(expression, scope, fs);
    return stream.outPorts;
  }
  if (AST.isRecordValue(expression)) {
    const record = new Nodes.RecordValue(expression, scope, fs);
    return record.outPorts;
  }
  if (AST.isBinaryExpression(expression)) {
    const binary = new Nodes.BinaryExpression(expression, scope, fs);
    return binary.outPorts;
  }
  if (AST.isUnaryExpression(expression)) {
    const unary = new Nodes.UnaryExpression(expression, scope, fs);
    return unary.outPorts;
  }
  if (AST.isPostfix(expression)) {
    return portFromPostfix(expression, scope, fs);
  }
  if (AST.isOldValue(expression)) {
    const old = new Nodes.OldValue(expression, scope, fs);
    return old.outPorts;
  }
  if (AST.isLetExpression(expression)) {
    const letExpression = new Nodes.LetExpression(expression, scope, fs);
    return letExpression.outPorts;
  }
  if (AST.isLoopExpression(expression)) {
    const loop = new Nodes.LoopExpression(expression, scope, fs);
    return loop.outPorts;
  }
  if (AST.isIfExpression(expression)) {
    const ifExpression = new Nodes.IfExpression(expression, scope, fs);
    return ifExpression.outPorts;
  }
  throw new Error("Unexpected expression type in create " + JSON.stringify(expression));
}
