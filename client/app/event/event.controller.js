'use strict';

angular.module('komanaiApp')
  .controller('EventCtrl', function ($scope, socket, unity) {
    $scope.mode = 'map';
    $scope.unity = unity;
    $scope.left = 0;
    $scope.position = 'inherit';

  });
