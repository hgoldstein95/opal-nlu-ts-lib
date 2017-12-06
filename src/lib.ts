import {
    String,
    Literal,
    Record,
    Union,
    Entity,
    Runtype
} from "../lib/runtypes/src/index";

import { Response, Wit } from "./wit";

export const FreeText = (name: string) => Entity("free-text", name, String);
export const Keywords = (name: string, lits: string[]) => {
    return Entity("keywords", name, Union.apply(Union, lits.map(Literal)));
};
export const Trait = (name: string, ps: { [key: string]: Runtype<any> }) => {
    let recs = Object.keys(ps).map(x => {
        return Record({
            tag: Literal(x),
            data: ps[x]
        });
    });
    return Entity("trait", name, Union.apply(Union, recs));
};