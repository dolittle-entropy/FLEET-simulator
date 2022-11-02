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
exports.getActiveArtefactVersionsAt = exports.getUsedArtefactVersions = void 0;
const dbconn_1 = require("./dbconn");
function getUsedArtefactVersions() {
    return __awaiter(this, void 0, void 0, function* () {
        let query = `
        match (a:Artefact)--(v:Version)--()--(dv:Version)--(dolittle:DolittleRuntime) 
        return a.name as artefact, v.label as version, dv.label as runtime-version
    `;
        let result = yield (0, dbconn_1.executeQuery)(query);
        return result;
    });
}
exports.getUsedArtefactVersions = getUsedArtefactVersions;
/**
 * Find artefacts that are active at a given date
 * @param date In the format of "YYYY-MM-DD"
 * @returns
 */
function getActiveArtefactVersionsAt(date) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `
        match (a: Artefact)--(v: Version)--(d)
        where d.created <= date($datepoint) and 
              ((d.retired is null) or (d.retired >= date($datepoint)))
        return a.name as artefact, v.label as version, d.number as deployment
    `;
        return yield (0, dbconn_1.executeQuery)(query, { datepoint: date });
    });
}
exports.getActiveArtefactVersionsAt = getActiveArtefactVersionsAt;
