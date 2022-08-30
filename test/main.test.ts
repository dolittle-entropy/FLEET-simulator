import { importReportFile } from "../src/connector/parse-record"
import { cleanup } from "../src/graph/util"

describe("main tests",  ()=>{
    it("All nodes were loaded", async ()=>{
        await cleanup()
        const result = await importReportFile()
        expect(result.nodesCreated).toEqual(105)
    })
})