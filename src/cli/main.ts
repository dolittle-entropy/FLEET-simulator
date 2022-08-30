#!/usr/bin/env ts-node

import {program} from "commander";
import { importReportFile, importReportFileNoReturn } from "../connector/parse-record";
import { getActiveArtefactVersionsAt, getUsedArtefactVersions } from "../graph/artefacts";
import { pageRank } from "../graph/graph-algo";
import { getArtefactsWithIssues } from "../graph/issues";
import { cleanup, createMockupGraph } from "../graph/util";

//const program = new Command();

program
    .name('main')
    .version('1.0.0')
    .command('artefact', 'handle artefacts')
    .command('list', 'just print list')
    
program.command('used-versions')
    .action(async (cmd)=>{
        console.log(await getUsedArtefactVersions())
    })

program.command('active-versions')
    .argument('<string>', 'when?')
    .action(async (date)=>{
        console.log(await getActiveArtefactVersionsAt(date))
    })

program.command('artefacts-with-issues')
    .action(async (date)=>{
        console.log(await getArtefactsWithIssues())
    })

program.command('page-rank')
    .action(async ()=>{
        console.log(await pageRank())
    })
   
program.command('clean')
    .action(cleanup)

program.command('mockup')
    .action(createMockupGraph)

program.command('import-file')
    .action(importReportFileNoReturn)
    
program.parseAsync(process.argv)


