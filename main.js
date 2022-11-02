"use strict";
// Copyright (c) the FLEET project. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbconn_1 = require("./src/graph/dbconn");
const mockup_graph_1 = require("./src/graph/mockup-graph");
const revise_1 = require("./src/graph/revise");
console.log('Main entrance');
function testDeployment() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, revise_1.newDeployment)("2.0", { artefact: "ThirdArtefact", version: "2.0" });
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    let testContent = yield (0, dbconn_1.executeQuery)("match (a) return a");
    if (testContent.length === 0) {
        console.log("Empty database, create mockup graph...");
        yield (0, mockup_graph_1.createMockupGraph)();
    }
    // let result = await getNearestIssues('SecondArtefact', '1.0')
    // let result = await getUsedArtefactVersions()
    // let result = await getActiveArtefactVersionsAt('2021-02-02')
    // let result = await getArtefactsWithIssues()
    // let result = await testDeployment()
    // let result = await pageRank()
    // console.log(result)
    // await driver.close()
}))();
