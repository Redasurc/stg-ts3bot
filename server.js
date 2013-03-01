var ts3apiClass = require('./lib/src/ts3api.js').ts3api;
var botconfig = require('./cfg/bot.js').config;
var Ts3clients = require('./lib/src/ts3clients.js').ts3clients;
var slog = require('./lib/src/syslog.js').syslog;

var syslog = new slog("main");
syslog.log("Bot gestarted", 5);
var ts3api = new ts3apiClass(botconfig.ts3.ip, botconfig.ts3.port);
ts3api.setLogLvl(botconfig.console.defaultloglvl);
var ownID = "";
var ts3clients = new Ts3clients(ts3api);
ts3api.on('ready', function() {
	ts3api.execute('login', {client_login_name: botconfig.ts3.loginname, client_login_password: botconfig.ts3.loginpassword}, function(object, success){
		if(success){
			ts3api.execute('use', {sid: 1});
			ts3api.execute('clientupdate', {client_nickname: botconfig.bot.name});
			ts3api.execute('whoami', function(object){
				ownID = object.response[0].client_id;
				if(botconfig.bot.channel != 0){
					ts3api.execute('clientmove', {clid: ownID, cid: botconfig.bot.channel});
				}
			});
			ts3api.registerAllEvents();
			ts3clients.actualizeCommonInfo(function(){
			});
			var a = function(){
	  		 	ts3clients.actualizeCommonInfo(function(){
	          		setTimeout(function(){
	          			a();
	          		}, 1000);
	         	});
	        };
	        a();
		}
	});
});
ts3clients.on('actualized', function(time){
	syslog.log('Refresh done in: '+ time + 'ms', 1, 'ts3clients');
});
ts3clients.on('userConnected', function(object){
	console.log('userConnected');
	console.log(object);
});
ts3clients.on('userDisconnected', function(object){
	console.log('userDisconnected');
	console.log(object);
});
ts3clients.on('userSwitchedChannel', function(object){
	console.log('userSwitchedChannel');
	console.log(object);
});
ts3clients.on('userChangedName', function(object){
	console.log('userChangedName');
	console.log(object);
});
ts3clients.on('userToggledAway', function(object){
	console.log('userToggledAway');
	console.log(object);
});
ts3clients.on('userToggledMicMute', function(object){
	console.log('userToggledMicMute');
	console.log(object);
});
ts3clients.on('userToggledSoundMute', function(object){
	console.log('userToggledSoundMute');
	console.log(object);
});
ts3clients.on('userToggledInputHardware', function(object){
	console.log('userToggledInputHardware');
	console.log(object);
});
ts3clients.on('userToggledOutputHardware', function(object){
	console.log('userToggledOutputHardware');
	console.log(object);
});
ts3clients.on('userToggledTalker', function(object){
	console.log('userToggledTalker');
	console.log(object);
});
ts3clients.on('userToggledChannelCommander', function(object){
	console.log('userToggledChannelCommander');
	console.log(object);
});
ts3clients.on('userToggledPrioritySpeaker', function(object){
	console.log('userToggledPrioritySpeaker');
	console.log(object);
});
ts3clients.on('userToggledRecording', function(object){
	console.log('userToggledRecording');
	console.log(object);
});
ts3clients.on('userServergroupAdded', function(object){
	console.log('userServergroupAdded');
	console.log(object);
});
ts3clients.on('userServergroupRemoved', function(object){
	console.log('userServergroupRemoved');
	console.log(object);
});
ts3clients.on('userChannelgroupChange', function(object){
	console.log('userChannelgroupChange');
	console.log(object);
});




// ts3api.on('textmessage', function(message){
// 	if(message.invokerid != ownID){
// 		 if(message.msg == "serverbot"){
//            	ts3api.execute('sendtextmessage', [['targetmode',1],['target', message.invokerid],['msg', botconfig.message.welcomefirsttime]]);
//         }else{
//         	console.log(message);
//         }
//          if(message.msg == "serverbot"){
//          	tree.actualizeAll(function(){
//           		tree.buildTree();
//          	});

//         }
// 	}
// });
