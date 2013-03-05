var mysql         = require('mysql'),
    EventEmitter  = require('events').EventEmitter,
    Util          = require('util');

/**
  * Exports and other interheits
  */
module.exports = factory;
Util.inherits(dbHandler, EventEmitter);


/**
  * DB Handler for multiple DB Systems (pdo-like)
  * (should be a SQL system)
  */
function factory(){
    return new dbHandler();
}

function dbHandler(){
    var connection = null;

    /**
      * Connect to sql server
      */
    this.connect = function (host, user, pw, db) {
        if(connection !== null){
            //close connection if already connected to prevent multiple login
            this.close();
        }
        connection = mysql.createConnection({
            host     : 'localhost',
            user     : 'me',
            password : 'secret'
        });
    };

    /**
      * Query db ...
      */
    this.query = function (query, callback) {
        if(connection !== null){
            connection.query(query, callback);
        }else{
            throw new Error('no mysql connection - query not possible');
        }
    };

    /**
      * Close DB Connection
      */
    this.close = function () {
        connection.end();
        connection = null;
    };
}