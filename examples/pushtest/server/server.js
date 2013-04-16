var userTokens = new Meteor.Collection('userTokens');

// // Reset
userTokens.remove({});

Notifyer = new _Notifyer({});

Meteor.methods({
	'test': function() {
		console.log('Test');
		tokens = [];
		userTokens.find({}).forEach(function(doc) {
			if (doc.androidToken)
				tokens.push(doc.androidToken);
		});
		Notifyer.sendAndroid(tokens, 'Vigtigt!!', 'Hello world, Morten styrer for vildt!!', 1);
	}
});