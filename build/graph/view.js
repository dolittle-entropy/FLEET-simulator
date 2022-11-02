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
exports.listAllDeployments = void 0;
const dbconn_1 = require("./dbconn");
function listAllDeployments() {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `
        match (a:Artefact)--(v1:Version)--(d:Deployment)--(v2:Version)--(r:DolittleRuntime) 
        return a, v1, d, v2, r 
    `;
        return yield (0, dbconn_1.executeQuery)(query);
    });
}
exports.listAllDeployments = listAllDeployments;
