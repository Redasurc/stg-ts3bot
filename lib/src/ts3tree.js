var events = require('events')
 , sys = require('sys')
 , clc = require('cli-color');

/* TODO:
	x Disconnect / Delete Event doens't fire :*(
*/
/**
  * Events that may occur:

		channelOrderChange
		channelNameChange
		channelAdded
		channelRemoved

		userConnected
		userDisconnected
		userSwitchedChannel
		userChangedName
  */
var ts3tree = function(ts3api, callback){
	var clients = {
		list: [],
		details: []
	};
	var channel = {
		order: [],
		details: []
	};
	var self = this;
	this.actualizeChannelTree = function(callback){
		ts3api.execute('channellist', function(object){
			var channels2 = {
				order: [],
				details: []
			}
			var emit = {
				orderChange: false,
				nameChange: [],
				addedChannel: [],
				removedChannel: []
			}
			var newObj = {};

			for(var i = 0; i < object.response.length; i++){
				//SETUP CHANNEL ORDER:
				channels2.order.push(object.response[i].cid);
				if(channels2.order[i] != channel.order[i]){
					emit.orderChange = true;
				}

				//Setup the Object itself
				newObj = {
					cid: object.response[i].cid,
					pid: object.response[i].pid,
					name: object.response[i].channel_name
				};

				//check for new/edited Channels
				if(!(newObj.cid in channel.details)){
					emit.addedChannel.push(newObj.cid);
				}else{
					if(channel.details[newObj.cid].name != newObj.name) emit.nameChange.push(newObj.cid);
					if(channel.details[newObj.cid].pid != newObj.pid) emit.orderChange = true;
				}
				channels2.details[newObj.cid] = newObj;
			}

			//Check for removed Channels
			for(var i = 0; i < channel.order; i++){
				if(!(channel.order[i].cid in channels2.details)){
					emit.removedChannel.push(channel.order[i].cid);
				}
			}
			//check for initial fill (doesn't trigger events when filling the list first time)
			if(channel.order.length != 0){
				//emit all event that occur
				if(emit.orderChange) self.emit('channelOrderChange');
				if(emit.nameChange.length != 0)	self.emit('channelNameChange', emit.nameChange);
				if(emit.addedChannel.length != 0) self.emit('channelAdded', emit.addedChannel);
				if(emit.removedChannel.length != 0) self.emit('channelRemoved', emit.removedChannel);
			}
			channel = channels2;
			channels2 = null;		//Trying to find the memory leak =)
			if(typeof callback == "function"){
				callback();
			}
		});
	}
	this.actualizeClientList = function(callback){
		ts3api.execute('clientlist', function(object){

			var clients2 = {
				list: [],
				details: []
			};
			var emit = {
				userConnected: [],
				userDisconnected: [],
				userSwitchedChannel: [],
				userChangedName: []
			}

			var newUsrObject = {}
			for(var i = 0; i < object.response.length; i++){
				newUsrObject = {
					clid: object.response[i].clid,
					channel: object.response[i].cid,
					cdbid: object.response[i].client_database_id,
					type: object.response[i].client_type,
					name: object.response[i].client_nickname
				}
				clients2.list.push(newUsrObject.clid);
				if(!(newUsrObject.clid in clients.details)){
					emit.userConnected.push(newUsrObject.clid);
				}else{
					// User switched Channel
					if(clients.details[newUsrObject.clid].channel != newUsrObject.channel){
						emit.userSwitchedChannel.push({clid: newUsrObject.clid, from: clients.details[newUsrObject.clid].channel, to: newUsrObject.channel});
					}
					// User Changed Name
					if(clients.details[newUsrObject.clid].name != newUsrObject.name){
						emit.userChangedName.push({clid: newUsrObject.clid, from: clients.details[newUsrObject.clid].name, to: newUsrObject.name});
					}
 				}
				clients2.details[newUsrObject.clid] = newUsrObject;
			}
			//Check for disconnected Clients
			for(var i = 0; i < clients.list; i++){
				if(!(clients.list[i].cid in clients2.details)){
					emit.userDisconnected.push(clients.list[i].cid);
				}
			}
			//check for initial fill (doesn't trigger events when filling the list first time)
			if(clients.list.length != 0){
				//emit all event that occur
				if(emit.userConnected.length != 0) self.emit('userConnected', emit.userConnected);
				if(emit.userDisconnected.length != 0)	self.emit('userDisconnected', emit.userDisconnected);
				if(emit.userSwitchedChannel.length != 0) self.emit('userSwitchedChannel', emit.userSwitchedChannel);
				if(emit.userChangedName.length != 0) self.emit('userChangedName', emit.userChangedName);
			}
			clients = clients2;
			clients2 = null;		//Trying to find the memory leak =)

			if(typeof callback == "function"){
				callback();
			}
		});
	}
	this.actualizeAll = function(callback){
		self.actualizeChannelTree(function(){
			self.actualizeClientList(function(){
				if(typeof callback == "function"){
					callback();
				}
			});
		});
	}
	self.actualizeAll(callback);
	this.getChannelIDByParent = function(pid){
		var ret = [];
		for(var i = 0; i < channel.order.length; i++){
			if(channel.details[channel.order[i]].pid == pid){
				ret.push(channel.order[i]);
			}
		}
		return ret;
	}
	this.getChannelPositionByCid = function(cid){
		var ret = [];
		for(var i = 0; i < channel.order.length; i++){
			if(channel.order[i] == cid){
				return i;
			}
		}
	}

	/**
	  * ClientFeatures
	  */
	this.getClientByChannel = function(cid){
		var ret = [];
		for(var i = 0; i < clients.list.length; i++){
			if(clients.details[clients.list[i]].channel == cid){
				ret.push(clients.details[clients.list[i]]);
			}
		}
		return ret;		
	}

	this.buildTree = function(offset, pid){
		if(typeof offset == 'undefined'){
			console.log("Tree:");
			offset = 0;
			pid = 0;
		}
		var currenstring = "";
		var cids = this.getChannelIDByParent(pid);
		for(var i = 0; i < cids.length; i++){
			currenstring = "";
			for(var j = 0; j <= offset; j++){
				currenstring += "   ";
			}
			currenstring += channel.details[cids[i]].name + ' (id: ' + cids[i] + ')';
			console.log(currenstring);
			self.buildClients(offset, cids[i]);
			self.buildTree(offset+1, cids[i]);
		}
	}
	this.buildClients = function(offset, cid){
		var currenstring = "";
		var clientlist = this.getClientByChannel(cid);
		for(var i = 0; i < clientlist.length; i++){
			currenstring = "";
			for(var j = 0; j <= offset; j++){
				currenstring += "   ";
			}
			currenstring += "    * ";
			currenstring += clientlist[i].name + ' (id: ' + clientlist[i].clid + ')';
			if(clientlist[i].type == 0){
				console.log(clc.cyan(currenstring));
			}else{
				console.log(clc.red(currenstring));
			}
		}
	}
}






/**
  * DEEP EQUALS for Objects:
  * (from: http://stackoverflow.com/questions/1068834/object-comparison-in-javascript)
  */

// Object.prototype.equals = function(x)
// {
//   var p;
//   for(p in this) {
//       if(typeof(x[p])=='undefined') {return false;}
//   }

//   for(p in this) {
//       if (this[p]) {
//           switch(typeof(this[p])) {
//               case 'object':
//                   if (!this[p].equals(x[p])) { return false; } break;
//               case 'function':
//                   if (typeof(x[p])=='undefined' ||
//                       (p != 'equals' && this[p].toString() != x[p].toString()))
//                       return false;
//                   break;
//               default:
//                   if (this[p] != x[p]) { return false; }
//           }
//       } else {
//           if (x[p])
//               return false;
//       }
//   }

//   for(p in x) {
//       if(typeof(this[p])=='undefined') {return false;}
//   }

//   return true;
// }


sys.inherits(ts3tree, events.EventEmitter);

exports.ts3tree = ts3tree;