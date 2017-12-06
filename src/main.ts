import { FreeText, Keywords, Trait } from "./lib";
import { Wit, Response } from "./wit";
import { Record } from "../lib/runtypes/src/index";

// ------- GENERATED CODE -------
type Msg = string;
type Time = "later" | "tomorrow";
type Set = { msg: Msg, time: Time };
type Intent = { tag: "Get", data: {} } | { tag: "Set", data: Set };

const RT_Msg = FreeText("Msg");
const RT_Time = Keywords("Time", ["later", "tomorrow"]);
const RT_Set = Record({ msg: RT_Msg, time: RT_Time });
const RT_Intent = Trait("Intent", { Get: Record({}), Set: RT_Set });
// ----- END GENERATED CODE -----

const token = "[TOKEN_HERE]";
const wit = new Wit(token);

wit.callAPI("hello world").then(resp => {
    let ex: Intent = wit.parse(RT_Intent, resp);
    console.log(ex);
});
