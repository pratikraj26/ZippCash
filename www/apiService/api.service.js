'use strict';

app
  .factory('Api', function Api($location, $rootScope, $http, $q, Config) {

    var currentUser = {};
    // if($cookieStore.get('token')) {
    //   //currentUser = User.get();
    // }

    var showToast = function(message) {
      if(window.cordova) {

      }
    }

    return {

      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      login: function(user, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post(Config.apiBase, {
          email: user.email,
          password: user.password
        }).
        success(function(data) {
          $cookieStore.put('token', data.token);
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          this.logout();
          deferred.reject(err);
          return cb(err);
        }.bind(this));

        return deferred.promise;
      },

      /**
       * Sets access token and updates current user
       *
       * @param  {String} token - user token
       */
      updateUserAndToken: function(token) {
        $cookieStore.put('token', token);
      },

      /**
       * Delete access token and user info
       *
       * @param  {Function}
       */
      logout: function() {
        $cookieStore.remove('token');
      },
      /**
       * Send Verification Code
       *
       * @return {Boolean}
       */
       /**
        * Get next lottery details
        *
        * @return {object}
        */
       processRequest: function(data, callback) {
         var cb = callback || angular.noop;
         var deferred = $q.defer();
         $http.post(Config.apiBase, {
          data: data
         }).
         success(function(data) {
           deferred.resolve(data);
           return cb();
         }).
         error(function(err) {
           console.log (err );
           deferred.reject(err);
           return cb(err);
         }.bind(this));
         return deferred.promise;
       },
      sendVerificationCode: function(data, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();
        $http.post(Config.apiBase, {
    		  controller : 'user',
    		  action : 'sendVerificationCode',
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          country_code: data.country_code,
          country_name: data.country_name,
          phone: data.phone,
        }).
        success(function(data) {
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          deferred.reject(err);
          return cb(err);
        }.bind(this));
        return deferred.promise;
      },
      /**
       * Verify Verification Code
       *
       * @return {Boolean}
       */
      verifyVerificationCode: function(data, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post(Config.apiBase, {
    		  controller : 'user',
    		  action : 'verifyVerificationCode',
          phone: data.phone,
          country_code: data.country_code,
          verification_code: data.verification_code
        }).
        success(function(data) {
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          console.log (err );
          deferred.reject(err);
          return cb(err);
        }.bind(this));
        return deferred.promise;
      },
      /**
       * Get next lottery details
       *
       * @return {object}
       */
      getNextLottery: function(callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();
        $http.post(Config.apiBase, {
    		  controller : 'user',
    		  action : 'getNextLottery'
        }).
        success(function(data) {
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          console.log (err );
          deferred.reject(err);
          return cb(err);
        }.bind(this));
        return deferred.promise;
      },
      /**
       * Get next lottery details
       *
       * @return {object}
       */
      getCurrentUserBalance: function(data, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();
        console.log(data);
        $http.post(Config.apiBase, {
    		  controller : 'user',
    		  action : 'getCurrentUserBalance',
          user_id: data.user_id
        }).
        success(function(data) {
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          console.log (err );
          deferred.reject(err);
          return cb(err);
        }.bind(this));
        return deferred.promise;
      },
      /**
       * Get lottery list
       *
       * @return {object}
       */
      getLotteryList: function(data, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();
        $http.post(Config.apiBase, {
          controller : 'user',
          action : 'getLotteryList',
          count : data.count
        }).
        success(function(data) {
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          console.log (err );
          deferred.reject(err);
          return cb(err);
        }.bind(this));
        return deferred.promise;
      },
      /**
       * Get unread message count
       *
       * @return {object}
       */
      getUnreadMessageCount: function(data, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();
        $http.post(Config.apiBase, {
          controller : 'user',
          action : 'getUnreadMessageCount',
        }).
        success(function(data) {
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          console.log (err );
          deferred.reject(err);
          return cb(err);
        }.bind(this));
        return deferred.promise;
      },
      /**
       * Mark messages as read
       *
       * @return {object}
       */
      markMessageAsRead: function(data, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();
        $http.post(Config.apiBase, {
          controller : 'user',
          action : 'markMessageAsRead',
        }).
        success(function(data) {
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          console.log (err );
          deferred.reject(err);
          return cb(err);
        }.bind(this));
        return deferred.promise;
      },
      /**
       * Get message list
       *
       * @return {object}
       */
      getMessages: function(data, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();
        $http.post(Config.apiBase, {
    		  controller : 'user',
    		  action : 'getUserMessages',
          count : data.count
        }).
        success(function(data) {
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          console.log (err );
          deferred.reject(err);
          return cb(err);
        }.bind(this));
        return deferred.promise;
      },
      /**
       * Get ticket list
       *
       * @return {object}
       */
      getTicketList: function(data, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();
        $http.post(Config.apiBase, {
    		  controller : 'user',
    		  action : 'getTicketList',
          count : data.count
        }).
        success(function(data) {
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          console.log (err );
          deferred.reject(err);
          return cb(err);
        }.bind(this));
        return deferred.promise;
      },
      /**
       * Get lottery list
       *
       * @return {object}
       */
      getLotteryDetails: function(data, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();
        $http.post(Config.apiBase, {
    		  controller : 'user',
    		  action : 'getLotteryDetails',
          user_id : data.user_id,
          lottery_id : data.lottery_id
        }).
        success(function(data) {
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          console.log (err );
          deferred.reject(err);
          return cb(err);
        }.bind(this));
        return deferred.promise;
      },
      /**
       * Get lottery list
       *
       * @return {object}
       */
      getTicketDetails: function(data, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();
        $http.post(Config.apiBase, {
    		  controller : 'user',
    		  action : 'getTicketDetails',
          user_id : data.user_id,
          ticket_id : data.ticket_id
        }).
        success(function(data) {
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          console.log (err );
          deferred.reject(err);
          return cb(err);
        }.bind(this));
        return deferred.promise;
      },
      /**
       * Add Ticket Details
       *
       * @return {object}
       */
      addTicketDetails: function(data, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();
        $http.post(Config.apiBase, {
    		  controller : 'user',
    		  action : 'addTicketDetails',
          user_id : data.user_id,
          lottery_id : data.lottery_id,
          tickets : data.tickets
        }).
        success(function(data) {
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          console.log (err );
          deferred.reject(err);
          return cb(err);
        }.bind(this));
        return deferred.promise;
      },
      /**
       * Update Ticket Details
       *
       * @return {object}
       */
      updateTicketDetails: function(data, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();
        $http.post(Config.apiBase, {
    		  controller : 'user',
    		  action : 'updateTicketDetails',
          user_id : data.user_id,
          ticket_id : data.ticket_id,
          payment_status : data.payment_status,
          paid_on : data.paid_on,
          total_amount : data.total_amount,
          payment_transaction_id : data.payment_transaction_id,
          payment_response : data.payment_response,
          payment_client : data.payment_client,
          response_type : data.response_type
        }).
        success(function(data) {
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          console.log (err );
          deferred.reject(err);
          return cb(err);
        }.bind(this));
        return deferred.promise;
      },
      /**
       * Update Profile Photo
       *
       * @return {Boolean}
       */
      updateProfilePhoto: function(user, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();
        var now = moment();

        $http.post(Config.apiBase, {
    		  controller : 'user',
    		  action : 'updateProfilePhoto',
		      image_url: user.image_file,
          date_time : now
        }).
        success(function(data) {
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          console.log (err );
          deferred.reject(err);
          return cb(err);
        }.bind(this));
        return deferred.promise;
      },
      /**
       * Get User Details
       *
       * @return {Object}
       */
      getUserDetails: function(user, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();
        var now = moment();

        $http.post(Config.apiBase, {
    		  controller : 'user',
    		  action : 'getUserDetails',
		      dialing_code: user.dialing_code,
          mobile_number: user.mobile_number
        }).
        success(function(data) {
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          console.log (err );
          deferred.reject(err);
          return cb(err);
        }.bind(this));
        return deferred.promise;
      },
      /**
       * Get User Details
       *
       * @return {Object}
       */
      getUserDetailsById: function(user, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();
        var now = moment();
        $http.post(Config.apiBase, {
    		  controller : 'user',
    		  action : 'getUserDetailsById',
		      UserId: user.UserId
        }).
        success(function(data) {
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          console.log (err );
          deferred.reject(err);
          return cb(err);
        }.bind(this));
        return deferred.promise;
      },
      /**
       * Update User Details
       *
       * @return {Object}
       */
      updateUserDetails: function(user, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();
        var now = moment();
        $http.post(Config.apiBase, {
    		  controller : 'user',
    		  action : 'updateUserDetails',
		      UserId: user.UserId,
		      Name: user.Name,
		      Email: user.Email
        }).
        success(function(data) {
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          console.log (err );
          deferred.reject(err);
          return cb(err);
        }.bind(this));
        return deferred.promise;
      },
      /**
       * Get auth token
       */
      getToken: function() {
        return $cookieStore.get('token');
      }
    };
  });
