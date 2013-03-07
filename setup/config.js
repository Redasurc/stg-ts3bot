var program = require('commander');

program
  .version('0.0.1')
  .option('-d, --default', 'Use default settings')
  .parse(process.argv);
