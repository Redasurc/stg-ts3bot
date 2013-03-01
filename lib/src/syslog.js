var clc = require('cli-color');

function constructor(sysname){
	var name = sysname;
	var loglvl = 0;
	var namelength = 10;
	this.log = function(msg, mode, from){
		if(mode >= loglvl){
			if(typeof from == "undefined"){
				var preString = clc.blueBright('  ' + escapeName(name) + ' ') + '- ';
			}else{
				var preString = clc.blueBright('  ' + escapeName(from) + ' ') + '- ';
			}
			switch(mode){
				case 1:
				case 5:
					preString += clc.cyan('[ INFO  ] ');
					break;
				case 2:
					preString += clc.green('[SUCCESS] ');
					break;
				case 3:
					preString += clc.yellow('[WARNING] ');
					break;
				case 4:
					preString += clc.red.bold('[ ERROR ] ');
					break;
				default:
					throw new Error('syslog lvl not defined');
			}
			preString += msg;
			console.log(preString);
		}
	}
	this.setLogLvl = function(lvl){
		if(lvl < 5 && lvl >= 0){
			this.log('loglvl changed to ' + lvl, 5);
			loglvl = lvl;
		}
		return this;
	}
	function escapeName(thisname){
		thisname += "            ";
		thisname = thisname.substr(0,namelength);
		return thisname;
	}
}

exports.syslog = constructor;