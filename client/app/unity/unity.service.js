'use strict';

angular.module('komanaiApp')
  .service('unity', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var service = {};
    service.u = new UnityObject2();
    service.currentPos = {};

    // TODO: does not belong here
    service.showingImage = -1;

    service.moveToPosition = function(x,y,z) {
      service.currentPos = {x:x, y:y, z:z}
      service.u.getUnity().SendMessage("MainCamera", "MoveToPosition", x + "," + y + "," + z);
    }
    return service;
  });
