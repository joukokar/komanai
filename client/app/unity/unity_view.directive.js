'use strict';

angular.module('komanaiApp')
  .directive("unityView", function(unity) {
    return {
      restrict: "A",
      link: function (scope, elem, attrs) {
        scope.unity = unity;
        unity.u.initPlugin(angular.element(elem), "/assets/komanai_web.unity3d");
      }

    }
  });
