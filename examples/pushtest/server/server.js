var userTokens = new Meteor.Collection('userTokens');

// // Reset
userTokens.remove({});

// Notifyer = new _Notifyer({});

Meteor.methods({
	'test': function() {
		console.log('Test');
		// tokens = [];
		// userTokens.find({}).forEach(function(doc) {
		// 	tokens.push(doc.androidToken);
		// });
		// Notifyer.sendAndroid(tokens, 'Test', 'Hello world', 1);
	}
});