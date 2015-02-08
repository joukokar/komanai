'use strict';

angular.module('komanaiApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('captures', {
        url: '/captures',
        templateUrl: 'app/captures/captures.html',
        controller: 'CapturesCtrl'
      });
  });