'use strict';

angular.module('komanaiApp')
  .controller('EventCtrl', function ($scope, socket, unity) {
    $scope.mode = 'map';
    $scope.unity = unity;
    $scope.left = 0;
    $scope.position = 'inherit';

    $scope.setMode = function(mode)  {
      $scope.mode = mode;
      if(mode == '3d') {
        $scope.left = 0;
        $scope.position = 'inherit';
      }
      if(mode == 'map') {
        $scope.left = '-3000px';
        $scope.position = 'absolute';
      }
    }

    socket.socket.on('image:list', function(res) {
      $scope.images = res;
    });
  });
