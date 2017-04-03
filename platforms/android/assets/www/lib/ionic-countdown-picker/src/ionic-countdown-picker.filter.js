//By Johny Jugianto
//https://github.com/l1nknyto

(function () {
  'use strict';

  angular.module('ionic-countdown-picker')
    .filter('countdownlabel', function() {
      return function(input, settings, labels) {

        var useSeconds = (typeof settings.useSeconds !== 'undefined') ? settings.useSeconds : true;
        var useDays = (typeof settings.useDays !== 'undefined') ? settings.useDays : true;
        var daysLabel = (labels && labels.daysLabel) ? labels.daysLabel : 'd';
        var hoursLabel = (labels && labels.hoursLabel) ? labels.hoursLabel : 'h';
        var minutesLabel = (labels && labels.minutesLabel) ? labels.minutesLabel : 'm';
        var secondsLabel = (labels && labels.secondsLabel) ? labels.secondsLabel : 's';

        var result = "";
        var valueInSeconds = input.inSeconds;
        var roundFunction = (valueInSeconds >= 0) ? Math.floor : Math.ceil;

        if (useDays) {
          var days = roundFunction(valueInSeconds / 86400);
          valueInSeconds = (valueInSeconds % 86400);
          result = days + daysLabel + " : ";
        }

        var hours = roundFunction(valueInSeconds / 3600);
        valueInSeconds = (valueInSeconds % 3600);
        result = result + hours + hoursLabel + " : ";

        var minutes = roundFunction(valueInSeconds / 60);
        result = result + minutes + minutesLabel;

        if (useSeconds) {
          var seconds = valueInSeconds % 60;
          result = result + " : " + seconds + secondsLabel;
        }
        return result;
      }
    });

})();
