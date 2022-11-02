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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startTransaction = exports.executeCommandInTransaction = exports.executeCommand = exports.executeQuery = exports.driver = void 0;
const neo4j_driver_1 = __importDefault(require("neo4j-driver"));
exports.driver = neo4j_driver_1.default.driver('neo4j://neo4j', //'localhost' when not working on docker
neo4j_driver_1.default.auth.basic('neo4j', 'fleet'));
function executeQuery(query, parameters) {
    return __awaiter(this, void 0, void 0, function* () {
        let session = exports.driver.session();
        let result = yield session.run(query, parameters);
        session.close();
        return result.records.map(i => i.toObject());
    });
}
exports.executeQuery = executeQuery;
function executeCommand(query, parameters) {
    return __awaiter(this, void 0, void 0, function* () {
        let session = exports.driver.session();
        let result = yield session.run(query, parameters);
        session.close();
        // if(result.summary.updateStatistics['_stats']['nodesCreated']==0){
        //     console.log(result)
        //     console.log(result.summary.query.parameters)
        // }
        return result.summary.updateStatistics;
    });
}
exports.executeCommand = executeCommand;
function executeCommandInTransaction(trans, query, parameters) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield trans.run(query, parameters);
        return result.summary.updateStatistics;
    });
}
exports.executeCommandInTransaction = executeCommandInTransaction;
function startTransaction() {
    let session = exports.driver.session();
    return { session: session, trans: session.beginTransaction() };
}
exports.startTransaction = startTransaction;
