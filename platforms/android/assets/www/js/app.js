// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ionic-material', 'ngCordova', 'timer', 'angularMoment']);

app

.constant('ApiEndpoint', {
  url: 'http://www.kizombanight.com/zippcash/api/ajax.php',
  serverBase: 'http://www.kizombanight.com/zippcash/api'
})

.factory('authInterceptor', function ($rootScope, $q, $location) {
    return {
        // Add authorization token to headers
        request: function (config) {
            config.headers = config.headers || {};
            var token = $rootScope.token;
            config.headers['x-auth-token'] = token;
            return config;
        }
    };
})

.run(function ($ionicPlatform, $rootScope, $state, internalDb) {
  $rootScope.initExecuted = false;
    $rootScope.$on('$stateChangeStart', function (event, next) {
      if(next.name == "init"){

      }else{

      }
    });
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        setTimeout(function() {
            navigator.splashscreen.hide();
        }, 100);
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
    $stateProvider

    .state('init', {
        url: '/init',
        templateUrl: 'templates/init.html',
        controller: 'InitCtrl'
    })
    .state('index', {
        url: '/index',
        templateUrl: 'templates/index.html',
        controller: 'IndexCtrl'
    })
    .state('register', {
        url: '/register',
        templateUrl: 'templates/register.html',
        controller: 'RegisterCtrl'
    })
    .state('verify', {
        url: '/verify',
        templateUrl: 'templates/verify.html',
        controller: 'VerifyCtrl'
    })
    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
    })
    .state('forget-password', {
        url: '/login',
        templateUrl: 'templates/forget-password.html',
        controller: 'ForgetPassCtrl'
    })
    .state('forget-password-verify', {
        url: '/login',
        templateUrl: 'templates/forget-password-verify.html',
        controller: 'ForgetPassVerifyCtrl'
    })
    .state('update-password', {
        url: '/login',
        templateUrl: 'templates/update-password.html',
        controller: 'UpdatePassCtrl'
    })
    .state('logout', {
        url: '/logout',
        controller: 'LogoutCtrl'
    })

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.home', {
        url: '/home',
        views: {
            'menuContent': {
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl'
            }
        }
    })
    .state('app.lotteries', {
        url: '/lotteries',
        views: {
            'menuContent': {
                templateUrl: 'templates/lotteries.html',
                controller: 'LotteriesCtrl'
            }
        }
    })
    .state('app.lottery-detail', {
        url: '/lottery/detail/:id',
        views: {
            'menuContent': {
                templateUrl: 'templates/lottery-detail.html',
                controller: 'LotteryDetailCtrl'
            }
        }
    })
    .state('app.tickets', {
        url: '/tickets',
        views: {
            'menuContent': {
                templateUrl: 'templates/tickets.html',
                controller: 'TicketsCtrl'
            }
        }
    })
    .state('app.profile', {
        url: '/profile',
        views: {
            'menuContent': {
                templateUrl: 'templates/profile.html',
                controller: 'ProfileCtrl'
            }
        }
    })
    .state('app.edit-profile', {
        url: '/edit-profile',
        views: {
            'menuContent': {
                templateUrl: 'templates/edit-profile.html',
                controller: 'ProfileCtrl'
            }
        }
    })
    .state('app.change-password', {
        url: '/change-password',
        views: {
            'menuContent': {
                templateUrl: 'templates/change-password.html',
                controller: 'ChangePassCtrl'
            }
        }
    })
    .state('app.ticket-detail', {
        url: '/ticket/detail/:id',
        views: {
            'menuContent': {
                templateUrl: 'templates/ticket-detail.html',
                controller: 'TicketDetailCtrl'
            }
        }
    })
    .state('app.my-account', {
        url: '/account',
        views: {
            'menuContent': {
                templateUrl: 'templates/my-account.html',
                controller: 'MyAccountCtrl'
            }
        }
    })
    .state('app.transfer-credit', {
        url: '/transfer-credit',
        views: {
            'menuContent': {
                templateUrl: 'templates/transfer-credit.html',
                controller: 'TransferCreditCtrl'
            }
        }
    })
    .state('app.confirm-transfer', {
        url: '/confirm-transfer',
        views: {
            'menuContent': {
                templateUrl: 'templates/confirm-transfer.html',
                controller: 'ConfirmTransferCtrl'
            }
        }
    })
    .state('app.transfer-success', {
        url: '/transfer-success',
        views: {
            'menuContent': {
                templateUrl: 'templates/transfer-success.html',
                controller: 'ConfirmTransferCtrl'
            }
        }
    })
    .state('app.transfer-failure', {
        url: '/transfer-failure',
        views: {
            'menuContent': {
                templateUrl: 'templates/transfer-failure.html',
                controller: 'ConfirmTransferCtrl'
            }
        }
    })
    .state('app.buyticket', {
        url: '/buyticket',
        views: {
            'menuContent': {
                templateUrl: 'templates/buy-ticket.html',
                controller: 'BuyTktCtrl'
            }
        }
    })
    .state('app.confirmticket', {
        url: '/confirmticket',
        views: {
            'menuContent': {
                templateUrl: 'templates/confirm-ticket.html',
                controller: 'ConfirmTktCtrl'
            }
        }
    })
    .state('app.checkout', {
        url: '/checkout',
        views: {
            'menuContent': {
                templateUrl: 'templates/checkout.html',
                controller: 'CheckoutCtrl'
            }
        }
    })
    .state('app.checkoutSuccess', {
        url: '/checkoutsuccess',
        views: {
            'menuContent': {
                templateUrl: 'templates/checkout-success.html',
                controller: 'CheckoutSuccessCtrl'
            }
        }
    })
    .state('app.checkoutFailed', {
        url: '/checkoutfailed',
        views: {
            'menuContent': {
                templateUrl: 'templates/checkout-failed.html',
                controller: 'CheckoutFailedCtrl'
            }
        }
    })


    // .state('app.components', {
    //     url: '/components',
    //     views: {
    //         'menuContent': {
    //             templateUrl: 'templates/components.html',
    //             controller: 'ComponentsCtrl'
    //         }
    //     }
    // })
    ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/init');
});
