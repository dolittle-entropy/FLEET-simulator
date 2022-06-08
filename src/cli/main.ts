import {program} from "commander";
import { getActiveArtefactVersionsAt, getUsedArtefactVersions } from "../graph/artefacts";
import { pageRank } from "../graph/graph-algo";
import { getArtefactsWithIssues } from "../graph/issues";

//const program = new Command();

program
    .command('used-artefact', 'handle artefacts')
    
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
   
    
program.parse(process.argv)


