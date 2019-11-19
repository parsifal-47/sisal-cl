import * as AST from "../../ast";

export class Type {
  public location: string;

  constructor(ast?: AST.Node) {
    if (ast && ast.location) {
      const locString = (position: AST.Position) => {
        return String(position.line) + ":" + String(position.column);
      };
      this.location = locString(ast.location.start) + "-" +
                      locString(ast.location.end);
    } else {
      this.location = "not applicable";
    }
  }

  public string(): string {
    return "unknown";
  }
}
