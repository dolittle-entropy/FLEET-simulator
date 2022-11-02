#!/usr/bin/env ts-node
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
const commander_1 = require("commander");
const parse_record_1 = require("../connector/parse-record");
const artefacts_1 = require("../graph/artefacts");
const graph_algo_1 = require("../graph/graph-algo");
const issues_1 = require("../graph/issues");
const util_1 = require("../graph/util");
//const program = new Command();
commander_1.program
    .name('main')
    .version('1.0.0')
    .command('artefact', 'handle artefacts')
    .command('list', 'just print list');
commander_1.program.command('used-versions')
    .action((cmd) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(yield (0, artefacts_1.getUsedArtefactVersions)());
}));
commander_1.program.command('active-versions')
    .argument('<string>', 'when?')
    .action((date) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(yield (0, artefacts_1.getActiveArtefactVersionsAt)(date));
}));
commander_1.program.command('artefacts-with-issues')
    .action((date) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(yield (0, issues_1.getArtefactsWithIssues)());
}));
commander_1.program.command('page-rank')
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log(yield (0, graph_algo_1.pageRank)());
}));
commander_1.program.command('clean')
    .action(util_1.cleanup);
commander_1.program.command('mockup')
    .action(util_1.createMockupGraph);
commander_1.program.command('import-file')
    .action(parse_record_1.importReportFileNoReturn);
// program.command('nodegraph')
//     .action(experiment)
commander_1.program.parseAsync(process.argv);
