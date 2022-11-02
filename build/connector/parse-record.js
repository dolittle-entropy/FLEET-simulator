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
exports.importReportFileNoReturn = exports.importReportFile = exports.parseEntry = void 0;
const dbconn_1 = require("../graph/dbconn");
const fs_1 = require("fs");
const readline_1 = require("readline");
// import { lineByLine } from 'n-readlines'
const REPORT_FILE_PATH = './res/2022-08-04-dolittle-export-filtered-instances.ndjson';
var trans;
var transSession;
function cleanId(fullId) {
    return fullId.split(':')[1];
}
function parseCustomer(entry) {
    return __awaiter(this, void 0, void 0, function* () {
        const CREATE_CUSTOMER = `
        CREATE (c:Customer {name:$name, id:$id, uid:$uid})
    `;
        return (0, dbconn_1.executeCommandInTransaction)(trans, CREATE_CUSTOMER, Object.assign(Object.assign({}, entry.properties), { uid: entry.uid }));
    });
}
function parseApplication(entry) {
    return __awaiter(this, void 0, void 0, function* () {
        const CREATE_APPLICATION = `
        MATCH (c:Customer {uid: $cid})
        MERGE (a:Application {id: $id, name: $name, uid: $uid}) -[:OwnedBy]-> (c)
    `;
        return (0, dbconn_1.executeCommandInTransaction)(trans, CREATE_APPLICATION, Object.assign(Object.assign({}, entry.properties), { cid: entry.links.ownedBy, uid: entry.uid }));
    });
}
function parseEnvironment(entry) {
    return __awaiter(this, void 0, void 0, function* () {
        const CREATE_ENV = `
        MATCH (a:Application {uid: $aid})
        CREATE (e:Environment {uid: $uid, name: $name}) -[:EnvironmentOf]-> (a)
    `;
        return (0, dbconn_1.executeCommandInTransaction)(trans, CREATE_ENV, Object.assign(Object.assign({}, entry.properties), { aid: entry.links.environmentOf, uid: entry.uid }));
    });
}
function parseArtifact(entry) {
    return __awaiter(this, void 0, void 0, function* () {
        const CREATE_ART = `
        MATCH (c:Customer {uid: $cid})
        MERGE (a:Artifact {uid: $uid, id: $id, name: $name}) -[:DevelopedBy]-> (c)
    `;
        return (0, dbconn_1.executeCommandInTransaction)(trans, CREATE_ART, Object.assign(Object.assign({}, entry.properties), { cid: entry.links.developedBy, uid: entry.uid, name: entry.properties.id.split('-')[0] }));
    });
}
function parseArtifactVersion(entry) {
    return __awaiter(this, void 0, void 0, function* () {
        const CREATE_ART_V = `
        MATCH (o {uid: $oid})
        MERGE (a:ArtifactVersion {uid: $uid, name:$name}) -[:VersionOf]-> (o)
    `;
        return (0, dbconn_1.executeCommandInTransaction)(trans, CREATE_ART_V, Object.assign(Object.assign({}, entry.properties), { oid: entry.links.versionOf, uid: entry.uid }));
    });
}
function parseRuntimeVersion(entry) {
    return __awaiter(this, void 0, void 0, function* () {
        const CREATE_RT_V = `
        CREATE (v:RuntimeVersion {uid: $uid, name:$uid, major:$major, minor:$minor, patch:$patch})
    `;
        return (0, dbconn_1.executeCommandInTransaction)(trans, CREATE_RT_V, Object.assign(Object.assign({}, entry.properties), { uid: entry.uid }));
    });
}
function parseDeployment(entry) {
    return __awaiter(this, void 0, void 0, function* () {
        const CREATE_RT_V = `
        MATCH (av {uid:$usesArtifact})
        MATCH (rv {uid:$usesRuntime})
        MATCH (e {uid:$deployedIn})
        MERGE (d:Deployment {name:$id, uid: $uid, id:$id, created: datetime($created)})-[:DeployedIn]->(e) 
        MERGE (d)-[:UsesArtifact]->(av)
        MERGE (d)-[:UsesRuntime]->(rv)
    `;
        return (0, dbconn_1.executeCommandInTransaction)(trans, CREATE_RT_V, Object.assign(Object.assign(Object.assign({}, entry.properties), entry.links), { uid: entry.uid }));
    });
}
function parseArtifactConfiguration(entry) {
    return __awaiter(this, void 0, void 0, function* () {
        const CREATE_AC = `
        CREATE (v:ArtifactConfiguration {uid: $uid, hash:$hash})
    `;
        return (0, dbconn_1.executeCommandInTransaction)(trans, CREATE_AC, Object.assign(Object.assign({}, entry.properties), { uid: entry.uid }));
    });
}
function parseRuntimeConfiguration(entry) {
    return __awaiter(this, void 0, void 0, function* () {
        const CREATE_RC = `
        CREATE (v:RuntimeConfiguration {uid: $uid, hash:$hash})
    `;
        return (0, dbconn_1.executeCommandInTransaction)(trans, CREATE_RC, Object.assign(Object.assign({}, entry.properties), { uid: entry.uid }));
    });
}
function parseDeploymentInstance(entry) {
    return __awaiter(this, void 0, void 0, function* () {
        const CREATE_DEPLOY_INSTANCE = `
        MATCH (d {uid:$instanceOf})
        MATCH (ac {uid:$usesArtifactConfiguration})
        MATCH (rc {uid:$usesRuntimeConfiguration})
        MERGE (di:DeploymentInstance {name:$id, uid: $uid, id:$id, started: datetime($started)})-[:InstanceOf]->(d) 
        MERGE (di)-[:UsesArtifactConfiguration]->(ac)
        MERGE (di)-[:UsesRuntimeConfiguration]->(rc)
    `;
        return (0, dbconn_1.executeCommandInTransaction)(trans, CREATE_DEPLOY_INSTANCE, Object.assign(Object.assign(Object.assign({}, entry.properties), entry.links), { uid: entry.uid }));
    });
}
function parseEntry(entry) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (entry.type) {
            case "Customer": return parseCustomer(entry);
            case "Application": return parseApplication(entry);
            case "Environment": return parseEnvironment(entry);
            case "Artifact": return parseArtifact(entry);
            case "ArtifactVersion": return parseArtifactVersion(entry);
            case "RuntimeVersion": return parseRuntimeVersion(entry);
            case "Deployment": return parseDeployment(entry);
            case "ArtifactConfiguration": return parseArtifactConfiguration(entry);
            case "RuntimeConfiguration": return parseRuntimeConfiguration(entry);
            case "DeploymentInstance": return parseDeploymentInstance(entry);
            default: return;
        }
    });
}
exports.parseEntry = parseEntry;
function importReportFile() {
    return __awaiter(this, void 0, void 0, function* () {
        const content = (0, fs_1.createReadStream)(REPORT_FILE_PATH);
        const reader = (0, readline_1.createInterface)(content);
        let results = [];
        let transPair = (0, dbconn_1.startTransaction)();
        transSession = transPair.session;
        trans = transPair.trans;
        reader.on("line", (l) => __awaiter(this, void 0, void 0, function* () {
            let entry = JSON.parse(l);
            yield Promise.all(results);
            results.push(parseEntry(entry));
        }));
        reader.on('close', () => __awaiter(this, void 0, void 0, function* () {
            // console.log('All records are read')
            let finalResults = yield Promise.all(results);
            yield trans.commit();
            transSession.close();
            // console.log(finalResults[26])
            let filteredResults = finalResults.filter(i => typeof (i) == 'object' && '_stats' in i);
            let nodesCreated = filteredResults.reduce((accumulator, i) => { return accumulator + i['_stats']['nodesCreated']; }, 0);
            let relationshipsCreated = filteredResults.reduce((accumulator, i) => { return accumulator + i['_stats']['relationshipsCreated']; }, 0);
            console.log(`${nodesCreated} nodes and ${relationshipsCreated} relationships created`);
            // let index = 0
            // finalResults.forEach(i => {
            //     if(index > 1200) return
            //     if (typeof(i) != 'object' || !('_stats' in i ) || i['_stats']['nodesCreated']==0){
            //         console.log(i)
            //         console.log(index)
            //         index = index + 1000
            //     }
            //     index = index + 1
            // })
            return { nodesCreated: nodesCreated, relationshipCreated: relationshipsCreated };
        }));
        return { nodesCreated: 0, relationshipsCreated: 0 }; //This is wrong. Always return 0.0
        // const results = lines.map(e => parseLine(JSON.parse(e)))
    });
}
exports.importReportFile = importReportFile;
function importReportFileNoReturn() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield importReportFile();
        // console.log(`${result.nodesCreated} nodes and ${result.relationshipsCreated} relationships created`)
    });
}
exports.importReportFileNoReturn = importReportFileNoReturn;
