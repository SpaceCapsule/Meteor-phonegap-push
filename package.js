Package.describe({
  summary: "Meteor phonegap push, IOS and android"
});

Npm.depends({
        'apn' : '1.2.6',
        'node-gcm' : '0.9.4'
});


Package.on_use(function (api) {
  //api.use('', 'client');

  	api.add_files([
					'phonegap.client.js',
					'generic.push.client.js'
					], 'client');

  	api.add_files([
  					'android.server.js',
  					'ios.server.js',
  					'notifyer.server.js'
  					], 'server');
});