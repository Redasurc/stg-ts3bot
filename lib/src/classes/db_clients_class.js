var EventEmitter     = require('events').EventEmitter,
    Util             = require('util');

/**
  * Exports and other interheits
  */
module.exports = factory;
Util.inherits(dbClients, EventEmitter);

/**
  * Gather Clientdata out of Database
  * Param; {dbHandler} dbHandler A connected Handler for requests
  */
function factory(dbHandler){
    return new dbClients(dbHandler);
}

function dbClients(dbHandler){
    var db = dbHandler;
    /**
      * Simple iterator (key = i, value = dbId)
      */
    var iterator = [];  //necessary???

    /*
    dataScheme = {
        uid: 1,
        power: 4,
        rank: 1,
        games: {
            slot1: 33,
            slot2: 12,
            slot3: 11,
            slot4: 54,
            slot5: 1
        },
        tsUID: [
            'asdasdasdajsf9qrthaf=',
            'ajfkmfürsf9qrre248af='
        ]
    }
    */
    /**
      * clientInformations (key = dbId)
      */
    var clientdata = [];
    /**
      * Mapping for ts3UID's to bot_dbId's
      */
    var tsUIDMap = [];


    this.getInfoById = function (clId) {
        if (!(clId in clientdata)) {
            //dbQuery info
            //Map Data
            if (false) return null; //not found!
        }
        return clientdata[clId];
    };

    this.getInfoByUId = function (clId) {
        if (!(clId in tsUIDMap)) {
            //dbQuery UID
            //Map Data
        }
        this.getInfoById(queryID);  // TODO FINISH
    };
    /**
      * Reloads all data of selected target
      * Param: {number} target Which target to be adressed? 0 = clientdata, 1 = mapping
      * Param: {number} id Wich id should be refreshed (only for target 0)
      * Param: {function} cb The callback for the Reload
      */
    this.forceReload = function (target, id, cb){
        var _timerStart = new Date().getTime();
        if (target == 1) {
            var newTs3UIDMap = [];
            db.query("SELECT ts3uniqueID, uid FROM ts3uniqueID", function (err, rows, fields) {
                if (err) throw err;
                for(i = 0; i < rows.length; i++) {
                    newTs3UIDMap[rows[i].ts3uniqueID] = rows[i].uid;
                }

                ts3UIDMap = newTs3UIDMap;
                newTs3UIDMap = undefined;

                var _timerStop = new Date().getTime();
                var _time = _timerStop - _timerStart;

                cb(_time);
            });
        } else {
            if (typeof id != 'undefined') {
                var newClientdata = [];
                for(i = 0; i < iterator.length; i++){

                }
            } else {

            }
        }
    };
}


