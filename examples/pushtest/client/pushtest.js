if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to pushtest.";
  };

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });

  if (!window.PhoneGap)
      console.log('ERROR: no PhoneGap???')
  else
    console.log('PhoneGap ok ');

function onLoad() {
    // BlackBerry OS 4 browser does not support events.
    // So, manually wait until PhoneGap is available.
    console.log('load');
    var intervalID = window.setInterval(
      function() {
          if (PhoneGap.available) {
              window.clearInterval(intervalID);
              onDeviceReady3();
          }
      },
      500
    );
}

function onDeviceReady3() {
    // Now safe to use the PhoneGap API
    console.log('device is ready...?????????');
}

Meteor.startup(function() {
  onLoad();
});

  // Cordova is ready to be used!
  //
  function onDeviceReady() { console.log('device is ready...');  alert('ok?'); }
  function onDeviceResume() { console.log('device is resume...');  }
  function onDevicePause() { console.log('device is pause...');  }

  document.addEventListener("deviceready", onDeviceReady, false);
  document.addEventListener("resume", onDeviceResume, false);
  document.addEventListener("pause", onDevicePause, false);


}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
