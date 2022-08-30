const {program} = require("commander");
program
    .command('list', 'just list')
    .parse(process.argv)
