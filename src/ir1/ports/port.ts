import { Type } from "../types/type";

export class Port {
  public type: Type;
  public nodeId: string;
  public index?: number;
  constructor(nodeId: string, type: Type) {
    this.nodeId = nodeId;
    this.type = type;
  }
}
