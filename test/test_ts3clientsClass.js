var assert = require('assert'),
    ts3clientsClass = require('./../lib/src/class/ts3clientsClass.js').create;
describe('ts3clientsClass', function() {
    it('object create successful', function() {
        var testedObject = ts3clientsClass();
        testedObject.actualizeCommonInfo.should.be.a('function');
    });
    it('fill object with data', function() {
    });
});
