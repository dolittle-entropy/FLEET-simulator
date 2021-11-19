// Copyright (c) the FLEET project. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information

import { driver } from "./src/graph/dbconn";
import { createMockupGraph } from "./src/graph/mockup-graph";
import { listAllDeployments } from "./src/graph/view"
import { getNearestIssues } from "./src/graph/issues"

console.log('Hello World!');

(async()=>{
    //await createMockupGraph()
    let result = await getNearestIssues('SecondArtefact', '1.0')
    console.log(result)
    await driver.close()
})()