import { FunctionType } from "../types/function";

export interface FunctionScope {
  resolve: (name: string) => FunctionType;
  add: (name: string, type: FunctionType) => void;
}