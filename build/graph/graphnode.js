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
exports.extractNodes = exports.queryEdges = exports.simplifyEdge = exports.simplifyNode = exports.experiment = exports.queryCustomApp = void 0;
const neo4j_driver_core_1 = require("neo4j-driver-core");
const dbconn_1 = require("./dbconn");
function queryCustomApp() {
    return __awaiter(this, void 0, void 0, function* () {
        let query = `
        match (c:Customer)--(a:Application) 
        return c, a
    `;
        let result = yield (0, dbconn_1.executeQuery)(query);
        return result;
    });
}
exports.queryCustomApp = queryCustomApp;
function experiment() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield queryCustomApp();
        let allnodes = yield extractNodes(result);
        let alledges = (yield queryEdges(allnodes)).map((i) => i.edge[0]);
        let simplifedResult = {
            nodes: allnodes.map(i => simplifyNode(i)),
            edges: alledges.map((i) => simplifyEdge(i))
        };
        return simplifedResult;
    });
}
exports.experiment = experiment;
function simplifyNode(node) {
    var _a;
    return {
        id: (0, neo4j_driver_core_1.toNumber)(node.identity).toString(),
        title: `${(_a = node.properties.name) !== null && _a !== void 0 ? _a : node.properties.id}:${node.labels[0]}`
    };
}
exports.simplifyNode = simplifyNode;
function simplifyEdge(edge) {
    return {
        id: (0, neo4j_driver_core_1.toNumber)(edge.identity).toString(),
        source: (0, neo4j_driver_core_1.toNumber)(edge.start).toString(),
        target: (0, neo4j_driver_core_1.toNumber)(edge.end).toString()
    };
}
exports.simplifyEdge = simplifyEdge;
function queryEdges(nodes) {
    return __awaiter(this, void 0, void 0, function* () {
        let ids = nodes.map(i => (0, neo4j_driver_core_1.toNumber)(i.identity));
        let query = `
        with [${ids}] as nodeIds
        match (n) where ID(n) in nodeIds
        match (m) where ID(m) in nodeIds
        match p=(n)-[rels]-(m)
        return relationships(p) as edge
    `;
        let result = yield (0, dbconn_1.executeQuery)(query);
        return result;
    });
}
exports.queryEdges = queryEdges;
function extractNodes(root) {
    return __awaiter(this, void 0, void 0, function* () {
        let allnodes = [];
        try {
            if (('identity' in root) && ('labels' in root)) {
                return [root];
            }
            let leaves = [];
            if (Array.isArray(root)) {
                leaves = root;
            }
            else {
                leaves = Object.values(root);
            }
            let allPromises = leaves.map((i) => __awaiter(this, void 0, void 0, function* () {
                return extractNodes(i);
            }));
            let result = yield Promise.all(allPromises);
            result.forEach(i => { allnodes.push(...i); });
            return allnodes;
        }
        catch (e) {
            return [];
        }
    });
}
exports.extractNodes = extractNodes;
// function toNumber(integer: {low:number, high:number}){
//     let res = integer.high
//     for (let i = 0; i < 32; i++) {
//         res *= 2
//     }
//     return integer.low + res
// }
