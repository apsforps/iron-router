IronRouteController = function (options) {
  var self = this;

  options = this.options = options || {};

  var getOption = function (key) {
    return Utils.pick(self[key], self.options[key]);
  };

  this.router = getOption('router');
  this.route = getOption('route');
  this.path = getOption('path');
  this.params = getOption('params') || [];
  this.where = getOption('where') || 'client';
  this.action = getOption('action') || 'run';

  this.hooks = {};
  this.hooks.before = Utils.toArray(options.before);
  this.hooks.after = Utils.toArray(options.after);
};

IronRouteController.prototype = {
  constructor: IronRouteController,

  runHooks: function (hookName, more) {
    var ctor = this.constructor
      , instanceHooks = this.hooks[hookName]
      , more = Utils.toArray(more)
      , inheritedHooks
      , allHooks;

    var collectInheritedHooks = function (ctor) {
      var hooks = [];

      if (ctor.__super__)
        hooks = hooks.concat(collectInheritedHooks(ctor.__super__.constructor));
      
      return ctor.prototype[hookName] ?
        hooks.concat(ctor.prototype[hookName]) : hooks;
    };

    var collectedHooks = collectInheritedHooks(this.constructor);

    allHooks = collectedHooks.concat(more);

    for (var i = 0, hook; hook = allHooks[i]; i++) {
      if (this.stopped)
        break;
      hook.call(this);
    }
  },

  runActionWithHooks: function () {
    throw new Error('not implemented');
  },

  run: function () {
    throw new Error('not implemented');
  },

  stop: function() {
    this.stopped = true;
  }
};

_.extend(IronRouteController, {
  /**
   * Inherit from IronRouteController
   *
   * @param {Object} definition Prototype properties for inherited class.
   */

  extend: function (definition) {
    return Utils.extend(this, definition, function (definition) {
      var klass = this;
      
      /*
        Allow calling a class method from javascript, directly in the subclass
        definition.

        Instead of this:
          MyController = RouteController.extend({...});
          MyController.before(function () {});

        You can do:
          MyController = RouteController.extend({
            before: function () {}
          });
       
        And in Coffeescript you can do:
         MyController extends RouteController
           @before function () {}
       */
    });
  }
});
