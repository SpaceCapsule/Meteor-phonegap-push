if (Meteor.isClient) {
  if (typeof Handlebars !== 'undefined') {
    var jsAllowedScope = function (jsAllowedScope) {
      var scope = {};         // Object to build helper scope
      // Build scope
      _.each(jsAllowedScope, function(reference, key) {
        scope[key] = _.bind(function() { return this; }, reference);
      });

      return scope;
    } // EO jsAllowedScope

    var jsScope = jsAllowedScope({
        'Session': window.Session,
        'Meteor': window.Meteor,
        'console': window.console
    });

    Handlebars.registerHelper('$', function() {
      return jsScope;
    });
  } // EO Handlebars


  Session.set('deviceready', false);

  Meteor.startup(function() {

    PhoneGap.addEventListener('deviceready', function() {
      Session.set('deviceready', true);
      console.log('------ DEVICE IS READY -------');

      PhoneGap.addEventListener('backbutton', function(e) {
        console.log('------ backbutton -------');
      });

      PhoneGap.addEventListener('menubutton', function(e) {
        console.log('------ menubutton -------');
      });

      PhoneGap.getValue('version', function(value) { 
        console.log('MeteorGap version: ' + value);
      });

       PhoneGap.getValue('device', function(value) { 
        console.log('Im on the ' + value.platform);
      });

/*
      PhoneGap.addEventListener('pushLaunch', function(e) {
        console.log('------ pushLaunch -------');
      });

      PhoneGap.addEventListener('pushError', function(e) {
        console.log('------ pushError -------');
      });

      PhoneGap.addEventListener('pushToken', function(e) {
        console.log('------ pushToken -------');
      });

      PhoneGap.addEventListener('pushSuccess', function(e) {
        console.log('------ pushSuccess -------');
      });*/

      //PhoneGap.call('meteorPhonegapPush', { senderID: '' });


    }); // EO Device ready

    PhoneGap.addEventListener('pause', function(event) {
      console.log('------ DEVICE IS PAUSED -------');
    });

    PhoneGap.addEventListener('resume', function(event) {
      console.log('------ DEVICE IS RESUMED -------');
    });
  }); // EO Start up




  Template.hello.greeting = function () {
    return "Welcome to pushtest.";
  };

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
      Session.set('test', !Session.get('test'));
    }
  });


} // EO Client
