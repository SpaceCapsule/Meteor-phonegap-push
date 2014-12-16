Package.describe({
  name: 'raix:phonegap-push',
  version: '0.0.1',
  summary: 'Meteor push server for IOS and android'
});

// Server-side push deps 
Npm.depends({
  'apn' : '1.4.2', // 1.3.8
  //'debug': '0.7.3', // DEBUG
  'node-gcm' : '0.9.6' // 0.9.6
});

Cordova.depends({
  //'com.clone.phonegap.plugins.pushplugin': '2.4.1' //with #354 fixed
  'com.phonegap.plugins.PushPlugin': 'http://github.com/rossmartin/PushPlugin/tarball/6cf2e1a107310e859839fb7a0dc2618a7a199430'
});

Package.onUse(function (api) {
  api.versionsFrom('1.0');

  api.use(['raix:cordova@0.2.0'], 'client');
  api.addFiles('web.cordova.js', 'web.cordova');
  api.addFiles('web.browser.js', 'web.browser');


  api.addFiles([
          'android.server.js',
          'ios.server.js',
          'push.server.js'
          ], 'server');

  api.export('CordovaPush', 'server');

});


