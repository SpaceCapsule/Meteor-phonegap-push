// 

var pushNotification;
var onNotificationGCM;
var onNotificationAPN;

MeteorPhonegap.prototype.initPush = function(options) {
	var self = this;
	var _options = {
		senderID: (options.senderID)?''+options.senderID: '',
		badge: (options.badge === false)?'false': 'true',
		sound: (options.sound === false)?'false': 'true',
		alert: (options.alert === false)?'false': 'true'
	};

	// Initialize on ready
	document.addEventListener('deviceready', function() {
		try 
		{ 
	    	pushNotification = window.plugins.pushNotification;
	    	onNotificationGCM = self.onNotificationGCM;
	    	onNotificationAPN = self.onNotificationAPN;
	    	if (device.platform == 'android' || device.platform == 'Android') {
	        	if (options.senderID)
	        		pushNotification.register(self.successHandler, self.errorHandler, {
	        			"senderID": _options.senderID, "ecb": "onNotificationGCM" })
	        	else
	        		throw new Error('senderID not set in options, required on android');
			} else {
	        	pushNotification.register(self.tokenHandler, self.errorHandler, {
	        					"badge": _options.badge,
	        					"sound": _options.sound,
	        					"alert": _options.alert,
	        					"ecb": "onNotificationAPN" });	// required!
	    	}
	    }
		catch(err) 
		{ 
			console.log('There was an error starting up push'); 
			console.log('Error description: ' + err.message); 
			self.sendEvent('pushError', { error: err });
		} 

		console.log('PLUGIN: push is started');
	}, true);

	// handle APNS notifications for iOS
	self.onNotificationAPN = function(e) {
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

		self.sendEvent('pushLaunch', { alert: e.alert });
	}

	// handle GCM notifications for Android
	self.onNotificationGCM = function(e) {
	    switch( e.event )
	    {
	        case 'registered':
			if ( e.regid.length > 0 ) {
				//console.log('ANDROID TOKEN: '+e.regid);
				self.sendEvent('pushToken', { 'androidToken': ''+e.regid } ); //regID??
			}
	        break;
	        
	        case 'message':
		
				// if this flag is set, this notification happened while we were in the foreground.
	        	// you might want to play a sound to get the user's attention, throw up a dialog, etc.
	        	if (e.foreground)
	        	{
					// if the notification contains a soundname, play it.
					var my_media = new Media("/android_asset/www/"+e.soundname);
					my_media.play();
				}
					
				self.sendEvent('pushLaunch', {
								foreground: e.foreground,
								coldstart: e.coldstart,
								payload: e.payload
				} ); // e.foreground, e.foreground, Coldstart or background
				// e.payload.message, e.payload.msgcnt, e.msg, e.soundname
	        break;
	        
	        case 'error':
				self.sendEvent('pushError', { error: e.msg } ); // e.msg
	        break;

	    }
	}

	self.tokenHandler = function(result) {
		//console.log('GOT IOS TOKEN: '+result);
		self.sendEvent('pushToken', { iosToken: result });
	}

	self.successHandler = function(result) {
		self.sendEvent('pushSuccess', { success: result });
	}

	self.errorHandler = function(error) {
		self.sendEvent('pushError', { error: error });
	}

} // EO Push

