// App.test.ts

import {app} from "./app"
import { request } from "http"

describe("GET /fetchall - fetch all countries", () => {
    it("Fetch All Request", async() => {
        const result = await request(app).get("/fetchAll");
    })
})