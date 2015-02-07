'use strict';

angular.module('komanaiApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('event', {
        url: '/event',
        templateUrl: 'app/event/event.html',
        controller: 'EventCtrl'
      });
  });