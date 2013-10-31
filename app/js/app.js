angular.module('myApp', [])
.provider('Weather', function() {
  var apiKey = "API_KEY";

  this.getUrl = function(type, ext) {
    return "http://api.wunderground.com/api/" +
      this.apiKey + "/" + type + "/q/" +
      ext + '.json';
  };

  this.setApiKey = function(key) {
    if (key) this.apikey = key;
  };

  this.$get = function($http) {
    return {
      // Service object
    };
  }
})

.config(function(WeatherProvider) {
  WeatherProvider.setApiKey('API_KEY')
})

.controller('MainCtrl', function($scope, $timeout) {
  // Build the date object
  $scope.date = {};

  // Update function
  var updateTime = function() {
    $scope.date.raw = new Date();
    $timeout(updateTime, 1000);
  }

  // Kick off the update function
  updateTime();
});
