var events = require('events')
 , sys = require('sys')
 , clc = require('cli-color');

 /**
  * Events that can occur:
		userConnected
		userDisconnected
		userSwitchedChannel
		userChangedName
		
		userToggledAway
		userToggledMicMute
		userToggledSoundMute
		userToggledInputHardware
		userToggledOutputHardware
		userToggledTalker
		userToggledChannelCommander
		userToggledPrioritySpeaker
		userToggledRecording

		userServergroupAdded
		userServergroupRemoved
		userChannelgroupChange
  */

  function ts3clients(ts3api, callback){
  	events.EventEmitter.call(this);
  	/**
  	  * Mapping of all identifiers to clid
  	  */
	var clientMap = {
		Iterator: [],	//numeric to clid
		dbId: [],		//dbId to clid-lists
		uId: [],		//uid to clid-lists
		channel: []	//cid to clid-lists
	};

	/**
	  * Common User Information
	  * {	id: '1', 
	  *		database_id: '508',
	  *		unique_identifier: 'LNPBfYnFdL5Gz94TRvmEj3OlwkE',
	  *		nickname: 'TeamSpeakUser', 
	  *		channel: '1',
	  *		type: '0',
	  *		status: {
	  *			away: '0',
	  *			away_message: undefined,
	  *			flag_talking: '0',
	  *			input_muted: '0',
	  *			output_muted: '0',
	  *			input_hardware: '1',		// 0 wenn kein input
	  *			output_hardware: '1',		// 0 wenn kein output
	  *			talk_power: '30',
	  *			is_talker: '0',
	  *			is_priority_speaker: '0',
	  *			is_recording: '0',
	  *			is_channel_commander: '0'
	  *		},
	  *		groups: {
	  *			servergroups: [6, 9, 12, 18, 19, 30, 36, 48, 49, 51, 89, 98], 
	  *			channel_group_id: '8',
	  *			channel_group_inherited_channel_id: '1'
	  *		},
	  *		ts3client: {
	  *			version: '3.0.9.2 [Build: 1351504843]',
	  *			platform: 'Windows',
	  *			client_country: undefined
	  *		},
	  *		times: {
	  *			idle_time: '633545',		//ms 
	  *			created: '1361468022',		// unix time
	  *			lastconnected: '1361974288' // unix time
	  *		}
	  *	}
	  */
	var clientInformation = [];
	var clientDetails = [];


	var self = this;

	/**
	  * Actualize the common Client Informations
	  */
	this.actualizeCommonInfo = function(callback){
		var _timerStart = new Date().getTime();
		var clientMapNew = {
			Iterator: [],
			dbId: [],
			uId: [],
			channel: []
		};

		var clientInformationNew = [];

		var emit = {
			userConnected: [],
			userDisconnected: [],
			userSwitchedChannel: [],
			userChangedName: [],
			userToggledAway: [],
			userToggledMicMute: [],
			userToggledSoundMute: [],
			userToggledInputHardware: [],
			userToggledOutputHardware: [],
			userToggledTalker: [],
			userToggledChannelCommander: [],
			userToggledPrioritySpeaker: [],
			userToggledRecording: [],
			userServergroupAdded: [],
			userServergroupRemoved: [],
			userChannelgroupChange: []
		}

		// Temp var for current user information
		var curInfo = {}
		// Temp var for current user object
		var curObj
		// Temp var for current ID
		var curId
		//get clientMap.Iterator from TS3Server
		ts3api.execute('clientlist', {parameter: ['-away', '-voice', '-times', '-groups', '-info', '-uid', '-icon', '-country']}, function(object){
			for(var i = 0; i < object.response.length; i++){
				curObj = object.response[i];
				curId = curObj.clid;
				curInfo =
					{	id: curObj.clid, 
						database_id: curObj.client_database_id,
						unique_identifier: curObj.client_unique_identifier,
						nickname: curObj.client_nickname, 
						channel: curObj.cid,
						type: curObj.client_type,
						status: {
							away: curObj.client_away,
							away_message: curObj.client_away_message,
							flag_talking: curObj.client_flag_talking,
							input_muted: curObj.client_input_muted,
							output_muted: curObj.client_output_muted,
							input_hardware: curObj.client_input_hardware,
							output_hardware: curObj.client_output_hardware,
							talk_power: curObj.client_talk_power,
							is_talker: curObj.client_is_talker,
							is_priority_speaker: curObj.client_is_priority_speaker,
							is_recording: curObj.client_is_recording,
							is_channel_commander: curObj.client_is_channel_commander
						},
						groups: {
							servergroups: curObj.client_servergroups.split(','), 
							channel_group_id: curObj.client_channel_group_id,
							channel_group_inherited_channel_id: curObj.client_channel_group_inherited_channel_id
						},
						ts3client: {
							version: curObj.client_version,
							platform: curObj.client_platform,
							client_country: curObj.client_country
						},
						times: {
							idle_time: curObj.client_idle_time,		//ms 
							created: curObj.client_created,		// unix time
							lastconnected: curObj.client_lastconnected // unix time
						}
					};

				// push in new arrays
				clientMapNew.Iterator.push(curId);
				if(typeof clientMapNew.dbId[curInfo.database_id] == "undefined"){
					clientMapNew.dbId[curInfo.database_id] = [];
				}
				clientMapNew.dbId[curInfo.database_id].push(curId);

				if(typeof clientMapNew.uId[curInfo.unique_identifier] == "undefined"){
					clientMapNew.uId[curInfo.unique_identifier] = [];
				}
				clientMapNew.uId[curInfo.unique_identifier].push(curId);

				if(typeof clientMapNew.channel[curInfo.channel] == "undefined"){
					clientMapNew.channel[curInfo.channel] = [];
				}
				clientMapNew.channel[curInfo.channel].push(curId);

				clientInformationNew[curId] = curInfo;

				/**
				  * Trigger Events
				  */
				{
					// New USER
					if(!(curId in clientInformation)){
						emit.userConnected.push(curId);
					}else{
					// ALREADY CONNECTED USER
						// User switched Channel
						if(clientInformation[curId].channel != curInfo.channel){
							emit.userSwitchedChannel.push({
								clid: curId, 
								from: clientInformation[curId].channel, 
								to: curInfo.channel });
						}

						// User Changed Name
						if(clientInformation[curId].name != curInfo.name){
							emit.userChangedName.push({
								clid: curId, 
								from: clientInformation[curId].name, 
								to: curInfo.name});
						}
						// Status change events
						{
		 					if(curInfo.status.away != clientInformation[curId].status.away){
		 						emit.userToggledAway.push({
									clid: curId, 
									status: curInfo.status.away});
		 					}
		 					if(curInfo.status.input_muted != clientInformation[curId].status.input_muted){
		 						emit.userToggledMicMute.push({
									clid: curId, 
									status: curInfo.status.input_muted});
		 					}
		 					if(curInfo.status.output_muted != clientInformation[curId].status.output_muted){
		 						emit.userToggledSoundMute.push({
									clid: curId, 
									status: curInfo.status.output_muted});
		 					}
		 					if(curInfo.status.input_hardware != clientInformation[curId].status.input_hardware){
		 						emit.userToggledInputHardware.push({
									clid: curId, 
									status: curInfo.status.input_hardware});
		 					}
		 					if(curInfo.status.output_hardware != clientInformation[curId].status.output_hardware){
		 						emit.userToggledOutputHardware.push({
									clid: curId, 
									status: curInfo.status.output_hardware});
		 					}
		 					if(curInfo.status.is_talker != clientInformation[curId].status.is_talker){
		 						emit.userToggledTalker.push({
									clid: curId, 
									status: curInfo.status.is_talker});
		 					}
		 					if(curInfo.status.is_channel_commander != clientInformation[curId].status.is_channel_commander){
		 						emit.userToggledChannelCommander.push({
									clid: curId, 
									status: curInfo.status.is_channel_commander});
		 					}
		 					if(curInfo.status.is_priority_speaker != clientInformation[curId].status.is_priority_speaker){
		 						emit.userToggledPrioritySpeaker.push({
									clid: curId, 
									status: curInfo.status.is_priority_speaker});
		 					}
		 					if(curInfo.status.is_recording != clientInformation[curId].status.is_recording){
		 						emit.userToggledRecording.push({
									clid: curId, 
									status: curInfo.status.is_recording});
		 					}
		 				}

		 				// Server Group Change
		 				{
		 					var x = curInfo.groups.servergroups;
		 					var y = clientInformation[curId].groups.servergroups;
		 					if(x.length >= y.length){
		 						var iy = 0;
			 					for(i = 0; i < x.length; i++){
			 						if(x[i] != y[iy]){
			 							if(x[i] < y[iy]){
			 								emit.userServergroupAdded.push({
												clid: curId, 
												gid: x[i]	 									
			 								});
			 							}else{
			 								emit.userServergroupRemoved.push({
												clid: curId, 
												gid: y[iy]	 									
			 								});		 	
			 								iy++;							
			 							}
			 						}else{
			 							iy++;
			 						}
			 					}	 						
		 					}else{
								var ix = 0;
			 					for(i = 0; i < y.length; i++){
			 						if(x[ix] != y[i]){
			 							if(x[ix] < y[i]){
			 								emit.userServergroupAdded.push({
												clid: curId, 
												gid: x[ix]		 									
			 								});
			 								ix++;
			 							}else{
			 								emit.userServergroupRemoved.push({
												clid: curId, 
												gid: y[i]		 									
			 								});		 								
			 							}
			 						}else{
			 							ix++;
			 						}
			 					}		 			 						
		 					}
		 				}

		 				// ChannelgroupChange
						if(clientInformation[curId].groups.channel_group_id != curInfo.groups.channel_group_id){
							emit.userChannelGroupChange.push({
								clid: curId, 
								from: clientInformation[curId].groups.channel_group_id, 
								to: curInfo.groups.channel_group_id});
						}	 				
	 				}
	 			}
			}
			//Check for disconnected Clients
			for(var i = 0; i < clientMap.Iterator.length; i++){
				if(!(clientMap.Iterator[i] in clientInformationNew)){
					emit.userDisconnected.push(clientMap.Iterator[i]);
				}
			}
			// Emit all Events
			{
				if(emit.userConnected.length != 0) self.emit('userConnected', emit.userConnected);
				if(emit.userDisconnected.length != 0)	self.emit('userDisconnected', emit.userDisconnected);
				if(emit.userSwitchedChannel.length != 0) self.emit('userSwitchedChannel', emit.userSwitchedChannel);
				if(emit.userChangedName.length != 0) self.emit('userChangedName', emit.userChangedName);
				if(emit.userToggledAway.length != 0) self.emit('userToggledAway', emit.userToggledAway);
				if(emit.userToggledMicMute.length != 0) self.emit('userToggledMicMute', emit.userToggledMicMute);
				if(emit.userToggledSoundMute.length != 0) self.emit('userToggledSoundMute', emit.userToggledSoundMute);
				if(emit.userToggledInputHardware.length != 0) self.emit('userToggledInputHardware', emit.userToggledInputHardware);
				if(emit.userToggledOutputHardware.length != 0) self.emit('userToggledOutputHardware', emit.userToggledOutputHardware);
				if(emit.userToggledTalker.length != 0) self.emit('userToggledTalker', emit.userToggledTalker);
				if(emit.userToggledChannelCommander.length != 0) self.emit('userToggledChannelCommander', emit.userToggledChannelCommander);
				if(emit.userToggledPrioritySpeaker.length != 0) self.emit('userToggledPrioritySpeaker', emit.userToggledPrioritySpeaker);
				if(emit.userToggledRecording.length != 0) self.emit('userToggledRecording', emit.userToggledRecording);
				if(emit.userServergroupAdded.length != 0) self.emit('userServergroupAdded', emit.userServergroupAdded);
				if(emit.userServergroupRemoved.length != 0) self.emit('userServergroupRemoved', emit.userServergroupRemoved);
				if(emit.userChannelgroupChange.length != 0) self.emit('userChannelgroupChange', emit.userChannelgroupChange);
			}

			//Set new arrays as current
			clientMap = clientMapNew;
			clientInformation = clientInformationNew;
			
			// callback
			var _timerStop = new Date().getTime();
			var _time = _timerStop - _timerStart;
			self.emit('actualized', _time);
			if(typeof callback == "function"){
				callback(_time);
			}
		});
	}
	this.getInfo = function(clid){
		return clientInformation[clid];
	}
}

sys.inherits(ts3clients, events.EventEmitter);

exports.ts3clients = ts3clients;