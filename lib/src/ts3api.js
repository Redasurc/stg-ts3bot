var ts3sq = require('ts3sq')
 , binary = require('binary')
 , events = require('events')
 , sys = require('sys')
 , slog = require('./syslog.js').syslog;

function ts3api(ip, port, callback){
	events.EventEmitter.call(this);

	var self = this;
	var client;
	var syslog = new slog('ts3api');
	

	syslog.log('connecting to '+ ip + ':' + port, 5);
	client = new ts3sq.ServerQuery(ip, port);

	/**
	  * Functions
	  */

	/**
	  * Execute Serverquery command on Server
	  */
	this.execute = function(command, args, callback){
		var sqarguments = "";
		var sqparameters = "";
		if(typeof args == "function"){
			callback = args;
			args = [];
		}else{
			if(typeof args == 'object'){
				for(var b in args){
					if(b != "parameter"){
						sqarguments += b + "=" + escapeString(args[b]) + " ";
					}else{
						for(var c in args[b]){
							sqparameters += args[b][c] + " ";
						}
					}
				}
			}
		}
		if(validCommands.indexOf(command) > -1){
			client.execute(command + ' ' + sqarguments + sqparameters, function(element){
				if(element.err[0].id == 0){
					syslog.log('Command '+ command + ' executed successful', 2);
					if(typeof callback == "function"){
						callback(element, true);
					}
				}else{
					syslog.log(command + ' ' + sqarguments + sqparameters + ' command failed (ERROR id: ' + element.err[0].id + ' msg: ' + element.err[0].msg + ')', 4);
					if(typeof callback == "function"){
						callback(element, false);
					}
				}
			});
		}else{
			syslog.log('command ' + command + ' not found', 4);
			throw new Error('unknown Serverquery command');
		}
		return this;
	}
	this.setLogLvl = function(lvl){
		syslog.setLogLvl(lvl);
	}



	/**
	  * EVENTS:
	  */

	client.on('ready', function() {
		syslog.log('connection established', 2);
		self.emit('ready');
	});
	client.on('close', function(whyyy) {
		self.emit('close', whyyy);
	});

	client.on('error', function(error) {
		self.emit('error', error);
	});
	client.on('notify', function(object){
		switch(object.type){
			case 'notifytextmessage':
				self.emit('textmessage', object.body[0]);
				break;
			// case 'notrifyclientmoved':
			// 	console.log("ACHTUNG");
			// 	self.emit('clientmoved', object.body[0]);
			// 	break;
			default:
				self.emit('notrify', object);
				console.log(object);
				break;
		}
	});
	this.registerAllEvents = function(){
		self.execute('servernotifyregister', {event: 'server'});


		// Heavy Buggy so deactivated (no channel switch events :( 
        // self.execute('channellist', function(element, success) {
        // 	if(success){
	       //      for(i = 0; i < element.response.length; i++){
	       //      	console.log("subscribing channel" + i);
	       //          self.execute('servernotifyregister', [['id',element.response[i].cid],['event' , 'channel']], function(object){
	       //          	console.log(object);
	       //          });
	       //      }
	       //  }
        // });

		self.execute('servernotifyregister', {event: 'textchannel'});
        self.execute('servernotifyregister', {event: 'textserver'});
        self.execute('servernotifyregister', {event: 'textprivate'});
        syslog.log('registered all events', 5);
    }
    if(typeof callback == "function"){
    	callback();
    }

}

/**
  * Private Functions
  */

function escapeString(string) {			// from ts3sq module
	if(typeof string == 'string'){
		string = string.replace(/\u005C/g, '\u005C\u005C');	// escape \
		string = string.replace(/\u002F/g, '\u005C\u002F');	// escape /
		string = string.replace(/\u0020/g, '\u005C\u0073');	// escape " " (space)
		string = string.replace(/\u007C/g, '\u005C\u0070');	// escape |
		string = string.replace(/\u0007/g, '\u005C\u0061');	// escape Bell
		string = string.replace(/\u0008/g, '\u005C\u0062');	// escape Backspace
		string = string.replace(/\u000C/g, '\u005C\u0066');	// escape Formfeed
		string = string.replace(/\u000A/g, '\u005C\u006e');	// escape Newline
		string = string.replace(/\u000D/g, '\u005C\u0072');	// escape Carriage Return
		string = string.replace(/\u0009/g, '\u005C\u0074');	// escape Horizontal Tab
		string = string.replace(/\u000B/g, '\u005C\u0076');	// escape Vertical Tab
	}
	return string;
}



var validCommands = ['help', 'quit', 'login', 'logout', 'version', 'hostinfo', 'instanceinfo', 'instanceedit', 'bindinglist', 'use', 'serverlist', 'serveridgetbyport', 'serverdelete', 'servercreate', 'serverstart', 'serverstop', 'serverprocessstop', 'serverinfo', 'serverrequestconnectioninfo', 'serveredit', 'servergrouplist', 'servergroupadd', 'servergroupdel', 'servergroupcopy', 'servergrouprename', 'servergrouppermlist', 'servergroupaddperm', 'servergroupdelperm', 'servergroupaddclient', 'servergroupdelclient', 'servergroupclientlist', 'servergroupsbyclientid', 'servergroupautoaddperm', 'servergroupautodelperm', 'serversnapshotcreate', 'serversnapshotdeploy', 'servernotifyregister', 'servernotifyunregister', 'sendtextmessage', 'logview', 'logadd', 'gm', 'channellist', 'channelinfo', 'channelfind', 'channelmove', 'channelcreate', 'channeldelete', 'channeledit', 'channelgrouplist', 'channelgroupadd', 'channelgroupdel', 'channelgroupcopy', 'channelgrouprename', 'channelgroupaddperm', 'channelgrouppermlist', 'channelgroupdelperm', 'channelgroupclientlist', 'setclientchannelgroup', 'channelpermlist', 'channeladdperm', 'channeldelperm', 'clientlist', 'clientinfo', 'clientfind', 'clientedit', 'clientdblist', 'clientdbinfo', 'clientdbfind', 'clientdbedit', 'clientdbdelete', 'clientgetids', 'clientgetdbidfromuid', 'clientgetnamefromuid', 'clientgetnamefromdbid', 'clientsetserverquerylogin', 'clientupdate', 'clientmove', 'clientkick', 'clientpoke', 'clientpermlist', 'clientaddperm', 'clientdelperm', 'channelclientpermlist', 'channelclientaddperm', 'channelclientdelperm', 'permissionlist', 'permidgetbyname', 'permoverview', 'permget', 'permfind', 'permreset', 'privilegekeylist', 'privilegekeyadd', 'privilegekeydelete', 'privilegekeyuse', 'messagelist', 'messageadd', 'messagedel', 'messageget', 'messageupdateflag', 'complainlist', 'complainadd', 'complaindelall', 'complaindel', 'banclient', 'banlist', 'banadd', 'bandel', 'bandelall', 'ftinitupload', 'ftinitdownload', 'ftlist', 'ftgetfilelist', 'ftgetfileinfo', 'ftstop', 'ftdeletefile', 'ftcreatedir', 'ftrenamefile', 'customsearch', 'custominfo', 'whoami'];




sys.inherits(ts3api, events.EventEmitter);

exports.ts3api = ts3api;