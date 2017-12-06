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

const FreeText = (name: string) => Entity("free-text", name, String);
const Keywords = (name: string, lits: string[]) => {
    return Entity("keywords", name, Union.apply(Union, lits.map(Literal)));
};
const Trait = (name: string, ps: { [key: string]: Runtype<any> }) => {
    let recs = Object.keys(ps).map(x => {
        return Record({
            tag: Literal(x),
            data: ps[x]
        });
    });
    return Entity("trait", name, Union.apply(Union, recs));
};

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

// ------- GENERATED CODE -------
type Msg = string;
type Time = "later" | "tomorrow";
type Send = { msg: Msg, time: Time };
type Intent = { tag: "Read", data: {} } | { tag: "Send", data: Send };

const RT_Msg = FreeText("Msg");
const RT_Time = Keywords("Time", ["later", "tomorrow"]);
const RT_Send = Record({ msg: RT_Msg, time: RT_Time });
const RT_Intent = Trait("Intent", { Read: Record({}), Send: RT_Send });
// ----- END GENERATED CODE -----

let resp: Response = {
    msg_id: "",
    _text: "",
    entities: {
        Msg: [{
            value: "hello world",
            confidence: 0.9
        }],
        Time: [{
            value: "later",
            confidence: 0.7
        }],
        Intent: [{
            value: "Send",
            confidence: 1.0
        }]
    }
};

function getValue(r: Response, e: string): any {
    return r.entities[e][0].value;
}

function parse<T>(rt: Runtype<any>, res: Response): T {
    switch (rt.reflect.tag) {
        case "entity": {
            switch (rt.reflect.strategy) {
                case "free-text":
                    return getValue(res, rt.reflect.name) as T;
                case "keywords":
                    return getValue(res, rt.reflect.name) as T;
                case "trait":
                    let val = getValue(res, rt.reflect.name);
                    
                default:
                    throw new Error("Failed parsing entity. Invalid strategy.");
            }
        }
        case "literal": {
            return <any>rt.reflect.value as T;
        }
        case "record": {
            let flds: any = rt.reflect.fields;
            Object.keys(flds).forEach(x => {
                flds[x] = parse(flds[x], res);
            });
            return flds as T;
        }
        default:
            throw new Error("Failed parsing response. Invalid type.")
    }
}

let ex: Time = parse(Record({ hello: Literal("hello") }), resp);
console.log(ex);
