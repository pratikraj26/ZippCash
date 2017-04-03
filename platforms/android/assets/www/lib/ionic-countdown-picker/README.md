##Introduction:

Countdown time picker component for ionic framework.
Fork from ionic-timepicker

TODO

##Prerequisites.

1) node.js, bower and gulp.

##How to use:

1) In your project repository install the ionic time picker using bower

`bower install ionic-countdown-picker --save`

2) Give the path of  `ionic-countdown-picker.bundle.min.js` in your `index.html` file.

````html
<!-- path to ionic/angularjs js -->
<script src="lib/ionic-countdown-picker/dist/ionic-countdown-picker.bundle.min.js"></script>
````

3) In your application module inject the dependency `ionic-countdown-picker`, in order to work with the `ionic-countdown-picker` component

````javascript
angular.module('modulename', ['ionic', 'ionic-countdown-picker']){

}
````

4) Use the below format in your template's corresponding controller

````javascript
$scope.countdown = {inSeconds: 86400};
$scope.countdownPickerObject = {
  useSeconds: false,
  value: $scope.countdown,
  callback: function (val) {
    countdownPickerCallback(val);
  }
};
````
**$scope.countdown** is the object, that store value in seconds for the countdown-picker and countdownlabel.

**$scope.countdownPickerObject** is the object, that we need to pass to the directive. The properties of this object are as follows.

**a) useSeconds** (Optional) : This the flag for use seconds or not. Default value is `true`;

**b) useDays** (Optional) : This the flag for use days or not. Default value is `true`;

**c) secondStep** (Optional) : This the second increment / decrement step. Default value is 15;

**d) minuteStep** (Optional) : This the minute increment / decrement step. Default value is 5;

**e) daysLabel** (Optional) : The `Title` for the days header. Default value is `Days`;

**f) hoursLabel** (Optional) : The `Title` for the hours header. Default value is `Hours`;

**g) minutesLabel** (Optional) : The `Title` for the minutes header. Default value is `Mins`;

**h) secondsLabel** (Optional) : The `Title` for the seconds header. Default value is `Secs`;

**i) titleLabel** (Optional) : The `Title` for the popup. Default value is `Countdown Picker`

**j) setLabel** (Optional) : The label for the `Set` button. Default value is `Set`

**k) closeLabel** (Optional) : The label for the `Close` button. Default value is `Close`

**l) setButtonType** (Optional) : This the type of the `Set` button. Default value is `button-positive`. You can give any valid ionic framework's button classes.

**m) closeButtonType** (Optional) : This the type of the `Close` button. Default value is `button-stable`. You can give any valid ionic framework's button classes.

**n) callback** (Mandatory) : This the callback function, which will get the selected time in to the controller. You can define this function as follows.
````javascript
function countdownPickerCallback(val) {
  if (typeof (val) !== 'undefined') {
    $scope.countdown.inSeconds = val;
  }
}
````

5) Then use the below format in your template / html file

````html
<countdown-picker input-obj="countdownPickerObject">
  <button class="button button-clear overflowShow" type="button">
    {{countdown | countdownlabel:countdownPickerObject:labels}}
  </button>
</countdown-picker>
````

**labels** is the object that hold label for time suffix. The properties of this object are as follows.

**a) daysLabel** (Optional) : The `Title` for the days suffix. Default value is `d`;

**b) hoursLabel** (Optional) : The `Title` for the hours suffix. Default value is `h`;

**c) minutesLabel** (Optional) : The `Title` for the minutes suffix. Default value is `m`;

**d) secondsLabel** (Optional) : The `Title` for the seconds suffix. Default value is `s`;


##Screen Shots:

TODO

##Versions:

### 1) v0.0.1
Initial ionic countdown timer fork from ionic-timepicker

##License:
[MIT](https://github.com/l1nknyto/ionic-countdown-picker/blob/master/LICENSE.MD "MIT")

##Contact:
github : https://github.com/l1nknyto

