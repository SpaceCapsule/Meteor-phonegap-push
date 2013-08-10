var userTokens = new Meteor.Collection('userTokens');

// // Reset
//userTokens.remove({});

Notifyer = new _Notifyer({});

var textMessages = [
'Hmmm Well ok?',
'1. Hello world, Morten styrer for vildt!!',
'2. Dette er en lille test',
'3. Opdatering på vej',
'4. Hej dette er en test igen',
'5. Fair nok?',
'6. Sit app til download'
];

var lastMsg = -1;

Meteor.methods({
	'test': function() {
		console.log('Test');
		tokens = [];
		userTokens.find({}).forEach(function(doc) {
			if (doc.androidToken) {
				tokens.push(doc.androidToken);
      }
		});

    if (tokens.length > 0) {
      console.log('Send to ' + tokens.length + ' tokens');
      lastMsg++;
      if (lastMsg === textMessages.length) {
        lastMsg = 0;
      }
      console.log('Message: ' + textMessages[lastMsg]);
		  Notifyer.sendAndroid('SIT driftsstatus', tokens, 'Vigtigt!!', textMessages[lastMsg], 1);
    }

	},

  'setAdroidToken': function(appId, token) {
    var id = userTokens.findOne({ appId: appId });
    console.log('Set Android Token');
    if (id) {
      userTokens.update({ _id: id }, { androidToken: token });
    } else {
      userTokens.insert({ appId: appId, androidToken: token });
    }
  },

  'setIosToken': function(appId, token) {
    var id = userTokens.findOne({ appId: appId });
    console.log('Set Android Token');
    if (id) {
      userTokens.update({ _id: id }, { iosToken: token });
    } else {
      userTokens.insert({ appId: appId, iosToken: token });
    }
  }
});