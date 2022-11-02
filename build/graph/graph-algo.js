"use strict";
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
exports.pageRank = exports.projectDeployGraph = void 0;
const dbconn_1 = require("./dbconn");
function projectDeployGraph() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, dbconn_1.executeQuery)('call gds.graph.drop("deploygraph") yield graphName');
        const query = `
        call gds.graph.project(
            "deploygraph", 
            ['Deployment', 'DeploymentInstance', 'RuntimeVersion', 'ArtifactVersion', 'Artifact', 'Customer'], 
            ['InstanceOf', 'UsesArtifact', 'VersionOf','DevelopedBy']
        )
    `;
        let result = yield (0, dbconn_1.executeQuery)(query);
        return result;
    });
}
exports.projectDeployGraph = projectDeployGraph;
/**
 * List the most "important" nodes (artefacts), which has most intensely used
 * by "important" deployments.
 * See: https://neo4j.com/docs/graph-data-science/current/algorithms/page-rank/
 * @returns node name (only applies to artefacts) and importance score
 */
function pageRank() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let projectResult = yield projectDeployGraph();
        }
        catch (e) {
            console.log(e);
        }
        let query = `
        CALL gds.pageRank.stream('deploygraph')
        YIELD nodeId, score
        RETURN gds.util.asNode(nodeId).name AS name, gds.util.asNode(nodeId).uid AS uid, score
        ORDER BY score DESC, name ASC
    `;
        let result = (0, dbconn_1.executeQuery)(query);
        return result;
    });
}
exports.pageRank = pageRank;
