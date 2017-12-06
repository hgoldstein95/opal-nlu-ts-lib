import {
    String,
    Literal,
    Record,
    Union,
    Union1,
    Union2,
    Entity,
    Runtype,
    Static
} from "../lib/runtypes/src/index";
import * as rp from "request-promise";

export interface ResponseEntity {
    value: any;
    confidence: number;
}

export interface Response {
    msg_id: string;
    _text: string;
    entities: {
        [key: string]: ResponseEntity[];
    }
}
export class Wit {
    constructor(private token: string) { }

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

    private getValue(r: Response, e: string): any {
        return r.entities[e][0].value;
    }

    public parse<T>(rt: Runtype<any>, res: Response): T {
        return rt.check(this._parse(rt, res)) as T;
    }

    private _parse(rt: Runtype<any>, res: Response): any {
        switch (rt.reflect.tag) {
            case "entity": {
                switch (rt.reflect.strategy) {
                    case "free-text":
                        return this.getValue(res, rt.reflect.name);
                    case "keywords":
                        return this.getValue(res, rt.reflect.name);
                    case "trait": {
                        let val = this.getValue(res, rt.reflect.name);
                        let typ = rt.reflect.typ;
                        if (typ.tag == "union") {
                            let alt = typ.alternatives.find(x => {
                                if (x.tag === "record") {
                                    let tag = x.fields.tag;
                                    if (tag.tag === "literal") {
                                        return tag.value == val;
                                    }
                                }
                                return false;
                            });
                            if (alt) {
                                return this._parse(alt, res);
                            }
                        }
                    }
                }
                return null;
            }
            case "literal": {
                return rt.reflect.value;
            }
            case "record": {
                let flds = rt.reflect.fields;
                let obj: any = {};
                Object.keys(flds).forEach(x => {
                    obj[x] = this._parse(flds[x], res);
                });
                return obj;
            }
            default:
                return null;
        }
    }
}
