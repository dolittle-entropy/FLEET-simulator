// Copyright (c) the FLEET project. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information

import { driver, executeQuery } from "./src/graph/dbconn";
import { createMockupGraph } from "./src/graph/mockup-graph";
import { listAllDeployments } from "./src/graph/view"
import { getNearestIssues } from "./src/graph/issues"
import { getActiveArtefactVersionsAt, getUsedArtefactVersions } from "./src/graph/artefacts";

console.log('Main entrance');

(async()=>{
    let testContent = await executeQuery("match (a) return a")
    if(testContent.length === 0){
        console.log("Empty database, create mockup graph...")
        await createMockupGraph()
    }
    
    // let result = await getNearestIssues('SecondArtefact', '1.0')
    // let result = await getUsedArtefactVersions()
    let result = await getActiveArtefactVersionsAt('2021-02-02')
    console.log(result)
    await driver.close()
})()