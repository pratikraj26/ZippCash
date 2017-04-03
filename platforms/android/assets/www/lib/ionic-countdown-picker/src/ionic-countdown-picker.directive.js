//By Johny Jugianto
//https://github.com/l1nknyto

(function () {
  'use strict';

  angular.module('ionic-countdown-picker')
    .directive('countdownPicker', countdownPicker);

  countdownPicker.$inject = ['$ionicPopup'];
  function countdownPicker($ionicPopup) {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        inputObj: "=inputObj"
      },
      link: function (scope, element, attrs) {

        scope.useSeconds = (typeof scope.inputObj.useSeconds !== 'undefined') ? scope.inputObj.useSeconds : true;
        scope.useDays = (typeof scope.inputObj.useDays !== 'undefined') ? scope.inputObj.useDays : true;
        scope.secondStep = scope.inputObj.secondStep ? scope.inputObj.secondStep : 15;
        scope.minuteStep = scope.inputObj.minuteStep ? scope.inputObj.minuteStep : 5;
        scope.daysLabel = scope.inputObj.daysLabel ? scope.inputObj.daysLabel : 'Days';
        scope.hoursLabel = scope.inputObj.hoursLabel ? scope.inputObj.hoursLabel : 'Hours';
        scope.minutesLabel = scope.inputObj.minutesLabel ? scope.inputObj.minutesLabel : 'Mins';
        scope.secondsLabel = scope.inputObj.secondsLabel ? scope.inputObj.secondsLabel : 'Secs';
        scope.titleLabel = scope.inputObj.titleLabel ? scope.inputObj.titleLabel : 'Countdown Picker';
        scope.setLabel = scope.inputObj.setLabel ? scope.inputObj.setLabel : 'Set';
        scope.closeLabel = scope.inputObj.closeLabel ? scope.inputObj.closeLabel : 'Close';
        scope.setButtonType = scope.inputObj.setButtonType ? scope.inputObj.setButtonType : 'button-positive';
        scope.closeButtonType = scope.inputObj.closeButtonType ? scope.inputObj.closeButtonType : 'button-stable';

        scope.increaseDays = function () {
          scope.time.days = Number(scope.time.days);
          scope.time.days += 1;
          scope.time.days = (scope.time.days < 10) ? ('0' + scope.time.days) : scope.time.days;
        };

        scope.decreaseDays = function () {
          scope.time.days = Number(scope.time.days);
          if (scope.time.days > 0) {
            scope.time.days -= 1;
          }
          scope.time.days = (scope.time.days < 10) ? ('0' + scope.time.days) : scope.time.days;
        };

        scope.increaseHours = function () {
          scope.time.hours = Number(scope.time.hours);
          if (scope.time.hours != 23) {
            scope.time.hours += 1;
          } else {
            scope.time.hours = 0;
          }
          scope.time.hours = (scope.time.hours < 10) ? ('0' + scope.time.hours) : scope.time.hours;
        };

        scope.decreaseHours = function () {
          scope.time.hours = Number(scope.time.hours);
          if (scope.time.hours > 0) {
            scope.time.hours -= 1;
          } else {
            scope.time.hours = 23;
          }
          scope.time.hours = (scope.time.hours < 10) ? ('0' + scope.time.hours) : scope.time.hours;
        };

        scope.increaseMinutes = function () {
          scope.time.minutes = Number(scope.time.minutes);
          if (scope.time.minutes != (60 - scope.minuteStep) && (scope.time.minutes + scope.minuteStep <= 60)) {
            scope.time.minutes += scope.minuteStep;
          } else {
            scope.time.minutes = 0;
          }
          scope.time.minutes = (scope.time.minutes < 10) ? ('0' + scope.time.minutes) : scope.time.minutes;
        };

        scope.decreaseMinutes = function () {
          scope.time.minutes = Number(scope.time.minutes);
          if (scope.time.minutes !== 0 && (scope.time.minutes - scope.minuteStep >= 0)) {
            scope.time.minutes -= scope.minuteStep;
          } else {
            scope.time.minutes = 60 - scope.minuteStep;
          }
          scope.time.minutes = (scope.time.minutes < 10) ? ('0' + scope.time.minutes) : scope.time.minutes;
        };

        scope.increaseSeconds = function () {
          scope.time.seconds = Number(scope.time.seconds);
          if (scope.time.seconds != (60 - scope.secondStep) && (scope.time.seconds + scope.secondStep <= 60)) {
            scope.time.seconds += scope.secondStep;
          } else {
            scope.time.seconds = 0;
          }
          scope.time.seconds = (scope.time.seconds < 10) ? ('0' + scope.time.seconds) : scope.time.seconds;
        };

        scope.decreaseSeconds = function () {
          scope.time.seconds = Number(scope.time.seconds);
          if (scope.time.seconds !== 0 && (scope.time.seconds - scope.secondStep >= 0)) {
            scope.time.seconds -= scope.secondStep;
          } else {
     	       scope.time.seconds = 60 - scope.secondStep;
          }
          scope.time.seconds = (scope.time.seconds < 10) ? ('0' + scope.time.seconds) : scope.time.seconds;
        };

        element.on("click", function () {

          var valueInSeconds = scope.inputObj.value.inSeconds ? scope.inputObj.value.inSeconds : 0;
          scope.time = {days: 0, hours: 0, minutes: 0, seconds: 0};

          if (scope.useDays) {
            scope.time.days = Math.floor(valueInSeconds / 86400);
            scope.time.days = (scope.time.days < 10) ? ("0" + scope.time.days) : (scope.time.days);
            valueInSeconds = (valueInSeconds % 86400);
          }

          scope.time.hours = Math.floor(valueInSeconds / 3600);
          scope.time.hours = (scope.time.hours < 10) ? ("0" + scope.time.hours) : (scope.time.hours);
          valueInSeconds = (valueInSeconds % 3600);

          scope.time.minutes = Math.floor(valueInSeconds / 60);
          scope.time.minutes = (scope.time.minutes < 10) ? ("0" + scope.time.minutes) : (scope.time.minutes);

          if (scope.useSeconds) {
            scope.time.seconds = valueInSeconds % 60;
            scope.time.seconds = (scope.time.seconds < 10) ? ("0" + scope.time.seconds) : (scope.time.seconds);
          }

          $ionicPopup.show({
            templateUrl: 'ionic-countdown-picker.html',
            title: scope.titleLabel,
            subTitle: '',
            scope: scope,
            buttons: [
              {
                text: scope.closeLabel,
                type: scope.closeButtonType,
                onTap: function (e) {
                  scope.inputObj.callback(undefined);
                }
              },
              {
                text: scope.setLabel,
                type: scope.setButtonType,
                onTap: function (e) {
                  var totalSec = (scope.time.days * 86400) + (scope.time.hours * 3600) + (scope.time.minutes * 60) + scope.time.seconds;
                  scope.inputObj.callback(totalSec);
                }
              }
            ]
          });
        });
      }
    };
  }

})();
