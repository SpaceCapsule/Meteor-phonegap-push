// 

window.pushNotification = window.plugins.pushNotification;

if (typeof MeteorCordova === 'undefined') {
	throw new Error('MeteorCordova Push plugin requires MeteorCordova to be loaded');
}

MeteorCordova.prototype.initPush = function(options) {
	var self = this;
	var _options = {
		senderID: (options.senderID)?''+options.senderID: '',
		badge: (options.badge === false)?'false': 'true',
		sound: (options.sound === false)?'false': 'true',
		alert: (options.alert === false)?'false': 'true'
	};

	// handle APNS notifications for iOS
	window.onNotificationAPN = function(e) {
	    if (e.alert) {
	         navigator.notification.alert(e.alert);
	    }
	        
	    if (e.sound) {
	        var snd = new Media(e.sound);
	        snd.play();
	    }
	    
	    if (e.badge) {
	        pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
	    }

		self.triggerEvent('pushLaunch', e);//e.alert });
	}

	// handle GCM notifications for Android
	window.onNotificationGCM = function(e) {
		console.log('onNotificationGCM is called');
	    switch( e.event )
	    {
	        case 'registered':
			if ( e.regid.length > 0 ) {
				//console.log('ANDROID TOKEN: '+e.regid);
				self.triggerEvent('pushToken', { 'androidToken': ''+e.regid } ); //regID??
			}
	        break;
	        
	        case 'message':
		
				// if this flag is set, this notification happened while we were in the foreground.
	        	// you might want to play a sound to get the user's attention, throw up a dialog, etc.
	        	if (e.foreground)
	        	{
					// if the notification contains a soundname, play it.
					// var my_media = new Media("/android_asset/www/"+e.soundname);
					// my_media.play();
				}

				self.triggerEvent('pushLaunch', e ); // e.foreground, e.foreground, Coldstart or background
				// e.payload.message, e.payload.msgcnt, e.msg, e.soundname
	        break;
	        
	        case 'error':
				self.triggerEvent('pushError', e ); // e.msg
	        break;

	    }
	}

	self.tokenHandler = function(result) {
		//console.log('GOT IOS TOKEN: '+result);
		self.triggerEvent('pushToken', { iosToken: result });
	}

	self.successHandler = function(result) {
		self.triggerEvent('pushSuccess', { success: result });
	}

	self.errorHandler = function(error) {
		self.triggerEvent('pushError', { error: error });
	}

		// Initialize on ready
	document.addEventListener('deviceready', function() {
		try { 
    	if (device.platform == 'android' || device.platform == 'Android') {
      	if (options.senderID) {
      		pushNotification.register(self.successHandler, self.errorHandler, {
      			"senderID": _options.senderID, "ecb": "onNotificationGCM" })
      	} else {
      		throw new Error('senderID not set in options, required on android');
      	}

			} else {
      	pushNotification.register(self.tokenHandler, self.errorHandler, {
      					"badge": _options.badge,
      					"sound": _options.sound,
      					"alert": _options.alert,
      					"ecb": "onNotificationAPN" });	// required!
	    }
	  } catch(err) { 
			console.log('There was an error starting up push'); 
			console.log('Error description: ' + err.message); 
			self.triggerEvent('pushError', { error: err });
		} 

		console.log('PLUGIN: push is started');
	}, true);

}; // EO Push
