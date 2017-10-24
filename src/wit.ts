import * as rp from "request-promise";
import { Decl, Ty } from "./lib";

export interface Entity {
    value: any;
    confidence: number;
}

export interface Response {
    msg_id: string;
    _text: string;
    entities: {
        [key: string]: Entity[];
    }
}

export class Wit {
    constructor(private token: string, private decls: Decl[]) { }

    async callAPI(query: string): Promise<Response> {
        const fmtQuery = encodeURIComponent(query);

        const result = await rp.get({
            url: "https://api.wit.ai/message?q=" + fmtQuery,
            headers: {
                "Authorization": "Bearer " + this.token
            }
        });

        return JSON.parse(result);
    }

    private walkTy(ty: Ty, res: Response): any {
        switch (ty.kind) {
            case "Def":
                let decl = this.decls.find((x) => x.tag == ty.data);
                if (!decl) throw new Error("Could not parse response.");
                return this.walkDecl(decl, res);
            case "Lit":
                return ty.data;
            case "Rec":
                let obj: any = {};
                ty.data.forEach((p) => {
                    obj[p[0]] = this.walkTy(p[1], res);
                });
                return obj;
        }
    }

    private walkDecl(decl: Decl, res: Response): any {
        switch (decl.kind) {
            case "FreeText":
                return res.entities[decl.tag][0].value;
            case "Keywords":
                return res.entities[decl.tag][0].value;
            case "Trait":
                let val = res.entities[decl.tag][0].value;
                let obj: any;
                let p = decl.data.find((p) => p[0] == val);
                if (p) {
                    obj = this.walkTy(p[1], res);
                }
                return { kind: val, data: obj };
            case "TyDec":
                return this.walkTy(decl.data, res);
        }
    }

    parse<T>(res: Response, tag: string): T {
        let decl = this.decls.find((x) => x.tag == tag);

        if (!decl) throw new Error("Could not parse response.");

        return <T>this.walkDecl(decl, res);
    }
}
