require('../factory');

function spec(b) {
  var dependency = b.dependency || require('./dependency');

  function Dummy() {
  };

  Dummy.prototype.foo = function() {
    return 'bar';  
  };

  Dummy.prototype.double5 = function() {
    return dependency.double(5);
  };
  return Dummy;
};

module.defineClass(spec);
