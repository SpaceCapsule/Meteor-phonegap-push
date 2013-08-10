if (Meteor.isClient) {
  var userTokens = new Meteor.Collection('userTokens');

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
  Session.set('log', '-');
  function myLog(text) {
    //console.log(text);
    Session.set('log', text + '\n' + Session.get('log'));
  }

  Meteor.startup(function() {

    PhoneGap.addEventListener('deviceready', function() {
      Session.set('deviceready', true);
      myLog('------ DEVICE IS READY -------');

      PhoneGap.addEventListener('pushLaunch', function(e) {
        myLog('------ pushLaunch -------');
        _.each(e, function(value, key) {
          myLog(key + ' = ' + value);
        });
        if (e.payload.message) {
          Session.set('message', e.payload.message);
          Meteor.setTimeout(function() {
            Session.set('message', '');
          }, 4000);
        }
      });

      PhoneGap.addEventListener('pushError', function(e) {
        myLog('------ pushError -------');
      });

      PhoneGap.addEventListener('pushSuccess', function(e) {
        myLog('------ pushSuccess -------');
      });

      PhoneGap.addEventListener('pushToken', function(e) {
        myLog('------ pushToken -------');
        if (e.androidToken)
          myLog('Adroid Token: '+e.androidToken);
        if (e.iosToken)
          myLog('IOS Token: '+e.iosToken);

        if (e.androidToken) {
          Meteor.call('setAdroidToken', 1, e.androidToken);
        }
        if (e.iosToken) {
          Meteor.call('setIosToken', 1, e.iosToken);
        }
      });


      PhoneGap.addEventListener('backbutton', function(e) {
        myLog('------ backbutton -------');
      });

      PhoneGap.addEventListener('menubutton', function(e) {
        myLog('------ menubutton -------');
        PhoneGap.close();
      });

      PhoneGap.getValue('version', function(value) { 
        myLog('MeteorGap version: ' + value);
      });

      PhoneGap.getValue('device', function(value) { 
        myLog('Im on the ' + value.platform);
      });

      PhoneGap.addEventListener('pause', function(event) {
        myLog('------ DEVICE IS PAUSED -------');
      });

      PhoneGap.addEventListener('resume', function(event) {
        myLog('------ DEVICE IS RESUMED -------');
      });
      //PhoneGap.call('meteorPhonegapPush', { senderID: '' });

      PhoneGap.setReady();

    }); // EO Device ready




  }); // EO Start up




  Template.hello.greeting = function () {
    return "Welcome to pushtest.";
  };

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      Session.set('test', !Session.get('test'));
      Meteor.call('test', function(err, result) {
        myLog('test push sent');
      });
    }
  });


} // EO Client
