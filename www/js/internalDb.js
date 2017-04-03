'use strict';
app
  .factory('internalDb', function Api($location, $rootScope, $http, $q, Config) {
    var db = null;
    var dbName = "waywheels";
    var dbSize = 5 * 1024 * 1024;
    return {

      // Select the Database
      openDb:function(callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();
        if (window.navigator.simulator === true) {
            // For debugin in simulator fallback to native SQL Lite
            console.log("Use built in SQL Lite");
            db = window.openDatabase(dbName, "1.0", "Lottery User Manager", dbSize);
        } else {
            db = window.openDatabase(dbName, "1.0", "Lottery User Manager", dbSize);
        }
        var data = "Database Selected Successfully";
        deferred.resolve(data);
        return deferred.promise;
      },

      // Create the required tables
      createTable:function(callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();
        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS user_login (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,country_code text NOT NULL,phone INTEGER NOT NULL,first_name text,last_name text,email text,user_id INTEGER, date_time long,token text,status text)");
        });
        var data = "Table Created Successfully";
        deferred.resolve(data);
        return deferred.promise;
      },

      // Add loggedIn user to database
      addLogin:function(country_code, phone, user_id, first_name, last_name, email, token, status) {
        var deferred = $q.defer();
        var data = null;
        var onError = function(tx, err){
          console.log("An error has occured");
          console.log(err);
        };
        db.transaction(function(tx) {
            var addedOn = new Date();
            tx.executeSql("INSERT INTO user_login(country_code, phone, user_id, first_name, last_name, email, token, status) VALUES (?,?,?,?,?,?,?,?)", [country_code, phone, user_id, first_name, last_name, email, token, status],
                function(tx, r) {
                  data = r;
                },
          onError);
        });
        deferred.resolve(data);
        return deferred.promise;
      },
      
      updateLogin:function(user_id, status) {
        var deferred = $q.defer();
        var data = null;
        var onError = function(tx, err){
          console.log("An error has occured");
          console.log(err);
        };
        db.transaction(function(tx) {
            tx.executeSql("UPDATE user_login SET status = ? WHERE user_id = ?", [status, user_id],
                function(tx, r) {
                  data = r;
    			      },
          onError);
        });
        deferred.resolve(data);
        return deferred.promise;
      },

      // Add loggedIn user to database
      updateCurrentUser:function() {
        var deferred = $q.defer();
        var data = null;
        var render = function(tx, rs) {
      		if( rs.rows.length > 0 ){
      			data = rs.rows.item(0);
      		}
          deferred.resolve(data);
        };
        var onError = function(tx, err){
          console.log(err);
        };
        db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM user_login", [],
                render,
                onError);
        });
        return deferred.promise;
      },

      // Delete all entries from table
      deleteLoggedIn:function() {
        var deferred = $q.defer();
        var data = null;
        var onSuccess = function(tx, rs) {
          data = rs;
        };
        var onError = function(tx, err){
          console.log(err);
        };
        db.transaction(function(tx) {
            tx.executeSql("DELETE FROM user_login WHERE 1", [],
                onSuccess,
                onError);
        });
        deferred.resolve(data);
        return deferred.promise;
      }

    };
  });
