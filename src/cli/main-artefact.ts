import {program} from "commander";

//const program = new Command();

program
    //.command('used')
    .action(
        (cmd)=>{console.log('tested')}
    )
    
program.parse(process.argv)
