'use strict';

angular.module('komanaiApp')
  .controller('EventCtrl', function ($scope, socket) {
    $scope.message = 'Hello';
    console.log(socket);
    socket.socket.on('image:list', function(res) {
      $scope.images = res;
      console.log("GOT LSIT", res);
    });
  });
