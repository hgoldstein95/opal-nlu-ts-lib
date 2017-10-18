import * as rp from "request-promise";

export class Wit {
    constructor(private token: string) { }

    async parse(query: string): Promise<string> {
        const fmtQuery = encodeURIComponent(query);

        const result = await rp.get({
            url: "https://api.wit.ai/message?q=" + fmtQuery,
            headers: {
                "Authorization": "Bearer " + this.token
            }
        });

        return result;
    }
}
