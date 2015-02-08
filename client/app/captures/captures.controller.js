'use strict';

angular.module('komanaiApp')
  .controller('CapturesCtrl', function ($scope, socket) {
    $scope.message = 'Hello';
    $scope.images = [];

    socket.socket.on('image:list', function(images) {
      $scope.images = images;
    });

    $scope.setRating = function(image, rating) {
      socket.socket.emit('image:rate', {filename: image.filename, rating:rating});
      image.rating = rating;
    }
  });
