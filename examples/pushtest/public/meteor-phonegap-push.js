// 

var pushNotification;

function meteorPhonegapPush(options) {
	var _options = {
		senderID: (options.senderID)?''+options.senderID: '',
		badge: (options.badge === false)?'false': 'true',
		sound: (options.sound === false)?'false': 'true',
		alert: (options.alert === false)?'false': 'true'
	};

	console.log('init push');
	// Initialize on ready
	document.addEventListener('deviceready', function() {
		console.log('startup push');
		try 
		{ 
	    	pushNotification = window.plugins.pushNotification;
	    	if (device.platform == 'android' || device.platform == 'Android') {
	        	if (options.senderID)
	        		pushNotification.register(successHandler, errorHandler, {
	        			"senderID": _options.senderID, "ecb":"onNotificationGCM"})
	        	else
	        		throw new Error('senderID not set in options, required on android');
			} else {
	        	pushNotification.register(tokenHandler, errorHandler, {
	        					"badge": _options.badge,
	        					"sound": _options.sound,
	        					"alert": _options.alert,
	        					"ecb":"onNotificationAPN"});	// required!
	    	}
	    }
		catch(err) 
		{ 
			console.log('There was an error starting up push'); 
			console.log('Error description: ' + err.message); 
			dispatchEvent('pushError', err);
		} 

	}, true);
}

// handle APNS notifications for iOS
function onNotificationAPN(e) {
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

	dispatchEvent('pushLaunch', e); // e.foreground, e.foreground, Coldstart or background
}

// handle GCM notifications for Android
function onNotificationGCM(e) {
    switch( e.event )
    {
        case 'registered':
		if ( e.regid.length > 0 )
			dispatchEvent('pushToken', e.regID);
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
				
			dispatchEvent('pushLaunch', e); // e.foreground, e.foreground, Coldstart or background
			// e.payload.message, e.payload.msgcnt, e.msg, e.soundname
        break;
        
        case 'error':
			dispatchEvent('pushError', e); // e.msg
        break;

    }
}

function tokenHandler (result) {
	dispatchEvent('pushToken', result);
}

function successHandler (result) {
	dispatchEvent('pushSuccess', result);
}

function errorHandler (error) {
	dispatchEvent('pushError', error);
}