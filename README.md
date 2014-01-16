Classy
======

This is a simple tool to enable class like idioms in JavaScript.  It is notably different
from traditional class based inheritance in the following ways:

- inheritance structure is not part of the class definition
- bindings to the outside are explicit (including binding to a superclass)
- default bindings allow for easy class creation while preserving override capability

The following is an example class definition:

    function ClassSpec(b) {
      var fs = b.fs || require('fs'); // example of a binding
   
      function Class() {
        // Body of constructor function
      };
      // Optional - Define a default (but overridable) superclass
      Class.superclass = b.superclass || require('./superClass').class();   

      Class.prototype.methodA = function() {
        // Body of method A
      };
   
      Class.prototype.methodB = function() {
        // Body of method B
      };

      return Class;
    };
    module.defineClass(ClassSpec); 

To use classy, simply require it at the beginning of your program:

    require('classtool');

There are two ways to instantiate the class in client code:

    var MyClass = require('./path/to/classfile').class();
    var MyClass = require('./path/to/classfile').createClass({fs: mockFileSystem});

In the first example, each call will return the same class instance (the 'default' 
class instance).  In the second example, each call returns a new class instance.  The 
second call also shows how you would override the default bindings (passing in an 
object meant to mimic the file system in this example). 

Class instances can be registered in a dictionary of named classes as follows:

    var MyClassForTesting = require('./classfile').createClass('testing', {fs: mockFileSystem});
    var MyRealClass = require('./classfile').createClass('real', {fs: require('fs')});

You can later reference the same class instances as follows:

    var MyClassForTesting = require('./classfile').class('testing');
    var MyRealClass = require('./classfile').class('real');

If the name is omitted, "default" is used.  The following expressions are equivalent:

    var MyClass = require('./classfile').class();
    var MyClass = require('./classfile').class('default');

To create an inheritance chain, use the method inherit() as follows:

    MyClass.inherit(MySuperClass);
    MyClass.inherit(MySuper, MySuperSuper, MySuperDeDuper);

To create instances of your class, do the following:

    new MyClass();

For convenience, the "new" method is exported to allow instantiation:

    var myInstance = require('./myClass').new();

This form is equivalent to:

    var MyClass = require('./myClass').class();
    var myInstance = new MyClass();

You may also instantiate instances of a specific class as follows:

    var myTestInstance = require('./myClass').new('test');

It's also possible to explicitly invoke methods of a superclass.  Invoke the superclass 
constructor as follows:

    function Class() {
      Class.super(this, arguments);
    };

Invoke any normal method in the superclass as follows:

    Class.prototype.methodA = function() {
      Class.super(this, 'methodA', arguments);
    };

