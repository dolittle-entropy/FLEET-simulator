// Copyright (c) the FLEET project. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information

import { driver, executeQuery } from "./src/graph/dbconn";
import { createMockupGraph } from "./src/graph/mockup-graph";
import { listAllDeployments } from "./src/graph/view"
import { getArtefactsWithIssues, getNearestIssues } from "./src/graph/issues"
import { getActiveArtefactVersionsAt, getUsedArtefactVersions } from "./src/graph/artefacts";
import { newDeployment } from "./src/graph/revise";
import { pageRank } from "./src/graph/graph-algo";


console.log('Main entrance');

async function testDeployment(){
    return await newDeployment("2.0", {artefact: "ThirdArtefact", version: "2.0"});
}

(async()=>{
    let testContent = await executeQuery("match (a) return a")
    if(testContent.length === 0){
        console.log("Empty database, create mockup graph...")
        await createMockupGraph()
    }
    
    // let result = await getNearestIssues('SecondArtefact', '1.0')
    // let result = await getUsedArtefactVersions()
    // let result = await getActiveArtefactVersionsAt('2021-02-02')
    // let result = await getArtefactsWithIssues()
    // let result = await testDeployment()
    // let result = await pageRank()
    // console.log(result)
    // await driver.close()
})()