#!/usr/bin/env ts-node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
//const program = new Command();
console.log('here');
commander_1.program
    .name('artefact')
    .command('used', 'yet another')
    .action((cmd) => { console.log("test"); })
    .parseAsync(process.argv);
