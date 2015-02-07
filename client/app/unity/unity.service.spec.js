'use strict';

describe('Service: unity', function () {

  // load the service's module
  beforeEach(module('komanaiApp'));

  // instantiate service
  var unity;
  beforeEach(inject(function (_unity_) {
    unity = _unity_;
  }));

  it('should do something', function () {
    expect(!!unity).toBe(true);
  });

});
