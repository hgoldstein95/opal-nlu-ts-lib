export type Decl =
    | { kind: "FreeText", tag: string }
    | { kind: "Keywords", tag: string, data: string[] }
    | { kind: "Trait", tag: string, data: [string, Ty][] }
    | { kind: "TyDec", tag: string, data: Ty };

export type Ty =
    | { kind: "Def", data: string }
    | { kind: "Lit", data: string }
    | { kind: "Rec", data: [string, Ty][] };
