/*
  A general purpose user CordovaPush
  ios, android, mail, twitter?, facebook?, sms?, snailMail? :)

  Phonegap generic :
  https://github.com/phonegap-build/PushPlugin
 */

// getText / getBinary


CordovaPush = function(options) {
    var self = this;

    // (cert.pem and key.pem)
    self.sendIOS = function(from, userToken, title, text, count) {
        // https://npmjs.org/package/apn

        // After requesting the certificate from Apple, export your private key as a .p12 file and download the .cer file from the iOS Provisioning Portal.
        
        // gateway.push.apple.com, port 2195
        // gateway.sandbox.push.apple.com, port 2195
        
        // Now, in the directory containing cert.cer and key.p12 execute the following commands to generate your .pem files:
        // $ openssl x509 -in cert.cer -inform DER -outform PEM -out cert.pem
        // $ openssl pkcs12 -in key.p12 -out key.pem -nodes

        var apn = Npm.require('apn');

        var apnConnection = new apn.Connection( options );

        var myDevice = new apn.Device(userToken);

        var note = new apn.Notification();

        note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
        note.badge = count;
        //note.sound = "";
        note.alert = text;
        note.payload = {'messageFrom': from };

        console.log('I:Send message to: ' + userToken);

        apnConnection.pushNotification(note, myDevice);

    };

    self.sendAndroid = function(from, userTokens, title, text, count) {
        var gcm = Npm.require('node-gcm');
         
        //var message = new gcm.Message();
        var message = new gcm.Message({
            collapseKey: from,
            delayWhileIdle: true,
            timeToLive: 3,
            data: {
                title: title,
                message: text,
                msgcnt: count
            }
        });
        var sender = new gcm.Sender('AIzaSyBbw-15fIlD2lMseaVvSH5CL4Z-490k3CA');

        _.each(userTokens, function(value, key) {
            console.log('A:Send message to: ' + value);
        });
        
        /*message.addData('title', title);
        message.addData('message', text);
        message.addData('msgcnt', '1');
        message.collapseKey = 'sitDrift';
        message.delayWhileIdle = true;
        message.timeToLive = 3;*/
         
        // // At least one token is required - each app registers a different token
        // userTokens.push('APA91bFobAwN7P3Okxy2al8RI12VcJFUS-giXWTOoWXIObtSPOE1h7FuH1VPLBPgshDI_Fp7aIYVET-ssvGUErlWYA0cKPGhoXT1daqyDsEfem9ZtgZNRhQFv7kLCIVSigYlpMluToPiSHSsFSEdtCDfKoOZqNPgfs');
         
        // /**
        //  * Parameters: message-literal, userTokens-array, No. of retries, callback-function
        //  */
        sender.send(message, userTokens, 4, function (err, result) {
            if (err) {
                console.log('ERROR: result of sender: ' + result);
            } else {
                console.log('result of sender: ' + JSON.stringify(result));
            }
        });
        // /** Use the following line if you want to send the message without retries
        // sender.sendNoRetry(message, userTokens, function (result) {
        // console.log(result); });
        // **/        
    }; // EO sendAndroid

    self.initFeedback = function() {
        var apn = Npm.require('apn');

        var feedbackOptions = {
            "batchFeedback": true,
            "interval": 1000,
            'address': 'feedback.sandbox.push.apple.com'
        };

        var feedback = new apn.Feedback(feedbackOptions);
        feedback.on("feedback", function(devices) {
            devices.forEach(function(item) {
                // Do something with item.device and item.time;
                console.log('A:PUSH FEEDBACK ' + item.device + ' - ' + item.time);
            });
        });
    }


    return self;
};