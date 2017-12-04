  var baseUrl = "https://api.apixu.com/v1/current.json";
  var position = { 
    coords: { 
      latitude: 52.51, 
      longitude: 13.35 
    }
  };

  var dirs = {
    "N":   "North",
    "NNE": "North by Northeast",
    "NE":  "Northeast",
    "ENE": "East by Northeast",
    "E":   "East",
    "ESE": "East by Southeast",
    "SE":  "Southeast",
    "SSE": "South by Southeast",
    "S":   "South",
    "SSW": "South by Soutwest",
    "SW":  "Southwest",
    "WSW": "West by Southwest",
    "W":   "West",
    "WNW": "West by Northwest",
    "NW":  "Northwest",
    "NNW": "North by Northwest"
  }

  var app = angular.module("app", ['ngSanitize']);

  app.factory("weather", function($http) {
    var obj = {};
  
    obj.getCurrent = function(lat,long) {
      return $http.get(
        baseUrl + "?key=7528feddd67d4beda6e150057171505&q=" + 
        lat + "," + long
      );
    };
    return obj;
  });

  function setImperial($scope, i) {
    if (i) {
      $scope.imperial = true;
      $scope.units = "Metric";
      $scope.temp_val = $scope.temp_f;
      $scope.wind_val = $scope.wind_mph;
      $scope.pressure_val = $scope.pressure_in;
      $scope.temp_unit = "&deg;F";
      $scope.pressure_unit = "in";
      $scope.wind_unit = "mph";
    } else {
      $scope.imperial = false;
      $scope.units = "Imperial";
      $scope.temp_val = $scope.temp_c;
      $scope.wind_val = $scope.wind_kph;
      $scope.pressure_val = $scope.pressure_mb;
      $scope.temp_unit = "&deg;C";
      $scope.pressure_unit = "mb";
      $scope.wind_unit = "kph";
    }
  }

  function getWeather (position, $scope, weather) {
    weather.getCurrent(
      position.coords.latitude,
      position.coords.longitude
    )
    .then(
      function (response) {
        $scope.latitude = position.coords.latitude,
        $scope.longitude = position.coords.longitude
        $scope.country = response.data.location.country;
        $scope.region = response.data.location.region;
        $scope.name = response.data.location.name;
        $scope.humidity = response.data.current.humidity;
        $scope.wind_dir = dirs[response.data.current.wind_dir];
        $scope.temp_f = response.data.current.temp_f;
        $scope.wind_mph = response.data.current.wind_mph;
        $scope.pressure_in = response.data.current.pressure_in;
        $scope.temp_c = response.data.current.temp_c;
        $scope.wind_kph = response.data.current.wind_kph;
        $scope.pressure_mb = response.data.current.pressure_mb;

        if ($scope.units === "")
          setImperial($scope, /united states|lyberia/i.test($scope.country));
        
        $scope.position = position;
        $scope.data = response.data;
        $scope.icon = response.data.current.condition.icon;
      },
      function (response) {
        $scope.position = position;
      }
    );
  }

  app.controller("ctrl", function($scope, weather) {
    $scope.toggleUnits = function () {
      setImperial($scope, ! $scope.imperial);
    }
    $scope.reload = function () {
      getWeather (position, $scope, weather);
    }
    $scope.units = "";
    navigator.geolocation.getCurrentPosition( function(position) {
      getWeather (position, $scope, weather);
    },
    function() {
      getWeather (position, $scope, weather);
    });
  });