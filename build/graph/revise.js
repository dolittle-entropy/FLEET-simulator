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
exports.newDeployment = void 0;
const dbconn_1 = require("./dbconn");
function newDeployment(dlversion, ...artefacts) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = `
        match (:DolittleRuntime)--(dlv:Version {label: $dlv})
        match (:Artefact {name: $artefactName})--(v:Version {label: $artefactVersion})
        merge (dlv)<-[:RuntimeVersion]-(:Deployment {number: $dnumber, created: date($date)})-[:ArtefactVersion]->(v)
    `;
        let result = yield (0, dbconn_1.executeQuery)("match (a:Deployment) return count(a) as n");
        let total = result[0].n.low | 0;
        let mergeResult = yield (0, dbconn_1.executeCommand)(query, {
            artefactName: artefacts[0].artefact,
            artefactVersion: artefacts[0].version,
            dnumber: total,
            date: "2022-05-06",
            dlv: dlversion
        });
        //console.log(result)
        return mergeResult;
    });
}
exports.newDeployment = newDeployment;
