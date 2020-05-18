{
  function makeList(initial, tail, num) {
    for (var i = 0; i < tail.length; i++) {
      initial.push(tail[i][num]);
    }
    return initial;
  }
  function makeBinary(head, tail) {
    var result = head;
    for (var i = 0; i < tail.length; i++) {
      result = {
        type:     "Binary",
        location: location(),
        operator: tail[i][1],
        left:     result,
        right:    tail[i][3]
      };
    }
    return result;
  }
}

start
  = __ program:TopFunctionDefinitionList __ { return program; }

SourceCharacter
  = .

/* Whitespaces and comments */

WhiteSpace "whitespace"
  = [\t\v\f ]

LineTerminator
  = [\n\r\u2028\u2029]

LineTerminatorSequence "end of line"
  = "\n"
  / "\r\n"
  / "\r"
  / "\u2028" // line separator
  / "\u2029" // paragraph separator

Comment "comment"
  = SingleLineComment

SingleLineComment
  = "#" (!LineTerminator SourceCharacter)*

/* Identifiers */

Identifier "identifier"
  = !ReservedWord name:IdentifierName { return name; }

IdentifierName "identifier"
  = start:IdentifierStart parts:IdentifierPart* {
      return start + parts.join("");
    }

IdentifierStart
  = [a-zA-Z]
  / "$"
  / "_"
  / "\\" sequence:UnicodeEscapeSequence { return sequence; }

IdentifierPart
  = IdentifierStart
  / [0-9]

ReservedWord
  = Keyword
  / BooleanLiteral

Keyword
  = (   "at"
      / "case"
      / "cross"
      / "do"
      / "else"
      / "elseif"
      / "end"
      / "error"
      / "false"
      / "for"
      / "function"
      / "if"
      / "import"
      / "in"
      / "interface"
      / "let"
      / "module"
      / "of"
      / "old"
      / "record"
      / "returns"
      / "stream"
      / "then"
      / "true"
      / "type"
      / "while"
    )
    !IdentifierPart

/* Literals */

Literal
  = BooleanLiteral
  / NumericLiteral
  / value:StringLiteral {
      return {
        type:  "StringLiteral",
        location: location(),
        value: value
      };
    }

BooleanLiteral
  = TrueToken  { return { type: "BooleanLiteral", location: location(), value: true  }; }
  / FalseToken { return { type: "BooleanLiteral", location: location(), value: false }; }

NumericLiteral "number"
  = literal:(HexIntegerLiteral / DecimalLiteral) !IdentifierStart {
      return literal;
    }

DecimalLiteral
  = before:DecimalIntegerLiteral
    after:("." DecimalDigits)?
    exponent:ExponentPart? {
      if (after !== null || exponent !== null) {
        return {
          type: "RealLiteral",
          location: location(),
          value: parseFloat(before + "." + (after !== null ? after[1] : "") +
                            (exponent !== null ? exponent : ""))
        };
      }
      return {
        type: "IntegerLiteral",
        location: location(),
        value: parseInt(before)
      };
    }
  / "." after:DecimalDigits exponent:ExponentPart? {
      return {
        type: "RealLiteral",
        location: location(),
        value: parseFloat("." + after + exponent)
      };
    }
  / before:DecimalIntegerLiteral exponent:ExponentPart? {
      if (exponent !== null) {
        return {
          type: "RealLiteral",
          location: location(),
          value: parseFloat(before + exponent)
        };
      }
      return {
        type: "IntegerLiteral",
        location: location(),
        value: parseInt(before)
      };
    }

DecimalIntegerLiteral
  = "0" / digit:NonZeroDigit digits:DecimalDigits? {
    return digit + (digits === null ? "" : digits);
  }

DecimalDigits
  = digits:DecimalDigit+ { return digits.join(""); }

DecimalDigit
  = [0-9]

NonZeroDigit
  = [1-9]

ExponentPart
  = indicator:ExponentIndicator integer:SignedInteger {
      return indicator + integer;
    }

ExponentIndicator
  = [eE]

SignedInteger
  = sign:[-+]? digits:DecimalDigits { return sign + digits; }

HexIntegerLiteral
  = "0" [xX] digits:HexDigit+ { return parseInt("0x" + digits.join("")); }

HexDigit
  = [0-9a-fA-F]

StringLiteral "string"
  = parts:('"' DoubleStringCharacters? '"' / "'" SingleStringCharacters? "'") {
      return parts[1];
    }

DoubleStringCharacters
  = chars:DoubleStringCharacter+ { return chars.join(""); }

SingleStringCharacters
  = chars:SingleStringCharacter+ { return chars.join(""); }

DoubleStringCharacter
  = !('"' / "\\" / LineTerminator) char_:SourceCharacter { return char_;     }
  / "\\" sequence:EscapeSequence                         { return sequence;  }
  / LineContinuation

SingleStringCharacter
  = !("'" / "\\" / LineTerminator) char_:SourceCharacter { return char_;     }
  / "\\" sequence:EscapeSequence                         { return sequence;  }
  / LineContinuation

LineContinuation
  = "\\" sequence:LineTerminatorSequence { return sequence; }

EscapeSequence
  = CharacterEscapeSequence
  / "0" !DecimalDigit { return "\0"; }
  / HexEscapeSequence
  / UnicodeEscapeSequence

CharacterEscapeSequence
  = SingleEscapeCharacter
  / NonEscapeCharacter

SingleEscapeCharacter
  = char_:['"\\bfnrtv] {
      return char_
        .replace("b", "\b")
        .replace("f", "\f")
        .replace("n", "\n")
        .replace("r", "\r")
        .replace("t", "\t")
        .replace("v", "\x0B") // IE does not recognize "\v".
    }

NonEscapeCharacter
  = (!EscapeCharacter / LineTerminator) char_:SourceCharacter { return char_; }

EscapeCharacter
  = SingleEscapeCharacter
  / DecimalDigit
  / "x"
  / "u"

HexEscapeSequence
  = "x" h1:HexDigit h2:HexDigit {
      return String.fromCharCode(parseInt("0x" + h1 + h2));
    }

UnicodeEscapeSequence
  = "u" h1:HexDigit h2:HexDigit h3:HexDigit h4:HexDigit {
      return String.fromCharCode(parseInt("0x" + h1 + h2 + h3 + h4));
    }

/* Tokens */

AtToken         = "at"               !IdentifierPart
CaseToken       = "case"             !IdentifierPart
CrossToken      = "cross"            !IdentifierPart
DoToken         = "do"               !IdentifierPart
IfToken         = "if"               !IdentifierPart
ElseToken       = "else"             !IdentifierPart
ElseIfToken     = "elseif"           !IdentifierPart
EndToken        = "end"              !IdentifierPart
ErrorToken      = "error"            !IdentifierPart
ImportToken     = "import"           !IdentifierPart
InToken         = "in"               !IdentifierPart
InterfaceToken  = "interface"        !IdentifierPart
ThenToken       = "then"             !IdentifierPart
FalseToken      = "false"            !IdentifierPart
ForToken        = "for"              !IdentifierPart
FunctionToken   = "function"         !IdentifierPart
OldToken        = "old"              !IdentifierPart
LetToken        = "let"              !IdentifierPart
ModuleToken     = "module"           !IdentifierPart
ReturnsToken    = "returns"          !IdentifierPart
TrueToken       = "true"             !IdentifierPart
WhileToken      = "while"            !IdentifierPart
RepeatToken     = "repeat"           !IdentifierPart
TypeToken       = "type"             !IdentifierPart
InitialToken    = "initial"          !IdentifierPart
OfToken         = "of"               !IdentifierPart

IntegerToken    = "integer"
FloatToken      = "real"
CharacterToken  = "character"
ComplexToken    = "complex"
StringToken     = "string"
BooleanToken    = "boolean"

StreamToken     = "stream"
ArrayToken      = "array"
RecordToken     = "record"

EOS
  = _ LineTerminatorSequence
  / __ EOF

EOF
  = !.

/* Underscore */

_
  = (WhiteSpace / SingleLineComment)*

__
  = (WhiteSpace / LineTerminatorSequence / Comment)*

/* Composite Type Values */

CompositeValue
  = ComplexValue
  / ArrayValue
  / RecordValue
  / StreamValue
  / FunctionValue
  / TypeValue

/* TODO: complex type no imaginary part */
ComplexValue
  = ComplexToken __ "[" __ real:NumericLiteral __ "," __ imaginary:NumericLiteral __ "]" {
  return {type: "Complex", location: location(), real: real, imaginary: imaginary};
  }

/* TODO: more array constructors */
ArrayValue
  = "[" __ contents:ExpressionList __ "]" {
  return {type: "Array", location: location(), contents: contents};
  }

RecordValue
  = RecordToken __ typeName:Identifier? __ "[" __ contents:DefinitionList __ "]" {
    return {
      type: "Record",
      location: location(),
      typeName: typeName ? typeName : [],
      contents: contents
    };
  }

StreamValue
  = StreamToken __ OfToken __ elementType:Identifier __ "[" __ contents:ExpressionList __ "]"  {
    return {
      type: "Stream",
      location: location(),
      elementType: elementType,
      contents: contents
    };
  }

FunctionValue
  = FunctionToken __ functionName:Identifier? __
    "(" __ params:IdsWithTypes? __
          returns:FunctionReturns? ")" __ body:FunctionBody {
    return {
      type: "Lambda",
      location: location(),
      name: functionName ? functionName : [],
      params: params ? params : [],
      returns: returns ? returns : [],
      body: body
    };
  }

FunctionBody
  =  expressions:ExpressionList __ EndToken __ FunctionToken {
    return expressions;
  }

FunctionReturns
  = ReturnsToken __ returns:TypeList __ {
    return returns;
  }

TypeValue
  = PrimitiveType
  / StreamType
  / ArrayType
  / RecordType
  / FunctionType
  / Identifier

PrimitiveType
  = name:(IntegerToken / BooleanToken / FloatToken / CharacterToken / StringToken / ComplexToken) {
    return {type: "Type", location: location(), name: name };
  }

StreamType
  = StreamToken __ OfToken __ type:TypeValue __ {
    return {type: "Type", location: location(), name: "Stream", elementType: type };
  }

ArrayType
  = ArrayToken __ dimensions:("[" __ ExpressionList __ "]" __)? OfToken __ type:TypeValue __ {
    return {type: "Type", location: location(), name: "Array", dimensions: dimensions ? dimensions[2] : [], elementType: type };
  }

RecordType
  = RecordToken __ "[" __ fields:IdsWithTypes __ "]" __ {
    return {type: "Type", location: location(), name: "Record", fields: fields };
  }

FunctionType
  = FunctionToken __
    "[" __ params: TypeList __ returns:FunctionReturns? "]" __ {
    return {type: "Type", location: location(), name: "Function", params: params, returns: returns };
  }

Triplet
  = "[" __ lower: Expression __ upper:(".." __ Expression __ ) "]" {
    return {type: "Triplet", location: location(), lower: lower, upper: upper ? upper[2]:[] };
  }

IdsWithTypes
  = head:IdsWithType
    tail:(__ ";" __ IdsWithType)* {
      return makeList([head], tail, 3);
    }

IdsWithType
  = ids:IdList __ ":" __ type:TypeValue __ {
    return {
      type: "TypedIdentifiers",
      location: location(),
      names: ids,
      dataType: type
      };
  }

/* Expressions */

Expression
  = LogicalOperation

LogicalOperator
  = "||" { return "|"; }
  / "|" !"|" { return "|"; }
  / "^"
  / "&"

LogicalOperation
  = head:Compare
    tail:(__ LogicalOperator __ Compare)* {
      return makeBinary(head, tail);
    }

CompareOperator
  = "="
  / "/="
  / "<" !"=" { return "<"; }
  / ">" !"=" { return ">"; }
  / "<="
  / ">="

Compare
  = head:LowPriorityOperation
    tail:(__ CompareOperator __ LowPriorityOperation)* {
      return makeBinary(head, tail);
    }

LowPriorityOperator
  = "+"
  / "-"

LowPriorityOperation
  = head:HighPriorityOperation
    tail:(__ LowPriorityOperator __ HighPriorityOperation)* {
      return makeBinary(head, tail);
    }

HighPriorityOperator
  = "*"
  / "/"
  / "%"

HighPriorityOperation
  = head:UnaryOperation
    tail:(__ HighPriorityOperator __ UnaryOperation)* {
      return makeBinary(head, tail);
    }

UnaryOperator
  = "-"
  / "+"
  / "!"

UnaryOperation
  = operation:UnaryOperator __ operand:UnaryOperation {
    return {type: "Unary", location: location(), operator: operation, right: operand};
  }
  / PostfixOperation

PostfixOperation
  = base:Operand
    args:(
     __ "(" __ expressions:ExpressionList? __ ")" {
       return {type: "FunctionCall", location: location(), arguments: expressions };
     }
     / __ "." __ name:Identifier {
       return {type: "RecordAccess", location: location(), field: name };
     }
     / __ "[" __ expression:Expression __ "]" {
       return {type: "ArrayAccess", location: location(), index: expression};
     }
    )* {
      if (args.length==0) return base;

      var result = {
          type: "Postfix",
          location: location(),
          base: base,
          operationList: []
        };
      for (var i = 0; i < args.length; i++) {
        result.operationList.push(args[i]);
      }
      return result;
    }
  / "(" __ exp:Expression __ ")" {
      return exp;
    }
  / Operand

TypeList
  = head:TypeValue
    tail:(__ "," __ TypeValue)* {
      return makeList([head], tail, 3);
    }

IdList
  = head:Identifier
    tail:(__ "," __ Identifier)* {
      return makeList([head], tail, 3);
    }

ExpressionList
  = head:Expression
    tail:(__ "," __ Expression)* {
      return makeList([head], tail, 3);
    }

/*  Operands    */

Operand
  = LetExpression
  / LoopExpression
  / IfExpression
  / OldToken __ name:Identifier {return {type: "Old", location: location(), id: name}}
  / CompositeValue
  / Triplet
  / Identifier
  / Literal

/* Compound expressions */

LetExpression
  = LetToken __ definitions:DefinitionList InToken __ expressions:ExpressionList __ EndToken __ LetToken __ {
      return {type: "Let", location: location(), definitions: definitions, expressions: expressions };
    }

TopFunctionDefinitionList
  = head:FunctionValue
    tail:(__ FunctionValue)* {
      return makeList([head], tail, 1);
    }

DefinitionList
  = head:Definition
    tail:(__ ";" __ Definition)* {
      return makeList([head], tail, 3);
    }

Definition
  = left:LValue __ ":=" __ right:ExpressionList {
    return {type: "Definition", location: location(), left: left, right: right};
  }

LValue
  = head:Identifier
    tail:(__ "," __ Identifier)* {
      return makeList([head], tail, 3);
    }

IfExpression
  = IfToken __ condition:Expression __ ThenToken __ thenBranch:ExpressionList __
    elseIfs:(ElseIfs)? elseBranch:(ElseToken __ ExpressionList __)? EndToken __ IfToken __ {
    return {
      type: "If",
      location: location(),
      condition: condition,
      thenBranch: thenBranch,
      elseIfs: elseIfs ? elseIfs : [],
      elseBranch: elseBranch ? elseBranch[2] : []
    };
  }

ElseIfs
  = head:ElseIf
    tail:( ElseIf )* {
      return makeList([head], tail, 1);
    }

ElseIf
  = ElseIfToken __ condition:Expression __ ThenToken __ branch:ExpressionList __ {
    return {
      type: "ElseIf",
      location: location(),
      condition: condition,
      branch: branch
    };
  }

/* TODO: Case Expression */

Reduction
  = name:Identifier __ OfToken __ returns:Expression __ {
    return {
      type: "Reduction",
      location: location(),
      name: name,
      expression: returns
    }
  }

ReductionList
  = head:Reduction
    tail:( ";" __ Reduction)* {
      return makeList([head], tail, 2);
    }

LoopExpression
  = ForToken __
    range:RangeGenerator?
    init:LoopInit?
    preCondition:LoopCondition?
    (RepeatToken __)?
    (DoToken __)?
    body:DefinitionList?
    postCondition:LoopCondition? __
    ReturnsToken __ reductions:ReductionList EndToken __ ForToken __ {
    return {
      type: "Loop",
      location: location(),
      range: range,
      init: init ? init : [],
      preCondition: preCondition,
      postCondition: postCondition,
      body: body ? body : [],
      reductions: reductions
    };
  }

LoopCondition
  = WhileToken __ expression:Expression __ {
    return expression;
  }

LoopInit
  = LetToken __ definitions:DefinitionList {
    return definitions;
  }

RangeGenerator
  = names:LValue __ InToken __ ranges:ExpressionList __ {
    return {type: "RangeList", location: location(), names: names, ranges: ranges };
  }
