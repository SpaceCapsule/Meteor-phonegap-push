Package.describe({
  version: '0.0.0',
  summary: ""
});

Package.describe({
  summary: "Meteor push server for IOS and android\n"+
  "\u001b[32mv0.0.3\n"+
  "\u001b[33m-----------------------------------------\n"+
  "\u001b[0m Meteor push server for IOS and android   \n"+
  "\u001b[0m                                          \n"+
  "\u001b[33m-------------------------------------RaiX\n"
});


// Server-side push deps 
Npm.depends({
        'apn' : '1.4.2', // 1.3.8
        //'debug': '0.7.3', // DEBUG
        'node-gcm' : '0.9.6' // 0.9.6
});


Package.on_use(function (api) {

  api.add_files([
          'android.server.js',
          'ios.server.js',
          'push.server.js'
          ], 'server');
  api.export && api.export('CordovaPush', 'server');
});


