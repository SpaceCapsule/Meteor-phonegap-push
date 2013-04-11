/*
  A general purpose user notifyer
  ios, android, mail, twitter?, facebook?, sms?, snailMail? :)

  Phonegap generic :
  https://github.com/phonegap-build/PushPlugin
 */
Notifyer = function(options) {
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

    self.iosConnection = (self._options.ios)? new apn.Connection(self._options.ios) : null;

    self.sendNotification = function(userId, options) {
        if (self._options.ios) {

        }
    };

    return self;
};