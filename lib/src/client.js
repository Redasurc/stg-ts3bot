var client = function(){

	/*
		{ loginname: 'Redasurc',
		  permissions: 4 }	//0 no permissions, 1 user, 2 mod, 3 admin, 4 superadmin
		  
	*/
	this.sysinfo: {},


	/*
		{ clid: '3',
		  cid: '8',
		  client_database_id: '2',
		  client_nickname: 'TeamSpeakUser',
		  client_type: '0' }
	*/
	this.ts3info: {},


	/*
		{ cid: '8',
		  client_idle_time: '166555',
		  client_unique_identifier: '1rtGbbudSzu5akdTEGWTvrS7RcI',
		  client_nickname: 'TeamSpeakUser',
		  client_version: '3.0.9.2 [Build: 1351504843]',
		  client_platform: 'Windows',
		  client_input_muted: '0',
		  client_output_muted: '0',
		  client_outputonly_muted: '0',
		  client_input_hardware: '1',
		  client_output_hardware: '1',
		  client_default_channel: undefined,
		  client_meta_data: undefined,
		  client_is_recording: '0',
		  client_login_name: undefined,
		  client_database_id: '2',
		  client_channel_group_id: '5',
		  client_servergroups: '6',
		  client_created: '1360689189',
		  client_lastconnected: '1361292636',
		  client_totalconnections: '19',
		  client_away: '0',
		  client_away_message: undefined,
		  client_type: '0',
		  client_flag_avatar: undefined,
		  client_talk_power: '75',
		  client_talk_request: '0',
		  client_talk_request_msg: undefined,
		  client_description: undefined,
		  client_is_talker: '0',
		  client_month_bytes_uploaded: '0',
		  client_month_bytes_downloaded: '0',
		  client_total_bytes_uploaded: '0',
		  client_total_bytes_downloaded: '0',
		  client_is_priority_speaker: '0',
		  client_nickname_phonetic: undefined,
		  client_needed_serverquery_view_power: '75',
		  client_default_token: undefined,
		  client_icon_id: '0',
		  client_is_channel_commander: '0',
		  client_country: undefined,
		  client_channel_group_inherited_channel_id: '8',
		  client_base64HashClientUID: 'nglleggnlljneldlljgkehfdbagfjdlolellefmc',
		  connection_filetransfer_bandwidth_sent: '0',
		  connection_filetransfer_bandwidth_received: '0',
		  connection_packets_sent_total: '168891',
		  connection_bytes_sent_total: '6950561',
		  connection_packets_received_total: '168891',
		  connection_bytes_received_total: '7411450',
		  connection_bandwidth_sent_last_second_total: '82',
		  connection_bandwidth_sent_last_minute_total: '83',
		  connection_bandwidth_received_last_second_total: '84',
		  connection_bandwidth_received_last_minute_total: '88',
		  connection_connected_time: '83652557',
		  connection_client_ip: '127.0.0.1' }
	*/
	this.ts3detailinfo: {}
}