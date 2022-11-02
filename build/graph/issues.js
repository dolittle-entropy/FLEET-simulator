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
exports.getArtefactsWithIssues = exports.getNearestIssues = void 0;
const dbconn_1 = require("./dbconn");
function getNearestIssues(artefact, version) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = `
        match (aretefact:Artefact {name: $artefact})--(version:Version {label:$version})-[*2..2]-(issue:Issue) 
        return issue
    `;
        let result = yield (0, dbconn_1.executeQuery)(query, {
            artefact: artefact,
            version: version
        });
        return result;
    });
}
exports.getNearestIssues = getNearestIssues;
function getArtefactsWithIssues() {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `
        match (artefact:Artefact)--(version:Version)--()--(issue:Issue)
        return artefact.name, version.label, issue.type, issue.time
    `;
        return yield (0, dbconn_1.executeQuery)(query);
    });
}
exports.getArtefactsWithIssues = getArtefactsWithIssues;
