#!/usr/bin/env ts-node

import {program} from "commander";

//const program = new Command();
console.log('here')
program
    .name('artefact')
    .command('used', 'yet another')
    .action(
        (cmd)=>{console.log("test")}
    )
    .parseAsync(process.argv)
