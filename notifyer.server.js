/*
  A general purpose user notifyer
  ios, android, mail, twitter?, facebook?, sms?, snailMail? :)

  Phonegap generic :
  https://github.com/phonegap-build/PushPlugin
 */
_Notifyer = function(options) {
    var self = this;
    self._options = _.extend(options, {
        ios: {},
        android: {},
        mail: {},
        twitter: {},
        facebook: {},
        linkedIn: {},
        sms: {},
        mms: {},
        snailMail: {}
    });

   // self.iosConnection = (self._options.ios)? new apn.Connection(self._options.ios) : null;

    self.sendNotification = function(userId, options) {
        if (self._options.ios) {

        }
        if (self._options.android) {

        }
    };

    // (cert.pem and key.pem)
    self.sendIOS = function(from, userTokens, title, text, count) {
        // https://npmjs.org/package/apn

        // After requesting the certificate from Apple, export your private key as a .p12 file and download the .cer file from the iOS Provisioning Portal.

        // Now, in the directory containing cert.cer and key.p12 execute the following commands to generate your .pem files:
        // $ openssl x509 -in cert.cer -inform DER -outform PEM -out cert.pem
        // $ openssl pkcs12 -in key.p12 -out key.pem -nodes

        // var apn = Npm.require('apn');

        // var options = { "gateway": "gateway.sandbox.push.apple.com" };

        // var apnConnection = new apn.Connection(options);

        // var myDevice = new apn.Device(token);

        // var note = new apn.Notification();

        // note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
        // note.badge = count;
        // note.sound = "";
        // note.alert = "\uD83D\uDCE7 \u2709 " + text;
        // note.payload = {'messageFrom': from };

        // apnConnection.pushNotification(note, myDevice);

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
        var sender = new gcm.Sender('AIzaSyAR2xFXOiZfb2X70pY4PZkbzidBL2MddSM');

        _.each(userTokens, function(value, key) {
            console.log('Send message to: ' + value);
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
    } // EO sendAndroid

    return self;
};