import { Wit } from "./wit";

const token = "C4TBJ6SSYNA5GTU5SN2OQXP3AJG7JJI3";

const wit = new Wit(token);
wit.parse("red").then(console.log);
