// Define functions and methods used for simulating class like structures
// including inheritance.  An important feature of this system is that it
// enables one to define a class like structure while controlling all bindings
// to the outside world.  This approach allows a class to be instantiated 
// multiple times, which enables a more compositional approach to inheritance. 

var defineClass = function(classConstructor) {
  var self = this;
  var classes = {};
  var defaultInstance;
  
  // Private class constructor
  function _createClass(bindings) {
    var answer = classConstructor(bindings || {});
    answer.inherit = function(parent) {
      if(arguments.length > 1) {
        // this allows chaining multiple classes in the call
        parent.inherit(Array.prototype.slice.call(arguments, 1));
      }
      this._super = parent;
      Object.defineProperty(this.prototype, '_constructor', {enumerable: false, value: this});
      this.prototype.__proto__ = parent.prototype;
      this.__proto__ = parent;

      // Make parent's methods available in the child
      if(answer.copyMethods) {
        for(var m in parent.prototype) {
          if(!this.prototype[m]) {
            this.prototype[m] = parent.prototype[m];
          }
        }        
      }
    };
    answer.super = function(receiver, method, args) {
      if(!this._super) return;
      if(typeof method == 'string') {
        return this._super.prototype[method].apply(receiver, args);
      } else {
        return this._super.apply(receiver, method);
      }
    };
    if(answer.superclass) answer.inherit(answer.superclass);
    return answer;
  };

  // Private class wrapper (we wrap classes to enable cyclic references)
  function _wrapClass(wrapper, cls) {
    wrapper.prototype = cls.prototype;
    wrapper.prototype._constructor = wrapper;
    wrapper._super = cls._super;
    wrapper.inherit = cls.inherit;
    wrapper.super = cls.super;
    for(x in cls) {
      wrapper[x] = cls[x];
    }
    return wrapper;
  };

  // Public createClass() function - creates a new class with the given
  // bindings and an optional name...the name, if given, can be used to
  // later recall the same class instance using class())
  var createClass = function(name, bindings) {
    if(typeof name != 'string') return _createClass(name);
    classes[name] = function() {return tmp.apply(this, arguments);};
    var tmp = _createClass(bindings);
    return _wrapClass(classes[name], tmp);
  };

  // Public class() function - Return the class for the given name if 
  // it has already been created, otherwise create it (note, you cannot 
  // override the default bindings with this method, use createClass() if
  // you need to override the default bindings).  If the name is omitted, 
  // use 'default'
  var class_ = function(name) {
    name = name || 'default';
    if(classes[name]) return classes[name];
    return this.createClass(name);
  };

  // Public default() method - This is a convenience function to 
  // create and retain a default instance
  var default_ = function() {
    if(!defaultInstance) defaultInstance = this.new();
    return defaultInstance;
  };

  // Public new() method - This is a convenience function to create a 
  // new instance of the "default" class instance
  var new_ = function() {
    var ClassInstance = this.class();
    var answer = Object.create(ClassInstance.prototype);
    ClassInstance.apply(answer, arguments);
    return answer;
  };

  factory = {};
  factory.createClass = createClass;
  factory.class = class_;
  factory.default = default_;
  factory.new = new_;
  this.exports = factory.class();
  this.exports.factory = factory;

};

module.__proto__.defineClass = defineClass;
