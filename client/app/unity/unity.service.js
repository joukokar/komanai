'use strict';

angular.module('komanaiApp')
  .service('unity', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var service = {};
    service.u = new UnityObject2();

    service.moveToPosition = function(x,y) {
      service.u.getUnity().SendMessage("MainCamera", "MoveToPosition", x + "," + y);
    }
    return service;
  });
