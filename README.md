#MeteorGap
MeteorGap uses a standard template with an `iframe` containing the Meteor app. The Meteor app communicates with the phonegap through a simple method/event interface and supplies the Meteor app with option of using the phonegap if available or as a regular web app.

##Why in a iframe?
Pro
* Instant update/hot code push
* App cache
* The App can run in normal browser
* Faster development time (no need to recompile, just save)

Cons
* Apple store might reject? __Got no experience, can't see why not__
* The Native/html5 when to use what

##HOWTO:
Copying files and configuring

###1. Copy to device and configure location of Meteor app
`apploader.html`, `meteor-phonegap.js`, `meteor-phonegap-push.js` goes in the device `/www`
Edit the apploader.html by configuring the location of the meteor app. `meteorPhonegap('Meteor', 'http://1.2.3.4:3000');`

###2. Configuring the Meteor app
It's as simple as adding a package, the PhoneGap gets initialized if present (Works if Meteor is not in device shell)

###3. Use it
There are three basic methods in the PhoneGap object:
* PhoneGap.call(remoteScope, arguments) __arguments are optional__
* PhoneGap.getValue(remoteScope, arguments, callback) __arguments are optional__
* PhoneGap.addEventListener(eventName, callback)

####PhoneGap.call(remoteScope, arguments) __arguments are optional__
`remoteScope` is the stringified function/entity name
`arguments` the arguments to supply the remote function __(including callbacks)__
#####Example
```js
    PhoneGap.call('navigator.accelerometer.getCurrentAcceleration', accelerometerSuccess, accelerometerError);
```
*Runs the phonegap function*

####PhoneGap.getValue(remoteScope, arguments, callback) __arguments are optional__
`remoteScope` is the stringified function/entity name
`arguments` the arguments to supply the remote function __(including callbacks)__
`callback` is the function to call returning the result of the called function 

####PhoneGap.addEventListener(eventName, callback)
`eventName` The name of the event
`callback` The function triggered at event
```js
    Session.set('deviceready', false);
    PhoneGap.addEventListener('deviceready', function() {
        Session.set('deviceready', true);
    });
```

####Examples:
```js
    PhoneGap.addEventListener('deviceready', function() {
        Session.set('deviceready', true);
        console.log('------ DEVICE IS READY -------');
    });

    PhoneGap.addEventListener('pause', function(event) {
        console.log('------ DEVICE IS PAUSED -------');
    });

    PhoneGap.addEventListener('resume', function(event) {
      console.log('------ DEVICE IS RESUMED -------');
    });

    PhoneGap.addEventListener('backbutton', function(e) {
        console.log('------ backbutton -------');
     });

    PhoneGap.addEventListener('menubutton', function(e) {
        console.log('------ menubutton -------');
    });

    PhoneGap.getValue('version', function(value) { 
        console.log('MeteorGap varsion: ' + value);
    });

    PhoneGap.getValue('device', function(value) { 
        console.log('Im on the ' + value.platform);
    });
```


