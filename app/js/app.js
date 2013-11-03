angular.module('myApp', ['ngRoute'])
.provider('Weather', function () {
  'use strict';
  var apiKey = "5380e57c137f0cef";

  this.getUrl = function (type, ext) {
    return "http://api.wunderground.com/api/" +
      this.apiKey + "/" + type + "/q/" +
      ext + '.json';
  };

  this.setApiKey = function (key) {
    if (key) this.apiKey = key;
  };

  this.$get = function ($q, $http) {
    var self = this;
    return {
      getWeatherForecast: function (city) {
        var d = $q.defer();
        $http({
          method: 'GET',
          url: self.getUrl("forecast", city),
          cache: true
        }).success(function (data) {
          // Wunderground API returns the object
          d.resolve(data.forecast.simpleforecast);
        }).error(function (err) {
          d.reject(err);
        });
        return d.promise;
      }
    };
  };
})

.config(function (WeatherProvider) {
  WeatherProvider.setApiKey('5380e57c137f0cef');
})

.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'templates/home.html',
      controller: 'MainCtrl'
    })
    .when('/settings', {
      templateUrl: 'templates/settings.html',
      controller: 'SettingsCtrl'
    })
    .otherwise({ redirectTo: '/' });
})

.controller('MainCtrl', function ($scope, $timeout, Weather, UserService) {
  // Build the date object
  $scope.date = {};
  // Update function
  var updateTime = function () {
    $scope.date.raw = new Date();
    $timeout(updateTime, 1000);
  };

  // Wunderground weather service
  $scope.weather = {};
  $scope.user = UserService.user;
  Weather.getWeatherForecast($scope.user.location)
  .then(function (data) {
    $scope.weather.forecast = data;
  });

  // Kick off the update function
  updateTime();
})

.controller('SettingsCtrl',
  function ($scope, UserService) {
    $scope.user = UserService.user;

    $scope.save = function () {
      UserService.save();
    }
})

.factory('UserService', function () {
  var defaults = {
    location: 'autoip'
  };
  var service = {
    user: {},
    save: function () {
      sessionStorage.presently =
        angular.toJson(service.user);
    },
    restore: function () {
      // Pull from sessionStorage
      service.user =
        angular.fromJson(sessionStorage.presently) || defaults

      return service.user;
    }
  };
  // Immediatly call restore from the session storage
  service.restore();
  return service;
})
