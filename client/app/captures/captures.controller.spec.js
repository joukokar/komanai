'use strict';

describe('Controller: CapturesCtrl', function () {

  // load the controller's module
  beforeEach(module('komanaiApp'));

  var CapturesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CapturesCtrl = $controller('CapturesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
