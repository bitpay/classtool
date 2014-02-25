var factory = require('../factory');

var mocha = require('mocha');
var should = require('chai').should();

var testInstanceWorks = function(instance){
  should.exist(instance);
  instance.foo.should.not.throw (Error);
  instance.foo().should.equal('bar');
  instance.double5().should.equal(10);
};

var testClassWorks = function(Class) {
  should.exist(Class);
  var instance = new Class();
  testInstanceWorks(instance);
};

describe('Factory Module', function() {
  describe('#defineClass', function() {
    it('should extend module object', function() {
      should.exist(module.defineClass);
    });
    it('should allow creation of a default class by require', function() {
      var Dummy = require('./dummy');
      should.exist(Dummy);
      testClassWorks(Dummy);
    });
    it('default class by require should not contain factory objects', function() {
      var Dummy = require('./dummy');
      should.not.exist(Dummy.createClass);
      should.not.exist(Dummy.class);
      should.not.exist(Dummy.default);
      should.not.exist(Dummy.new);

    });
  });
  describe('factory object', function() {
    it('should create a factory object', function() {
      var DummyFactory = require('./dummy').factory;
      should.exist(DummyFactory);
    });
    it('factory#createClass', function() {
      var DummyFactory = require('./dummy').factory;
      var TestDummy = DummyFactory.createClass('Test Dummy Class');
      testClassWorks(TestDummy);
    });
    it('factory#createClass with custom dependencies', function() {
      var DummyFactory = require('./dummy').factory;
      var TestDummyWithCustomDep = DummyFactory.createClass({
        dependency: {
          double: function(x) {return x+x;}
        }
      });
      testClassWorks(TestDummyWithCustomDep);
    });
    it('factory#class', function() {
      var DummyFactory = require('./dummy').factory;
      var TestDummy2 = DummyFactory.class();
      testClassWorks(TestDummy2);
    });
    it('factory#default', function() {
      var DummyFactory = require('./dummy').factory;
      var d = DummyFactory.default();
      testInstanceWorks(d);
      DummyFactory.default().should.equal(d);
      DummyFactory.default().should.equal(d);
      DummyFactory.default().should.equal(d);
    });
    it('factory#new', function() {
      var DummyFactory = require('./dummy').factory;
      var d = DummyFactory.new();
      var e = DummyFactory.new();
      testInstanceWorks(d);
      testInstanceWorks(e);
      d.should.not.equal(e);
      DummyFactory.default().should.not.equal(e);
      DummyFactory.default().should.not.equal(d);
    });

  });
})
