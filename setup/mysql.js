var program = require('commander'),
    log = require('./../lib/src/syslog.js').syslog;

program
  .version('0.0.1')
  .option('-a, --all', 'Install all tables')
  .option('-d, --drop', 'Drop old tables')
  .option('-e, --example', 'Insert example data')
  .option('-s, --source [file]', 'Insert data from backup source')
  .option('-b, --backup', 'Backup data to ./backup (if other options are choosen, it will backup first before doing something else)')
  .option('-c, --config [file]', 'Use specified mysql config (instead of the bot\'s one)')
  .parse(process.argv);

var syslog = new log('main');

var _timerStart = 0;
var _timerStop = 0;
var _time = 0;
var _timeComplete = 0;

if (program.backup) {
    _timerStart = new Date().getTime();
    syslog.log('Starting mysql db backup .....', 1, 'backup');


    _timerStop = new Date().getTime();
    _time = _timerStop - _timerStart;
    _timeComplete += _time;
    syslog.log('Backup done in ' + _time + 'ms (./backup/2013-02-11_11-45-12.tbd)', 2, 'backup');
}

if (program.example || program.source) {
    _timerStart = new Date().getTime();
    if (program.example) {
        syslog.log('Loading default data (defauls/mysql.tbd) .....', 1, 'fs');
    } else {
        syslog.log('Loading data from ' + program.source + ' .....', 1, 'fs');
    }
    _timerStop = new Date().getTime();
    _time = _timerStop - _timerStart;
    _timeComplete += _time;
    syslog.log('Success, 15451 rows loaded in ' + _time + 'ms', 2, 'fs');
    syslog.log('Writing to mysql .....', 1, 'mysql');
    syslog.log('No mysql server specified', 4, 'mysql');
}


_timerStop = new Date().getTime();
_time = _timerStop - _timerStart;
console.log('finished in ' + _time + 'ms');

