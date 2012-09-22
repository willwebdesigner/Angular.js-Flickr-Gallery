// Generated by CoffeeScript 1.3.3
(function() {
  var app;

  app = angular.module('Album', ['ui']);

  app.config(function($routeProvider) {
    return $routeProvider.when('/pages/:search_term/:page', {
      templateUrl: 'partials/listing.html',
      controller: 'AlbumController',
      resolve: {
        photos: function($q, $route, $timeout, $http) {
          var api_key, deferred, params, url;
          deferred = $q.defer();
          api_key = '2bb0b524a3e3cbb9ceaea74b30dabf93';
          url = 'http://api.flickr.com/services/rest/';
          params = {
            method: 'flickr.photos.search',
            api_key: api_key,
            text: $route.current.params.search_term || localStorage.getItem('search_term') || 'thailand',
            per_page: 12,
            format: 'json',
            page: $route.current.params.page || 1,
            jsoncallback: 'JSON_CALLBACK'
          };
          $http.jsonp(url, {
            params: params
          }).success(function(data, status, headers, config) {
            var page_info, photos;
            page_info = {};
            page_info.page = data.photos.page;
            page_info.pages = data.photos.pages;
            if ($route.current.params.page > page_info.pages) {
              $location.path("/pages/1/" + $route.current.params.search_term);
            }
            photos = _.map(data.photos.photo, function(photo) {
              console.log(photo);
              return {
                title: photo.title,
                thumb_src: "http://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_s.jpg",
                src: "http://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + ".jpg"
              };
            });
            return deferred.resolve([page_info, photos]);
          });
          return deferred.promise;
        }
      }
    }).otherwise({
      redirectTo: "/pages/" + (localStorage.getItem('search_term') || 'thailand') + "/1"
    });
  });

  app.controller('AlbumController', function($scope, $http, $location, $routeParams, photos) {
    var per_page;
    per_page = 12;
    $scope.photos = photos[1];
    $scope.page = photos[0].page;
    $scope.pages = photos[0].pages;
    $scope.end = $scope.page * per_page;
    $scope.start = $scope.end - (per_page - 1);
    $scope.search_term = $routeParams.search_term;
    $scope.q = $scope.search_term;
    $scope.set_current_photo = function(photo) {
      $scope.title = photo.title;
      return $scope.current_photo = photo;
    };
    $scope.search = function() {
      localStorage.setItem('search_term', $scope.q);
      return $location.path("pages/" + $scope.q + "/1");
    };
    $scope.next_page = function() {
      if ($scope.page >= $scope.pages) {
        return;
      }
      return $location.path("pages/" + $scope.search_term + "/" + ($scope.page + 1));
    };
    $scope.prev_page = function() {
      if ($scope.page <= 1) {
        return;
      }
      return $location.path("pages/" + $scope.search_term + "/" + ($scope.page - 1));
    };
    $scope.$on('$viewContentLoaded', function() {
      return $('#listing').focus();
    });
    return $scope.set_current_photo(_.first($scope.photos));
  });

}).call(this);