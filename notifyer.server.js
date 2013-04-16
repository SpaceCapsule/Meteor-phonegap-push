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


    self.sendAndroid = function(userTokens, title, text, count) {
        var gcm = Npm.require('node-gcm');
         
         var message = new gcm.Message();
         var sender = new gcm.Sender('AIzaSyAR2xFXOiZfb2X70pY4PZkbzidBL2MddSM');

        _.each(userTokens, function(value, key) {
            console.log('Send message to: ' + value);
        });
        
        message.addData('title', title);
        message.addData('message', text);
        message.addData('msgcnt', '1');
        message.collapseKey = 'sitDrift';
        message.delayWhileIdle = true;
        message.timeToLive = 3;
         
        // // At least one token is required - each app registers a different token
        // userTokens.push('APA91bFobAwN7P3Okxy2al8RI12VcJFUS-giXWTOoWXIObtSPOE1h7FuH1VPLBPgshDI_Fp7aIYVET-ssvGUErlWYA0cKPGhoXT1daqyDsEfem9ZtgZNRhQFv7kLCIVSigYlpMluToPiSHSsFSEdtCDfKoOZqNPgfs');
         
        // /**
        //  * Parameters: message-literal, userTokens-array, No. of retries, callback-function
        //  */
        sender.send(message, userTokens, 4, function (result) {
            console.log('result of sender: ' + result);
        });
        // /** Use the following line if you want to send the message without retries
        // sender.sendNoRetry(message, userTokens, function (result) {
        // console.log(result); });
        // **/        
    } // EO sendAndroid

    return self;
};