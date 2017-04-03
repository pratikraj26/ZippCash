app

.controller('InitCtrl', function ($scope, $rootScope, $stateParams, $state, $ionicLoading, $ionicModal, $q, internalDb, Api) {
  $scope.$on( "$ionicView.enter", function( scopes, states ){
    $ionicLoading.show({
        template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
    });
    if($rootScope.initExecuted){
      $ionicLoading.hide();
      if($rootScope.loggedIn){
        if($rootScope.currentUser.status === 'Active'){
          $state.go("app.home");
        }else{
          $rootScope.setPasscode();
        }
      }else if( localStorage.getItem('phone') != undefined && localStorage.getItem('country_code') != undefined){
        $state.go("index");
      }else{
        $state.go("index");
      }
    }
  });
  $rootScope.currentUser = null;
  $rootScope.securePasscode = null;
  $rootScope.securePasscodeLength = 0;
  $rootScope.passcodeVerified = false;
  $rootScope.passcodeError = null;
  $rootScope.token = null;
  $rootScope.loggedIn = false;
  $rootScope.isOnline = true;
  $rootScope.initExecuted = true;
  $ionicLoading.show({
      template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
  });

  $ionicModal.fromTemplateUrl('templates/passcode-set.html', {
    scope: $rootScope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $rootScope.modal = modal;
  });
  $rootScope.setPasscode = function() {
    $rootScope.modal.show();
  };
  $rootScope.getPasscode = function() {
    $rootScope.getPasscodeModal.show();
  };
  $rootScope.closeModal = function() {
    $rootScope.modal.hide();
  };
  // Cleanup the modal when we're done with it!
  $rootScope.$on('$destroy', function() {
    $rootScope.modal.remove();
  });

  $rootScope.updatePasscode = function(){
    if($rootScope.securePasscode.toString().length === 4){
      $rootScope.updatePasscodeProgress = true;
      var data = {
        controller: 'user',
        action: 'updatePasscode',
        user_id : $rootScope.currentUser.user_id,
        passcode: $rootScope.securePasscode
      }
      if( $rootScope.isOnline ){
        Api.processRequest(data)
        .then( function(response){
          $rootScope.updatePasscodeProgress = false;
          if( response.success != undefined && response.success == true ){
              internalDb.updateLogin($rootScope.currentUser.user_id, "Active")
              .then(function(data){
                internalDb.updateCurrentUser()
                .then(function(data){
                  $rootScope.updatePasscodeProgress = true;
                  $rootScope.securePasscode = null;
                  $rootScope.securePasscodeLength = 0;
                  $ionicLoading.hide();
                  $rootScope.checkingLoggedIn = false;
                  if(data != null){
                    $rootScope.currentUser = data;
                    $rootScope.token = data.token;
                    $rootScope.loggedIn = true;
                    $rootScope.securePasscode = null;
                    $rootScope.closeModal();
                    $state.go("app.home");
                    // $rootScope.setPasscode();
                  }else{
                    $state.go("init");
                  }
                });
              });
          } else {
            $rootScope.updatePasscodeProgress = true;
            $rootScope.securePasscode = null;
            $rootScope.securePasscodeLength = 0;
            $cordovaDialogs.alert(response.data, 'Error', 'Ok')
            .then(function() {
              // callback success
            });
          }
         })
         .catch( function(err) {
            $scope.error = err;
          });
      }else{
        $ionicLoading.hide();
        $scope.error = 'You are not connected to internet';
      }
    }
  }

  $rootScope.verifyPasscode = function(){
    var deferred = $q.defer();
    if($rootScope.securePasscode.toString().length === 4){
      $rootScope.updatePasscodeProgress = true;
      var data = {
        controller: 'user',
        action: 'verifyPasscode',
        user_id : $rootScope.currentUser.user_id,
        passcode: $rootScope.securePasscode
      }
      if( $rootScope.isOnline ){
        Api.processRequest(data)
        .then( function(response){
          $rootScope.updatePasscodeProgress = false;
          if( response.success != undefined && response.success == true ){
            $rootScope.passcodeVerified = true;
            $rootScope.securePasscode = null;
            $rootScope.securePasscodeLength = 0;
            $rootScope.getPasscodeModal.hide();
            deferred.resolve(response);
          } else {
            $rootScope.securePasscode = null;
            $rootScope.securePasscodeLength = 0;
            $rootScope.passcodeError = response.data;
            deferred.reject(response);
          }
        })
        .catch( function(err) {
          $rootScope.securePasscode = null;
          $rootScope.securePasscodeLength = 0;
          $rootScope.updatePasscodeProgress = false;
          $scope.error = err;
          $rootScope.passcodeError = err;
          deferred.reject(err);
        });
      }else{
        $ionicLoading.hide();
        $scope.error = 'You are not connected to internet';
      }
    }
    return deferred.promise;
  }

  $rootScope.setPasscodeDigit = function(digit){
    if($rootScope.securePasscode != null){
      if($rootScope.securePasscode.toString().length < 4){
        $rootScope.securePasscode = ($rootScope.securePasscode*10) + digit;
        $rootScope.securePasscodeLength++;
      }
    }else{
      $rootScope.securePasscode = digit;
      $rootScope.securePasscodeLength++;
    }
    console.log($rootScope.securePasscode);
  }


  internalDb.openDb()
  .then(function(data){
  });

  internalDb.createTable()
  .then(function(data){
  });

  internalDb.updateCurrentUser()
  .then(function(data){
    $ionicLoading.hide();
    $rootScope.checkingLoggedIn = false;
    if(data != null){
      if(data.user_id == undefined || data.phone == undefined || data.email == undefined || data.user_id == "undefined" || data.phone == "undefined" || data.email == "undefined"){
        internalDb.deleteLoggedIn()
        .then(function(data){
          $state.go("init");
        });
      }else{
        $rootScope.currentUser = data;
        $rootScope.token = data.token;
        $rootScope.loggedIn = true;
        if($rootScope.currentUser.status === 'Active'){
          $state.go("app.home");
        }else{
          $rootScope.setPasscode();
        }
      }
    }else{
      $state.go("index");
    }
  });
})

.controller('IndexCtrl', function ($scope, $rootScope, $state, $ionicModal, $ionicPopover, $timeout) {
  $scope.$on( "$ionicView.enter", function( scopes, states ){
    $scope.loading = true;
    if(!$rootScope.initExecuted){
      $state.go("init");
    }else if($rootScope.loggedIn){
      $state.go("app.home");
    }else{
      $scope.loading = false;
    }
  });
})

.controller('AppCtrl', function ($scope, $ionicModal, $ionicPopover, $timeout) {
    // Form data for the login modal
    $scope.loginData = {};

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function () {
            this.classList.toggle('active');
        });
    }

    var fab = document.getElementById('fab');
    if(fab != undefined){
      fab.addEventListener('click', function () {
          //location.href = 'https://twitter.com/satish_vr2011';
          window.open('https://twitter.com/satish_vr2011', '_blank');
      });
    }

    // .fromTemplate() method
    var template = '<ion-popover-view>' +
                    '   <ion-header-bar>' +
                    '       <h1 class="title">My Popover Title</h1>' +
                    '   </ion-header-bar>' +
                    '   <ion-content class="padding">' +
                    '       My Popover Contents' +
                    '   </ion-content>' +
                    '</ion-popover-view>';

    $scope.popover = $ionicPopover.fromTemplate(template, {
        scope: $scope
    });
    $scope.closePopover = function () {
        $scope.popover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.popover.remove();
    });
})

.controller('LoginCtrl', function ($scope, $rootScope, $state, $stateParams, $ionicLoading, $cordovaDialogs, IndexFactory, Api, internalDb) {
  $scope.loading = true;
  $scope.$on( "$ionicView.enter", function( scopes, states ){
    $scope.loading = true;
    if(!$rootScope.initExecuted){
      $state.go("init");
    }else if($rootScope.loggedIn){
      $state.go("app.home");
    }else{
      $scope.authenticateUserProgress = false;
      $scope.loading = false;
    }
  });

  $scope.selectedCountry = {}
  $scope.countries = {};
  $scope.error = '';
  IndexFactory.getCountries( $scope )
  .then( function(data){
    $scope.loading = false;
  });
  $scope.data = {};

  $scope.authenticateUser = function(){
    $scope.authenticateUserProgress = true;
    var data = {
      controller: 'user',
      action: 'authenticateUser',
      email : $scope.data.email,
      password: $scope.data.password
    }

    if( $rootScope.isOnline ){
      Api.processRequest(data)
      .then( function(response){
        console.log(response);
        $scope.authenticateUserProgress = false;
        if( response.success != undefined && response.success == true ){
          var phone = response.data.phone;
          var country_code = response.data.country_code;
          var user_id = response.data.user_id;
          var first_name = response.data.first_name;
          var last_name = response.data.last_name;
          var email = response.data.email;
          var token = response.token;
          if(response.data.passcode === null){
            var status = "Pending"
          }else{
            var status = "Active"
          }

          internalDb.addLogin(country_code, phone, user_id, first_name, last_name, email, token, status)
          .then(function(data){
            internalDb.updateCurrentUser()
            .then(function(data){
              $ionicLoading.hide();
              $rootScope.checkingLoggedIn = false;
              if(data != null){
                if(data.user_id == undefined || data.phone == undefined || data.email == undefined || data.user_id == "undefined" || data.phone == "undefined" || data.email == "undefined"){
                  internalDb.deleteLoggedIn()
                  .then(function(data){
                    $state.go("init");
                  });
                }else{
                  $rootScope.currentUser = data;
                  $rootScope.token = data.token;
                  $rootScope.loggedIn = true;
                  $state.go("app.home");
                }
              }
            });
          });
        } else {
          $cordovaDialogs.alert(response.data, 'Error', 'Ok')
          .then(function() {
            // callback success
          });
        }
       })
       .catch( function(err) {
          $scope.error = err;
        });
    }else{
      $ionicLoading.hide();
      $scope.error = 'You are not connected to internet';
    }
  }

})

.controller('RegisterCtrl', function ($scope, $rootScope, $state, $stateParams, $ionicLoading, $cordovaDialogs, IndexFactory, Api) {
  $scope.loading = true;
  $scope.$on( "$ionicView.enter", function( scopes, states ){
    $scope.loading = true;
    if(!$rootScope.initExecuted){
      $state.go("init");
    }else if($rootScope.loggedIn){
      $state.go("app.home");
    }else if( localStorage.getItem('phone') != undefined && localStorage.getItem('country_code') != undefined){
      $scope.verifyPhoneNumberProgress = false;
      $scope.loading = false;
    }else{
      $scope.verifyPhoneNumberProgress = false;
      $scope.loading = false;
    }
  });

  $scope.selectedCountry = {}
  $scope.countries = {};
  $scope.error = '';
  IndexFactory.getCountries( $scope )
  .then( function(data){
    $scope.loading = false;
  });
  $scope.data = {};

  $scope.verifyPhoneNumber = function(){
    $scope.verifyPhoneNumberProgress = true;
    var data = {
      controller: 'user',
      action: 'sendVerificationCode',
      country_name : $scope.data.country.name,
      country_code : $scope.data.country.dial_code,
      first_name : $scope.data.first_name,
      last_name : $scope.data.last_name,
      phone : $scope.data.phone,
      password: $scope.data.password
    }

    if( $rootScope.isOnline ){
      Api.processRequest(data)
      .then( function(data){
        console.log(data);
        $scope.verifyPhoneNumberProgress = false;
        if( data.success != undefined && data.success == true ){
          window.localStorage.setItem('phone', $scope.data.phone);
          window.localStorage.setItem('country_code', $scope.data.country.dial_code);
          $state.go('verify');
        } else {
          $cordovaDialogs.alert(data.data, 'Error', 'Ok')
          .then(function() {
            // callback success
          });
        }
       })
       .catch( function(err) {
          $scope.error = err;
        });
    }else{
      $ionicLoading.hide();
      $scope.error = 'You are not connected to internet';
    }
  }

})

.controller('ForgetPassCtrl', function ($scope, $rootScope, $state, $stateParams, $ionicLoading, $cordovaDialogs, IndexFactory, Api) {
  $scope.loading = true;
  $scope.$on( "$ionicView.enter", function( scopes, states ){
    $scope.loading = true;
    if(!$rootScope.initExecuted){
      $state.go("init");
    }else if($rootScope.loggedIn){
      $state.go("app.home");
    }else if( localStorage.getItem('phone') != undefined && localStorage.getItem('country_code') != undefined){
      $scope.verifyPhoneNumberProgress = false;
      $scope.loading = false;
    }else{
      $scope.verifyPhoneNumberProgress = false;
      $scope.loading = false;
    }
  });

  $scope.selectedCountry = {}
  $scope.countries = {};
  $scope.error = '';
  IndexFactory.getCountries( $scope )
  .then( function(data){
    $scope.loading = false;
  });
  $scope.data = {};

  $scope.sendTempVerificationCode = function(){
    $scope.verifyPhoneNumberProgress = true;
    var data = {
      controller: 'user',
      action: 'sendTempVerificationCode',
      phone : $scope.data.phone
    }

    if( $rootScope.isOnline ){
      Api.processRequest(data)
      .then( function(data){
        console.log(data);
        $scope.verifyPhoneNumberProgress = false;
        if( data.success != undefined && data.success == true ){
          window.localStorage.setItem('phone', $scope.data.phone);
          $state.go('forget-password-verify');
        } else {
          $cordovaDialogs.alert(data.data, 'Error', 'Ok')
          .then(function() {
            // callback success
          });
        }
       })
       .catch( function(err) {
          $scope.error = err;
        });
    }else{
      $ionicLoading.hide();
      $scope.error = 'You are not connected to internet';
    }
  }

})

.controller('ForgetPassVerifyCtrl', function ($scope, $rootScope, $state, $stateParams, $ionicLoading, $cordovaDialogs, IndexFactory, Api) {
  $scope.loading = true;
  $scope.$on( "$ionicView.enter", function( scopes, states ){
    $scope.loading = true;
    if(!$rootScope.initExecuted){
      $state.go("init");
    }else if($rootScope.loggedIn){
      $state.go("app.home");
    }else if( localStorage.getItem('phone') != undefined && localStorage.getItem('country_code') != undefined){
      $scope.verifyVerificationCodeProgress = false;
      $scope.loading = false;
    }else{
      $scope.verifyVerificationCodeProgress = false;
      $scope.loading = false;
    }
  });

  $scope.selectedCountry = {}
  $scope.countries = {};
  $scope.error = '';
  IndexFactory.getCountries( $scope )
  .then( function(data){
    $scope.loading = false;
  });
  $scope.data = {};

  $scope.verifyTempVerificationCode = function(){
    $scope.verifyVerificationCodeProgress = true;
    var data = {
      controller: 'user',
      action: 'verifyTempVerificationCode',
      phone : localStorage.getItem('phone'),
      temp_verification_code: $scope.data.temp_verification_code
    }

    if( $rootScope.isOnline ){
      Api.processRequest(data)
      .then( function(data){
        console.log(data);
        $scope.verifyVerificationCodeProgress = false;
        if( data.success != undefined && data.success == true ){
          window.localStorage.setItem('temp_verification_code', $scope.data.temp_verification_code);
          $state.go('update-password');
        } else {
          $cordovaDialogs.alert(data.data, 'Error', 'Ok')
          .then(function() {
            // callback success
          });
        }
       })
       .catch( function(err) {
          $scope.verifyVerificationCodeProgress = false;
          $scope.error = err;
        });
    }else{
      $ionicLoading.hide();
      $scope.error = 'You are not connected to internet';
    }
  }

})
.controller('UpdatePassCtrl', function ($scope, $rootScope, $state, $stateParams, $ionicLoading, $cordovaDialogs, IndexFactory, Api) {
  $scope.loading = true;
  $scope.$on( "$ionicView.enter", function( scopes, states ){
    $scope.loading = true;
    if(!$rootScope.initExecuted){
      $state.go("init");
    }else if($rootScope.loggedIn){
      $state.go("app.home");
    }else if( localStorage.getItem('phone') != undefined && localStorage.getItem('country_code') != undefined){
      $scope.updatePasswordProgress = false;
      $scope.loading = false;
    }else{
      $scope.updatePasswordProgress = false;
      $scope.loading = false;
    }
  });

  $scope.selectedCountry = {}
  $scope.countries = {};
  $scope.error = '';
  IndexFactory.getCountries( $scope )
  .then( function(data){
    $scope.loading = false;
  });
  $scope.data = {};

  $scope.updatePassword = function(){
    $scope.updatePasswordProgress = true;
    if($scope.data.password === $scope.data.confirm_password){
      var data = {
        controller: 'user',
        action: 'updatePassword',
        phone : localStorage.getItem('phone'),
        temp_verification_code: localStorage.getItem('temp_verification_code'),
        password: $scope.data.password
      }

      if( $rootScope.isOnline ){
        Api.processRequest(data)
        .then( function(data){
          $scope.updatePasswordProgress = false;
          if( data.success != undefined && data.success == true ){
            $state.go('login');
          } else {
            $cordovaDialogs.alert(data.data, 'Error', 'Ok')
            .then(function() {
              // callback success
            });
          }
         })
         .catch( function(err) {
            $scope.updatePasswordProgress = false;
            $scope.error = err;
          });
      }else{
        $ionicLoading.hide();
        $scope.error = 'You are not connected to internet';
      }
    }
  }

})
.controller('ChangePassCtrl', function ($scope, $rootScope, $state, $stateParams, $ionicLoading, $cordovaDialogs, IndexFactory, Api) {
  $scope.loading = true;
  $scope.$on( "$ionicView.enter", function( scopes, states ){
    $scope.loading = true;
    $scope.error = false;

    if(!$rootScope.initExecuted){
      $state.go("init");
    }else if(!$rootScope.loggedIn){
      $state.go("register");
    }else{
      $scope.updatePasswordProgress = false;
      $scope.loading = false;
    }
  });

  $scope.selectedCountry = {}
  $scope.countries = {};
  $scope.error = '';
  IndexFactory.getCountries( $scope )
  .then( function(data){
    $scope.loading = false;
  });
  $scope.data = {};

  $scope.changePassword = function(){
    $scope.updatePasswordProgress = true;
    if($scope.data.password === $scope.data.confirm_password){
      var data = {
        controller: 'user',
        action: 'changePassword',
        phone : localStorage.getItem('phone'),
        current_password: $scope.data.current_password,
        password: $scope.data.password
      }

      if( $rootScope.isOnline ){
        Api.processRequest(data)
        .then( function(data){
          $scope.updatePasswordProgress = false;
          if( data.success != undefined && data.success == true ){
            $state.go('app.profile');
          } else {
            $cordovaDialogs.alert(data.data, 'Error', 'Ok')
            .then(function() {
              // callback success
            });
          }
         })
         .catch( function(err) {
            $scope.updatePasswordProgress = false;
            $scope.error = err;
          });
      }else{
        $ionicLoading.hide();
        $scope.error = 'You are not connected to internet';
      }
    }
  }

})

.controller('VerifyCtrl', function ($scope, $rootScope, $state, $stateParams, $ionicLoading, $cordovaDialogs, internalDb, Api) {
  $scope.loading = true;
  $scope.$on( "$ionicView.enter", function( scopes, states ){
    $scope.loading = true;
    if(!$rootScope.initExecuted){
      $state.go("init");
    }else if($rootScope.loggedIn){
      $state.go("app.home");
    }else if( localStorage.getItem('phone') == undefined || localStorage.getItem('country_code') == undefined ){
      $state.go("register");
    }else{
      $scope.verifyVerificationCodeProgress = false;
      $scope.loading = false;
    }
  });

  $scope.data = {};
  $scope.data.verification_code = '';

  $scope.verifyVerificationCode = function(){
    $scope.verifyVerificationCodeProgress = true;
    var data = {
      controller: 'user',
      action: 'verifyVerificationCode',
      phone : localStorage.getItem('phone'),
      country_code : localStorage.getItem('country_code'),
      verification_code : $scope.data.verification_code
    }

    if($rootScope.isOnline){
      Api.processRequest(data)
      .then( function(response){
        $scope.verifyVerificationCodeProgress = false;
        if( response.success != undefined && response.success == true ){
          $rootScope.currentUser = response.data;
          internalDb.deleteLoggedIn()
          .then(function(data){
            var phone = localStorage.getItem('phone');
            var country_code = localStorage.getItem('country_code');
            var user_id = response.data.user_id;
            var first_name = response.data.first_name;
            var last_name = response.data.last_name;
            var email = response.data.email;
            var token = response.token;

            internalDb.addLogin(country_code, phone, user_id, first_name, last_name, email, token, 'Pending')
            .then(function(data){
              internalDb.updateCurrentUser()
              .then(function(data){
                $ionicLoading.hide();
                $rootScope.checkingLoggedIn = false;
                if(data != null){
                  $rootScope.currentUser = data;
                  $rootScope.token = data.token;
                  $rootScope.loggedIn = true;
                  // $state.go("app.home");
                  $rootScope.setPasscode();
                }else{
                  $state.go("init");
                }
              });
            });
          })
        } else {
          $ionicLoading.hide();
          console.log(response);
          $cordovaDialogs.alert(response.data, 'Error', 'Ok')
          .then(function() {
            // callback success
          });
        }
       })
       .catch( function(err) {
          $scope.error = err.message;
        });
    }else{
      $ionicLoading.hide();
      $scope.error = "You are not online";
    }
  }
})

.controller('HomeCtrl', function ($scope, $rootScope, $state, $stateParams, $cordovaDialogs, $ionicLoading, moment, ionicMaterialInk, Api, internalDb) {
  $scope.loading = true;
  $scope.showTimer = false;
  $scope.waiting = false;
  $scope.error = false;
  $scope.message = "";
  $rootScope.current_lottery = null;
  $scope.$on( "$ionicView.enter", function( scopes, states ){
    $scope.loading = true;
    $scope.showTimer = false;
    $scope.waiting = false;
    $scope.error = false;
    $rootScope.current_lottery = null;

    if(!$rootScope.initExecuted){
      $state.go("init");
    }else if(!$rootScope.loggedIn){
      $state.go("register");
    }else{
      $scope.loading = false;
      $scope.process();
    }
  });
  $scope.process = function(){
    if($rootScope.isOnline){
      if($rootScope.loggedIn){
        $ionicLoading.show({
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        });
        Api.getNextLottery()
        .then(function(response){
          console.log(response);
          $ionicLoading.hide();
          $scope.loading = false;
          if(response.success == true){
            $scope.lotteryDetails = response.data;
            $rootScope.current_lottery = response.data;
            $scope.timer = response.countdown_time;
            if(response.data.status == 'active'){
              $scope.showTimer = true;
              if(response.countdown_time < 10){
                $scope.waiting = true;
              }
            }else if (response.data.status == 'pending') {
              $scope.showTimer = true;
              $scope.waiting = true;
            }else{
              $scope.error = true;
              $scope.message = "No upcoming lotteries.";
            }
            var lastLotteryData = {
              controller: 'user',
              action: 'getLastLottery'
            }
            Api.processRequest(lastLotteryData)
            .then(function(response){
              console.log(response);
              if(response.success == true){
                $scope.last_lottery = response.data;
              }
            });
          }else{
            if(response.error != undefined){
              if(response.error == '401'){
                internalDb.deleteLoggedIn()
                .then(function(){
                  $state.go('init');
                })
              }
            }
            $scope.error = true;
            $scope.message = response.error;
          }
        })
        .catch(function(error){
          console.log(error);
        });
      }else{
        console.log("You are not loggedIn");
      }
    }else{
      console.log("You are not online");
    }
  };

  $scope.countdown_finished = function(){
    $scope.process();
  }
})

.controller('BuyTktCtrl', function ($scope, $rootScope, $state, $stateParams, $cordovaDialogs, $ionicLoading, ionicMaterialInk, Api) {
  $rootScope.tickets = [];
  $scope.loading = true;
  $scope.processTicketProgress = false;
  $scope.showTimer = false;
  $scope.error = false;
  $scope.messages = [];
  $scope.ticket = [{
    number: null,
    amount: null
  }];

  $scope.$on( "$ionicView.enter", function( scopes, states ){
    $scope.loading = true;
    if(!$rootScope.initExecuted){
      $state.go("init");
    }else if(!$rootScope.loggedIn){
      $state.go("register");
    }else{
      $scope.processTicketProgress = false;
      $scope.loading = false;
      $scope.process();
    }
  });

  $scope.addInput = function () {
      $scope.ticket.push({
        number: null,
        amount: null
      });
  }

  $scope.removeInput = function (index) {
      $scope.ticket.splice(index, 1);
  }

  $scope.processTicket = function(){
    $scope.processTicketProgress = true;
    $rootScope.tickets.length = 0;
    $scope.messages.length = 0;
    $scope.error = false;
    for(var i = 0; i < $scope.ticket.length; i++){
      if($scope.ticket[i].amount == null || $scope.ticket[i].number == null){
        $scope.error = true;
        $scope.messages.push("Null and/or zero values are not allowed.");
        break;
      }
      if($scope.ticket[i].amount == "" || $scope.ticket[i].number == ""){
        $scope.error = true;
        $scope.messages.push("Null values are not allowed.");
        break;
      }
      if(!$scope.error && ( $scope.ticket[i].amount < 1 || $scope.ticket[i].number < 1 )){
        $scope.error = true;
        $scope.messages.push("Negative values are not allowed.");
        break;
      }
      if(!$scope.error && ( $scope.ticket[i].number > 9999 )){
        $scope.error = true;
        $scope.messages.push("Maximum 4 digit numbers are allowed.");
        break;
      }
      if(!$scope.error){
        $rootScope.tickets.push($scope.ticket[i]);
      }
    }
    if($rootScope.tickets.length == 0){
      if(!$scope.error){
        $scope.messages.push("Please enter the number and amount you want to play for.");
        $scope.error = true;
      }
    }else{
      if(!$scope.error){
        $scope.messages.length = 0;
        $scope.error = false;
        $rootScope.current_ticket_id = null;
        $scope.processTicketProgress = false;
        $state.go("app.confirmticket");
      }
    }
    $scope.processTicketProgress = false;
  }

  $scope.process = function() {
    if($rootScope.isOnline){
      if($rootScope.loggedIn){
        $scope.loading = false;
      }else{
        console.log("You are not loggedIn");
      }
    }else{
      console.log("You are not online");
    }
  };
})

.controller('ConfirmTktCtrl', function ($scope, $rootScope, $state, $stateParams, $cordovaDialogs, $ionicLoading, $ionicHistory, ionicMaterialInk, Api, paypalPG) {
  // $ionicHistory.nextViewOptions({
  //    disableAnimate: true,
  //    disableBack: true
  // });
  $scope.loading = true;
  $scope.error = false;
  $scope.checkOutProgress = false;
  $scope.$on( "$ionicView.enter", function( scopes, states ){
    // $ionicHistory.nextViewOptions({
    //    disableAnimate: true,
    //    disableBack: true
    // });
    $scope.loading = true;
    $scope.error = false;
    if(!$rootScope.initExecuted){
      $state.go("init");
    }else if(!$rootScope.loggedIn){
      $state.go("register");
    }else{
      $scope.checkOutProgress = false;
      $scope.loading = false;
      $scope.processConfirm();
    }
  });

  $scope.processConfirm = function() {
    if($rootScope.isOnline){
      if($rootScope.loggedIn){
        $scope.total_amount = 0;
        $scope.tickets = $rootScope.tickets;
        for(var i = 0; i < $scope.tickets.length; i++){
          $scope.total_amount += parseFloat($scope.tickets[i].amount);
        }
      }else{
        $scope.error = true;
        console.log("You are not loggedIn");
      }
    }else{
      $scope.error = true;
      console.log("You are not online");
    }
  };

  $scope.checkout = function(){
    $scope.checkOutProgress = true;
    $rootScope.total_amount = null;
    if($rootScope.isOnline){
      if($rootScope.loggedIn){
        if($scope.total_amount > 0){
          $rootScope.total_amount = $scope.total_amount;
          Api.getNextLottery()
          .then(function(response){
            if(response.success){
              if($rootScope.current_lottery.lottery_id == response.data.lottery_id){
                $rootScope.current_lottery = response.data;
                if(response.countdown_time > 20){
                  console.log($rootScope);
                  var data = {
                    user_id : $rootScope.currentUser.user_id
                  };
                  Api.getCurrentUserBalance(data)
                  .then(function(response){
                    console.log(response);
                    if(response.success == true){
                      if(response.data.available_balance >= $scope.total_amount){
                        // Proceess Purchase Ticket
                        var checkOutData = {
                          'controller': 'user',
                          'action': 'addTicketDetails',
                          user_id : $rootScope.currentUser.user_id,
                          lottery_id : $rootScope.current_lottery.lottery_id,
                          tickets : $rootScope.tickets
                        }
                        Api.processRequest(checkOutData)
                        .then(function(response){
                          $scope.checkOutProgress = false;
                          if(response.success == true){
                            $state.go('app.checkoutSuccess');
                          }else{
                            $cordovaDialogs.alert(response.error[0], 'Error', 'Ok')
                            .then(function() {
                              $state.go('app.checkoutFailed');
                            });
                          }
                        })
                        .catch(function(err){
                          $cordovaDialogs.alert(err.message, 'Error', 'Ok')
                          .then(function() {
                            $state.go('app.checkoutFailed');
                          });
                        })
                      }else{
                        $scope.checkOutProgress = false;
                        $cordovaDialogs.alert('You do not have enough balance to purchase this ticket.', 'Error', 'Ok')
                        .then(function() {
                          $state.go('init');
                        });
                      }
                    }else{
                      $scope.checkOutProgress = false;
                      $cordovaDialogs.alert(response.data, 'Error', 'Ok')
                      .then(function() {
                        $state.go('init');
                      });
                    }
                  })
                  .catch(function(error){
                    $scope.checkOutProgress = false;
                    $cordovaDialogs.alert(error, 'Error', 'Ok')
                    .then(function() {
                      $state.go('init');
                    });
                  });
                  // $state.go("app.checkout");
                }else{
                  $scope.checkOutProgress = false;
                  $cordovaDialogs.alert('ou pap ka achte tikè pou tiraj sa paske tan  fin\'n pase. pa bliye jwe bonè nan lòt tiraj la. PRAN CHANS OU!!', 'Error', 'Ok')
                  .then(function() {
                    $state.go('init');
                  });
                }
              }else{
                $scope.checkOutProgress = false;
                $cordovaDialogs.alert('Specified lottery not found.', 'Error', 'Ok')
                .then(function() {
                  $state.go('init');
                });
              }
            }else{
              $scope.checkOutProgress = false;
              $cordovaDialogs.alert('An error occured. Please try again later.', 'Error', 'Ok')
              .then(function() {
                $state.go('init');
              });
            }
          })
          .catch(function(error){
            $scope.checkOutProgress = false;
            $cordovaDialogs.alert(error, 'Error', 'Ok')
            .then(function() {
              $state.go('init');
            });
          });
        }else{
          $scope.checkOutProgress = false;
          $scope.error = true;
          console.log("Invalid total amount");
        }
      }else{
        $scope.checkOutProgress = false;
        $scope.error = true;
        console.log("You are not loggedIn");
      }
    }else{
      $scope.checkOutProgress = false;
      $scope.error = true;
      console.log("You are not online");
    }
  };
})

.controller('CheckoutCtrl', function ($scope, $rootScope, $state, $stateParams, $cordovaDialogs, $ionicLoading, $ionicHistory, ionicMaterialInk, Api, paypalPG) {
  $ionicHistory.nextViewOptions({
     disableAnimate: true,
     disableBack: true
  });
  $ionicLoading.show({
      template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
  });

  $scope.loading = true;
  $scope.error = false;
  $rootScope.payment_response = null;
  $scope.$on( "$ionicView.enter", function( scopes, states ){
    $ionicHistory.nextViewOptions({
       disableAnimate: true,
       disableBack: true
    });
    $ionicLoading.show({
        template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
    });
    $scope.loading = true;
    $scope.error = false;
    $rootScope.payment_response = null;
    if(!$rootScope.initExecuted){
      $state.go("init");
    }else if(!$rootScope.loggedIn){
      $state.go("register");
    }else{
      $scope.loading = false;
      $scope.processTransaction();
    }
  });

  $ionicModal.fromTemplateUrl('templates/passcode-get.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $rootScope.getPasscodeModal = modal;
  });

  $scope.verifyPasscode = function(){
    var response = $rootScope.verifyPasscode()
    response
    .then(function(response){
      if(response.success){
        $scope.processTransaction()
      }
    })
    .catch(function(err){
      console.log(err)
      $rootScope.passcodeError = "Invalid code. Please try again"
    })
  }

  $scope.processTransaction = function() {
    if($rootScope.passcodeVerified){
      if($rootScope.isOnline){
        if($rootScope.loggedIn){
          var data = {
            user_id : $rootScope.currentUser.user_id,
            lottery_id : $rootScope.current_lottery.lottery_id,
            tickets : $rootScope.tickets
          };
          if($rootScope.current_ticket_id == null){
            Api.addTicketDetails(data)
            .then(function(response){
              if(response.success){
                if(response.data.user_id == $rootScope.currentUser.user_id){
                  if(response.data.ticket_id != null){
                    if(response.data.total_amount > 0){
                      $rootScope.current_ticket_id = response.data.ticket_id;
                      paypalPG.initPaymentUI(response.data.total_amount)
                      .then(function(response){
                        $ionicLoading.hide();
                        $rootScope.payment_response = response.data.response;
                        if(response.success){
                          var data = {
                            user_id : $rootScope.currentUser.user_id,
                            ticket_id : $rootScope.current_ticket_id,
                            total_amount : $rootScope.total_amount,
                            payment_status : response.data.response.state,
                            paid_on : response.data.response.create_time,
                            payment_transaction_id : response.data.response.id,
                            payment_response : response.data.response,
                            payment_client : response.data.client,
                            response_type : response.data.response_type
                          };
                          Api.updateTicketDetails(data)
                          .then(function(response){
                            console.log(response);
                            if(response.success){
                              $state.go("app.checkoutSuccess");
                            }else{
                              $state.go("app.checkoutFailed");
                            }
                          })
                          .catch(function(error){
                            $ionicLoading.hide();
                            $state.go("app.checkoutFailed");
                          })
                        }
                        console.log(response);
                      })
                      .catch(function(error){
                        $ionicLoading.hide();
                        $scope.error = true;
                        console.log(error);
                      });
                    }else{
                      $ionicLoading.hide();
                      $scope.error = true;
                      console.log("Invalid total amount");
                    }
                  }else{
                    $ionicLoading.hide();
                    $scope.error = true;
                    $scope.error_message = "Invalid ticket";
                  }
                }else{
                  $ionicLoading.hide();
                  $scope.error = true;
                  $scope.error_message = "Invalid User";
                }
              }else{
                $ionicLoading.hide();
                $scope.error = true;
                $scope.error_message = response.error;
              }
            })
            .catch(function(error){
              $ionicLoading.hide();
              $scope.error = true;
              $scope.error_message = error;
            })
          }else{
            paypalPG.initPaymentUI()
            .then(function(response){
              $ionicLoading.hide();
              $rootScope.payment_response = response.data.response;
              if(response.success){
                var data = {
                  user_id : $rootScope.currentUser.user_id,
                  ticket_id : $rootScope.current_ticket_id,
                  payment_status : response.data.response.state,
                  paid_on : response.data.response.create_time,
                  payment_transaction_id : response.data.response.id,
                  payment_response : response.data.response,
                  payment_client : response.data.client
                };
                Api.updateTicketDetails(data)
                .then(function(response){
                  if(response.success){
                    $state.go("app.checkoutSuccess");
                  }else{
                    $state.go("app.checkoutFailed");
                  }
                })
                .catch(function(error){
                  $ionicLoading.hide();
                  $state.go("app.checkoutFailed");
                })
              }
              console.log(response);
            })
            .catch(function(error){
              $ionicLoading.hide();
              $scope.error = true;
              console.log(error);
            });
          }
        }else{
          $ionicLoading.hide();
          $scope.error = true;
          $scope.error_message = "You are not loggedIn";
        }
      }else {
        $ionicLoading.hide();
        $scope.error = true;
        console.log("You are not online");
      }
    }else{
      $rootScope.getPasscode();
    }
  };
})

.controller('CheckoutSuccessCtrl', function ($scope, $rootScope, $state, $stateParams, $cordovaDialogs, $ionicLoading, $ionicHistory, ionicMaterialInk, Api, paypalPG) {
  $ionicHistory.nextViewOptions({
     disableAnimate: true,
     disableBack: true
  });
  $scope.loading = true;
  $scope.error = false;
  $rootScope.current_ticket_id = null;
  $scope.$on( "$ionicView.enter", function( scopes, states ){
    $ionicHistory.nextViewOptions({
       disableAnimate: true,
       disableBack: true
    });
    $rootScope.current_ticket_id = null;
    $scope.loading = true;
    $scope.error = false;
    if(!$rootScope.initExecuted){
      $state.go("init");
    }else if(!$rootScope.loggedIn){
      $state.go("register");
    }else{
      $rootScope.current_ticket_id = null;
      $scope.loading = false;
      $scope.process();
    }
  });

  $scope.process = function() {
    if($rootScope.isOnline){
      if($rootScope.loggedIn){
        $scope.total_amount = 0;
        $scope.tickets = $rootScope.tickets;
        $scope.payment_response = $rootScope.payment_response;
        for(var i = 0; i < $scope.tickets.length; i++){
          $scope.total_amount += parseFloat($scope.tickets[i].amount);
        }
      }else{
        $scope.error = true;
        console.log("You are not loggedIn");
      }
    }else{
      $scope.error = true;
      console.log("You are not online");
    }
  };
})

.controller('CheckoutFailedCtrl', function ($scope, $rootScope, $state, $stateParams, $cordovaDialogs, $ionicLoading, $ionicHistory, ionicMaterialInk, Api, paypalPG) {
  $ionicHistory.nextViewOptions({
     disableAnimate: true,
     disableBack: true
  });
  $scope.loading = true;
  $scope.error = false;
  $scope.$on( "$ionicView.enter", function( scopes, states ){
    $ionicHistory.nextViewOptions({
       disableAnimate: true,
       disableBack: true
    });
    $scope.loading = true;
    $scope.error = false;
    if(!$rootScope.initExecuted){
      $state.go("init");
    }else if(!$rootScope.loggedIn){
      $state.go("register");
    }else{
      $scope.loading = false;
      $scope.process();
    }
  });

  $scope.process = function() {
    if($rootScope.isOnline){
      if($rootScope.loggedIn){
        $scope.total_amount = 0;
        $scope.tickets = $rootScope.tickets;
        $scope.payment_response = $rootScope.payment_response;
        for(var i = 0; i < $scope.tickets.length; i++){
          $scope.total_amount += parseFloat($scope.tickets[i].amount);
        }
      }else{
        $scope.error = true;
        console.log("You are not loggedIn");
      }
    }else{
      $scope.error = true;
      console.log("You are not online");
    }
  };

  $scope.checkout = function(){
    $ionicLoading.show({
        template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
    });
    $rootScope.total_amount = null;
    if($rootScope.isOnline){
      if($rootScope.loggedIn){
        if($scope.total_amount > 0){
          $rootScope.total_amount = $scope.total_amount;
          Api.getNextLottery()
          .then(function(response){
            if(response.success){
              if($rootScope.current_lottery.lottery_id == response.data.lottery_id){
                $rootScope.current_lottery = response.data;
                if(response.countdown_time > 20){
                  $state.go("app.checkout");
                }else{
                  $ionicLoading.hide();
                  $cordovaDialogs.alert('Booking ticket for this lottery has been timed out. Don\'t miss the next lottery.', 'Error', 'Ok')
                  .then(function() {
                    $state.go("app.home");
                  });
                }
              }else{
                $ionicLoading.hide();
                $cordovaDialogs.alert('Specified lottery not found.', 'Error', 'Ok')
                .then(function() {
                  $state.go("app.home");
                });
              }
            }else{
              $ionicLoading.hide();
              $cordovaDialogs.alert('An error occured. Please try again later.', 'Error', 'Ok')
              .then(function() {
                $state.go("app.home");
              });
            }
          })
          .catch(function(error){
            $ionicLoading.hide();
            $cordovaDialogs.alert(error, 'Error', 'Ok')
            .then(function() {
              $state.go("app.home");
            });
          });
        }else{
          $ionicLoading.hide();
          $scope.error = true;
          console.log("Invalid total amount");
        }
      }else{
        $ionicLoading.hide();
        $scope.error = true;
        console.log("You are not loggedIn");
      }
    }else{
      $ionicLoading.hide();
      $scope.error = true;
      console.log("You are not online");
    }
  };
})

.controller('LotteriesCtrl', function ($scope, $rootScope, $state, $stateParams, $cordovaDialogs, $ionicLoading, ionicMaterialInk, Api) {
  $scope.loading = true;
  $scope.error = false;
  $scope.message = "";
  $scope.count = 0;
  $scope.hasMoreData = true;
  $scope.lottery_list = {};
  $scope.$on( "$ionicView.enter", function( scopes, states ){
    $scope.loading = true;
    $scope.error = false;
    $scope.count = 0;
    $scope.hasMoreData = true;
    $scope.lottery_list = {};

    if(!$rootScope.initExecuted){
      $state.go("init");
    }else if(!$rootScope.loggedIn){
      $state.go("register");
    }else{
      $scope.process();
    }
  });

  $scope.loadMore = function(){
    if($scope.hasMoreData){
      var data = {
        count : $scope.count
      };
      Api.getLotteryList(data)
      .then(function(response){
        $scope.count += 1;
        $scope.$broadcast('scroll.infiniteScrollComplete');
        if(response.success == true){
          if(!response.data.length){
            $scope.hasMoreData = false;
          }else{
            if($scope.lottery_list.length){
              for(var i = 0; i < response.data.length; i++){
                $scope.lottery_list.push(response.data[i]);
              }
            }else{
              $scope.lottery_list = response.data;
            }
          }
        }else{
          $scope.error = true;
          $scope.message = response.error;
        }
      })
      .catch(function(error){
        $scope.$broadcast('scroll.infiniteScrollComplete');
        console.log(error);
      });
    }
  };

  $scope.process = function(){
    $scope.loading = false;
    if($rootScope.isOnline){
      if($rootScope.loggedIn){
        $scope.loadMore();
      }else{
        console.log("You are not loggedIn");
      }
    }else{
      console.log("You are not online");
    }
  };
})

.controller('LotteryDetailCtrl', function ($scope, $rootScope, $state, $stateParams, $cordovaDialogs, $ionicLoading, ionicMaterialInk, Api) {
  $scope.loading = true;
  $scope.error = false;
  $scope.message = "";
  $scope.$on( "$ionicView.enter", function( scopes, states ){
    $scope.loading = true;
    $scope.error = false;

    if(!$rootScope.initExecuted){
      $state.go("init");
    }else if(!$rootScope.loggedIn){
      $state.go("register");
    }else{
      $scope.process();
    }
  });

  $scope.process = function(){
    if($rootScope.isOnline){
      if($rootScope.loggedIn){
        var data = {
          user_id : $rootScope.currentUser.user_id,
          lottery_id : $stateParams.id
        };
        Api.getLotteryDetails(data)
        .then(function(response){
          $scope.loading = false;
          $ionicLoading.hide();
          $scope.$broadcast('scroll.infiniteScrollComplete');
          if(response.success == true){
            $scope.lottery = response.data;
          }else{
            $scope.error = true;
            $scope.message = response.error;
          }
        })
        .catch(function(error){
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $ionicLoading.hide();
          console.log(error);
        });
      }else{
        console.log("You are not loggedIn");
      }
    }else{
      console.log("You are not online");
    }
  };
})

.controller('TicketsCtrl', function ($scope, $rootScope, $state, $stateParams, $cordovaDialogs, $ionicLoading, ionicMaterialInk, Api) {
  $scope.loading = true;
  $scope.error = false;
  $scope.message = "";
  $scope.count = 0;
  $scope.hasMoreData = true;
  $scope.ticket_list = {};
  $scope.$on( "$ionicView.enter", function( scopes, states ){
    $scope.loading = true;
    $scope.error = false;
    $scope.count = 0;
    $scope.hasMoreData = true;
    $scope.ticket_list = {};

    if(!$rootScope.initExecuted){
      $state.go("init");
    }else if(!$rootScope.loggedIn){
      $state.go("register");
    }else{
      $scope.process();
    }
  });

  $scope.loadMore = function(){
    if($scope.hasMoreData){
      var data = {
        count : $scope.count
      };
      Api.getTicketList(data)
      .then(function(response){
        $scope.count += 1;
        $scope.$broadcast('scroll.infiniteScrollComplete');
        if(response.success == true){
          if(!response.data.length){
            $scope.hasMoreData = false;
          }else{
            if($scope.ticket_list.length){
              for(var i = 0; i < response.data.length; i++){
                $scope.ticket_list.push(response.data[i]);
              }
            }else{
              $scope.ticket_list = response.data;
            }
          }
        }else{
          $scope.error = true;
          $scope.message = response.error;
        }
      })
      .catch(function(error){
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $ionicLoading.hide();
        console.log(error);
      });
    }
  };

  $scope.process = function(){
    $scope.loading = false;
    if($rootScope.isOnline){
      if($rootScope.loggedIn){
        $scope.loadMore();
      }else{
        console.log("You are not loggedIn");
      }
    }else{
      console.log("You are not online");
    }
  };
})

.controller('TicketDetailCtrl', function ($scope, $rootScope, $state, $stateParams, $cordovaDialogs, $ionicLoading, ionicMaterialInk, Api) {
  $scope.loading = true;
  $scope.error = false;
  $scope.message = "";
  $scope.$on( "$ionicView.enter", function( scopes, states ){
    $scope.loading = true;
    $scope.error = false;

    if(!$rootScope.initExecuted){
      $state.go("init");
    }else if(!$rootScope.loggedIn){
      $state.go("register");
    }else{
      $scope.process();
    }
  });

  $scope.process = function(){
    if($rootScope.isOnline){
      if($rootScope.loggedIn){
        var data = {
          user_id : $rootScope.currentUser.user_id,
          ticket_id : $stateParams.id
        };
        Api.getTicketDetails(data)
        .then(function(response){
          $scope.loading = false;
          $ionicLoading.hide();
          $scope.$broadcast('scroll.infiniteScrollComplete');
          if(response.success == true){
            $scope.ticket = response.data;
          }else{
            $scope.error = true;
            $scope.message = response.error;
          }
        })
        .catch(function(error){
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $ionicLoading.hide();
          console.log(error);
        });
      }else{
        console.log("You are not loggedIn");
      }
    }else{
      console.log("You are not online");
    }
  };
})

.controller('MyAccountCtrl', function ($scope, $rootScope, $state, $stateParams, $cordovaDialogs, $ionicLoading, $ionicModal, ionicMaterialInk, Api) {
  $scope.loading = true;
  $scope.error = false;
  $scope.message = "";

  $scope.verifyPasscode = function(){
    var response = $rootScope.verifyPasscode()
    console.log(response)
    response
    .then(function(response){
      console.log(response)
      if(response.success){
        console.log("Verify passcode success");
        $scope.getPasscodeModal.hide();
        $scope.process();
      }
    })
    .catch(function(err){
      console.log(err)
      $rootScope.passcodeError = "Invalid code. Please try again"
    })
  }

    $ionicModal.fromTemplateUrl('templates/passcode-get.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.getPasscodeModal = modal;
    });

  $scope.$on( "$ionicView.enter", function( scopes, states ){
    $scope.loading = true;
    $scope.error = false;
    $ionicModal.fromTemplateUrl('templates/passcode-get.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $rootScope.getPasscodeModal = modal;
    });
    if(!$rootScope.initExecuted){
      $state.go("init");
    }else if(!$rootScope.loggedIn){
      $state.go("register");
    }else{
      $scope.getPasscodeModal.show();
    }
  });

  $scope.process = function(){
    if($rootScope.isOnline){
      if($rootScope.loggedIn){
        var data = {
          controller: 'user',
          action: 'getCurrentUserBalance',
          user_id : $rootScope.currentUser.user_id
        };
        Api.processRequest(data)
        .then(function(response){
          var transactionData = {
            controller: 'user',
            action: 'getRecentTransaction'
          }
          Api.processRequest(transactionData)
          .then(function(response){
            console.log(response);
            if(response.success){
              $scope.transaction_list = response.data;
            }
          })
          .catch(function(err){

          })
          $scope.loading = false;
          if(response.success == true){
            $scope.account_details = response.data;
          }else{
            $scope.error = true;
            $scope.message = response.error;
          }
        })
        .catch(function(error){
          console.log(error);
        });
      }else{
        console.log("You are not loggedIn");
      }
    }else{
      console.log("You are not online");
    }
  };
})

.controller('ProfileCtrl', function ($scope, $rootScope, $ionicPopover, $ionicPopup, $ionicActionSheet, $state, $stateParams, $cordovaDialogs, $ionicLoading, ionicMaterialInk, Api, Server) {
  $scope.serverBase = Server.serverBase;
  $scope.loading = true;
  $scope.error = false;
  $scope.message = "";
  $scope.profileDetails = {};
  $scope.$on( "$ionicView.enter", function( scopes, states ){
    $scope.loading = true;
    $scope.error = false;

    if(!$rootScope.initExecuted){
      $state.go("init");
    }else if(!$rootScope.loggedIn){
      $state.go("register");
    }else{
      $scope.process();
    }
  });

  $scope.process = function(){
    if($rootScope.isOnline){
      if($rootScope.loggedIn){
        var data = {
          controller: 'user',
          action: 'getCurrentUserBalance',
          user_id : $rootScope.currentUser.user_id
        };
        Api.processRequest(data)
        .then(function(response){
          $scope.loading = false;
          if(response.success == true){
            $scope.profileDetails = response.data;
          }else{
            $scope.error = true;
            $scope.message = response.data;
          }
        })
        .catch(function(error){
          console.log(error);
        });
      }else{
        console.log("You are not loggedIn");
      }
    }else{
      console.log("You are not online");
    }
  }

  var template = '<ion-popover-view>' +
                '   <ion-content>' +
                '       <div class="list">' +
                '         <a class="item item-icon-left" ui-sref="app.edit-profile()" ng-click = "closePopover()">' +
                '           <i class="icon ion-edit"></i>' +
                '           Edit Profile' +
                '         </a>' +
                '         <a class="item item-icon-left" ui-sref="app.change-password()" ng-click = "closePopover()">' +
                '           <i class="icon ion-android-lock"></i>' +
                '           Change Password' +
                '         </a>' +
                '         <a class="item item-icon-left" ui-sref="logout()" ng-click = "closePopover()">' +
                '           <i class="icon ion-power"></i>' +
                '           Logout' +
                '         </a>' +
                '       </div>' +
                '   </ion-content>' +
                '</ion-popover-view>';

  $scope.popover = $ionicPopover.fromTemplate(template, {
      scope: $scope
  });

  $scope.closePopover = function () {
      $scope.popover.hide();
  }

  var onProfilePhotoUploadSuccess = function(result){
    var response = JSON.parse(result.response);
    uploaded_image = response.data;
    $scope.profileDetails.profile_pic = uploaded_image;
    console.log(response);
    console.log(uploaded_image);
    var data = {
      controller: 'user',
      action: 'updateProfilePic',
      profile_pic : uploaded_image
    }
    Api.processRequest(data)
    .then(function(response){
      $scope.updateProfilePicProgress = false;
      if(response.success){
        $ionicPopup.alert({
          template: response.data,
          title: 'Sucessful'
        });
      }else{
        $ionicPopup.alert({
          template: response.data,
          title: 'Error'
        });
      }
    })
    .catch(function(err){
      $scope.updateProfilePicProgress = false;
      $ionicPopup.alert({
        template: err,
        title: 'Error'
      });
    })
  }

  var onProfilePhotoUploadFail = function(error){
    $scope.updateProfilePicProgress = false;
    alert(error);
  }

  var getPhotoSuccess = function(mediaFile){
    $scope.updateProfilePicProgress = true;
    plugins.crop(function success(data) {
      window.resolveLocalFileSystemURL(data,
        function( fileEntry){
          profilePhotoUpload(fileEntry, onProfilePhotoUploadSuccess, onProfilePhotoUploadFail);
        },
        function(){
          alert (' There has been some problem with the image ' );
        }
      );
    }, function fail(error) {
      console.log (error );
    }, mediaFile)
  }

  $scope.profilePicAction = function(){
    $scope.updateProfilePicProgress = true;
    var profilePicSheet = $ionicActionSheet.show({
      buttons:[
        {text:'<i class = "ion-camera"> Take Photo'},
        {text:'<i class = "ion-images"> Upload Photo'}
      ],
      titleText:'Change/Update Your Profile Photo',
      cancelText:'Cancel',
      cancel:function(){
        $scope.updateProfilePicProgress = false;
      },
      buttonClicked:function(index){
        if(index == 0 ){
          capturePhoto(getPhotoSuccess);
        }
        if(index == 1 ){
          getPhoto(getPhotoSuccess);
        }
        return true;
      }
    });

  };

  $scope.closePopover = function () {
      $scope.popover.hide();
  };

  $scope.verifyUpdatedVerificationCode = function(){
    if($rootScope.isOnline){
      if($rootScope.loggedIn){
        var verificationCodePopup = $ionicPopup.show({
          template: '<input type="verification_code" ng-model="profileDetails.verification_code">',
          title: 'Enter 4 digit verification code sent on your phone number.',
          scope: $scope,
          buttons: [
            { text: 'Cancel' },
            {
              text: '<b>Verify</b>',
              type: 'button-positive',
              onTap: function(e) {
                if (!$scope.profileDetails.verification_code) {
                  //don't allow the user to close unless he enters wifi password
                  e.preventDefault();
                } else {
                  var data = {
                    controller: 'user',
                    action: 'verifyUpdatedVerificationCode',
                    user_id : $rootScope.currentUser.user_id,
                    verification_code: $scope.profileDetails.verification_code
                  };
                  Api.processRequest(data)
                  .then(function(response){
                    $scope.loading = false;
                    if(response.success == true){
                      $ionicPopup.alert({
                          title: 'Success',
                          template: response.data
                      });
                      return true;
                    }else{
                      $ionicPopup.alert({
                          title: 'Error',
                          template: response.data
                      })
                      .then(function(){
                        $scope.verifyUpdatedVerificationCode();
                      });
                    }
                  })
                  .catch(function(error){
                    console.log(error);
                  });
                }
              }
            }
          ]
        });
      }else{
        console.log("You are not loggedIn");
      }
    }else{
      console.log("You are not online");
    }
  }

  $scope.updateProfileDetails = function(){
    $scope.saveProfileProgress = true;
    $rootScope.$watch('checkingLoggedIn', function() {
      if($rootScope.checkingLoggedIn == false){
        if($rootScope.isOnline){
          var updateData = {
            controller: 'user',
            action: 'updateUserDetails',
            user_id: $rootScope.currentUser.user_id,
            first_name: $scope.profileDetails.first_name,
            last_name: $scope.profileDetails.last_name,
            phone: $scope.profileDetails.phone,
            email: $scope.profileDetails.email,
            basic_info: $scope.profileDetails.basic_info
          }
          console.log($rootScope);
          console.log(updateData);
          Api.processRequest(updateData)
          .then(function(response){
            console.log(response);
            $scope.saveProfileProgress = false;
            if(response.success == true){
              if(response.phone_verification){
                $scope.profileDetails.verification_code = '';
                $scope.verifyUpdatedVerificationCode();
              }else{
                if(response.email_verification){
                  $ionicPopup.alert({
                      title: 'Success',
                      template: 'Your profile has been updated successfully. PLease check your email for the verification link.'
                  });
                }else{
                  $ionicPopup.alert({
                      title: 'Success',
                      template: 'Your profile has been updated successfully.'
                  });
                }
              }
            }else{
              $ionicPopup.alert({
                  title: 'Error',
                  template: response.data
              });
            }
          })
          .catch( function(err) {
            $scope.errors = err;
            $ionicPopup.alert({
                title: 'Error',
                template: 'An error occured. Please try later'
            });
          });
        }else{
          $ionicLoading.hide();
          $ionicPopup.alert({
              title: 'Error',
              template: 'Internet connection not available.'
          });
        }
      }
    });
  }

})

.controller('TransferCreditCtrl', function ($scope, $rootScope, $state, $stateParams, $cordovaDialogs, $ionicLoading, ionicMaterialInk, Api) {
  $scope.loading = true;
  $scope.error = false;
  $scope.error_message = null;
  $scope.proceedTransferProgress = false;
  $scope.data = {};
  $scope.$on( "$ionicView.enter", function( scopes, states ){
    $scope.loading = true;
    $scope.error = false;

    if(!$rootScope.initExecuted){
      $state.go("init");
    }else if(!$rootScope.loggedIn){
      $state.go("register");
    }else{
      $scope.proceedTransferProgress = false;
      $scope.loading = false;
    }
  });

  $scope.proceedTransfer = function(){
    $scope.proceedTransferProgress = true;
    if($rootScope.isOnline){
      if($rootScope.loggedIn){
        var amount = parseFloat($scope.data.amount);
        var receiver_login_id = $scope.data.receiver_login_id;
        if(amount == undefined || receiver_login_id == undefined){
          $scope.error = true;
          $scope.error_message = "Invalid login ID or phone number or amount.";
          $scope.proceedTransferProgress = false;
          return false;
        }
        var data = {
          controller: 'user',
          action: 'getCurrentUserBalance',
          user_id : $rootScope.currentUser.user_id
        };
        Api.processRequest(data)
        .then(function(response){
          $scope.proceedTransferProgress = false;
          console.log(response.data.available_balance);
          console.log(amount);
          if(response.success == true){
            if(parseFloat(response.data.available_balance) >= amount){
              var searchData = {
                controller: 'user',
                action: 'searchUser',
                login_id: receiver_login_id
              }
              Api.processRequest(searchData)
              .then(function(response){
                if(response.success == true){
                  $scope.error = false;
                  $rootScope.receiver_details = response.data;
                  $rootScope.receiver_details.amount_to_transfer = amount;
                  $state.go('app.confirm-transfer');
                }else{
                  $scope.error = true;
                  if(response.data){
                    $scope.error_message = response.data;
                  }else{
                    $scope.error_message = "Invalid login ID or phone number.";
                  }
                }
              })
              .catch(function(err){
                $cordovaDialogs.alert(err.message, 'Error', 'Ok')
                .then(function() {
                  // callback success
                });
              })
            }else{
              $cordovaDialogs.alert('Dezole, ou pa gen ase balans nan kont ZippCash ou pou ka fè transfè sa. Ale visite sikizal ki pi prew la pou ka rechaje kont ZippCash ou.', 'Error', 'Ok')
              .then(function() {
                // callback success
              });
            }
          }else{
            $scope.error = true;
            $scope.message = response.error;
          }
        })
        .catch(function(error){
          console.log(error);
        });
      }else{
        console.log("You are not loggedIn");
      }
    }else{
      console.log("You are not online");
    }
  };
})

.controller('ConfirmTransferCtrl', function ($scope, $rootScope, $state, $stateParams, $cordovaDialogs, $ionicLoading, $ionicModal, ionicMaterialInk, Api) {
  $scope.loading = true;
  $scope.error = false;
  $scope.transferProgress = false;
  $scope.data = {};
  $scope.$on( "$ionicView.enter", function( scopes, states ){
    $scope.loading = true;
    $scope.error = false;

    if(!$rootScope.initExecuted){
      $state.go("init");
    }else if(!$rootScope.loggedIn){
      $state.go("register");
    }else{
      console.log($rootScope.receiver_details);
      $scope.transferProgress = false;
      $scope.loading = false;
    }
  });

  $ionicModal.fromTemplateUrl('templates/passcode-get.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $rootScope.getPasscodeModal = modal;
  });

  $scope.verifyPasscode = function(){
    var response = $rootScope.verifyPasscode()
    console.log(response)
    response
    .then(function(response){
      console.log(response)
      if(response.success){
        $scope.processTransfer()
      }
    })
    .catch(function(err){
      console.log(err)
      $rootScope.passcodeError = "Invalid code. Please try again"
    })
  }


  $scope.processTransfer = function(){
    if($rootScope.passcodeVerified){
      if($rootScope.isOnline){
        if($rootScope.loggedIn){
          $scope.transferProgress = true;
          var amount = $rootScope.receiver_details.amount_to_transfer;
          var receiver_login_id = $rootScope.receiver_details.login_id;
          var data = {
            controller: 'user',
            action: 'transferCredit',
            receiver_login_id : receiver_login_id,
            amount: amount
          };
          Api.processRequest(data)
          .then(function(response){
            $scope.transferProgress = false;
            $rootScope.passcodeVerified = false;
            if(response.success == true){
              $state.go('app.transfer-success');
            }else{
              $state.go('app.transfer-failure');
            }
          })
          .catch(function(error){
            console.log(error);
          });
        }else{
          console.log("You are not loggedIn");
        }
      }else{
        console.log("You are not online");
      }
    }else{
      $rootScope.getPasscode();
    }
  };
})

.controller('TransferSuccessCtrl', function ($scope, $rootScope, $state, $stateParams, $cordovaDialogs, $ionicLoading, ionicMaterialInk, Api) {
  $scope.loading = true;
  $scope.error = false;
  $scope.data = {};
  $scope.$on( "$ionicView.enter", function( scopes, states ){
    $scope.loading = true;
    $scope.error = false;

    if(!$rootScope.initExecuted){
      $state.go("init");
    }else if(!$rootScope.loggedIn){
      $state.go("register");
    }else{
      console.log($rootScope.receiver_details);
      $scope.loading = false;
    }
  });

  $scope.processTransfer = function(){
    $scope.transferProgress = true;
    if($rootScope.isOnline){
      if($rootScope.loggedIn){
        var amount = $rootScope.receiver_details.amount_to_transfer;
        var receiver_login_id = $rootScope.receiver_details.login_id;
        var data = {
          controller: 'user',
          action: 'transferCredit',
          receiver_login_id : receiver_login_id,
          amount: amount
        };
        Api.processRequest(data)
        .then(function(response){
          $scope.transferProgress = false;
          if(response.success == true){

          }else{
            $scope.error = true;
            $scope.message = response.error;
          }
        })
        .catch(function(error){
          console.log(error);
        });
      }else{
        console.log("You are not loggedIn");
      }
    }else{
      console.log("You are not online");
    }
  };
})

.controller('LogoutCtrl', function ($scope, $rootScope, $state, $stateParams, $cordovaDialogs, $ionicLoading, internalDb, Api) {
  localStorage.removeItem('phone');
  localStorage.removeItem('country_code');
  $rootScope.currentUser = null;
  $rootScope.token = null;
  $rootScope.loggedIn = false;
  $rootScope.isOnline = true;
  $rootScope.initExecuted = false;
  internalDb.openDb()
  .then(function(data){
    internalDb.deleteLoggedIn()
    .then(function(data){
      $state.go('init');
    });
  });
})

;
