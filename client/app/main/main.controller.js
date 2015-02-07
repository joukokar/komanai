'use strict';

angular.module('komanaiApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.awesomeThings = [];
    $scope.events = [{
      name: "大江戸川花火大会2015年",
      img: "/assets/images/edogawa-hanabi.jpg",
      info: "最高"
    },{
      name: "浅草雷門祭り",
      img: "/assets/images/asakusa-matsuri.jpg",
      info: "最高"
    },{
      name: "多摩川花火大会",
      img: "/assets/images/tamagawa-hanabi.jpg",
      info: "最高"
    }];


    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  });
