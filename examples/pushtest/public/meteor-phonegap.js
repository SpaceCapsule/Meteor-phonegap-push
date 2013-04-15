/*
    Setup PhoneGap <-> Meteor commonication
    By RaiX 2013, MIT License

    Include this file in the compiled version of the app
 */
version = '0.0.1';

dispatchEvent = function(eventName, data) {
  /*var evt = (typeof(CustomEvent) === 'undefined')? document.createEvent("Event") : new CustomEvent(eventName);
  if (typeof(CustomEvent) === 'undefined') evt.initEvent(eventName, true, true);
  evt.data = data;
  document.dispatchEvent(evt);*/
};

// Get hold of function
getNode = function(string) {
  var splitString = string.split('.');
  var nodeThis = window;

  // Divein nodeThiss
  if (splitString.length)
    for (var i = 0; i < splitString.length-1; i++)
      if (nodeThis)
        nodeThis = nodeThis[splitString[i]];

  // Get the last object    
  var func = (nodeThis)?nodeThis[splitString[splitString.length-1]]:undefined;

  if (typeof(func) === "function")
    return function( /* arguments */){
      return func.apply(nodeThis, arguments);
    };

  return function() { return func; };
} // EO get node

getValue = function(/* arguments */) {
  // takes a name and a callback

  if (arguments.length < 2)
    throw new Error('getValue missing arguments');
  var name = arguments[0];
  // Get callback

  var callback = arguments[arguments.length-1];
  if (typeof(callback) != "function")
    throw new Error('getValue last argument is not a callback function');

  // filter out name and callback
  var newArgs = [];
  for (var i = 1; i < arguments.length-1; i++)
    newArgs[i-1] = arguments[i];
  // Run
  var result = (getNode(name)).apply(window, newArgs);

  return callback(result);
}

meteorPhonegap = function(iframeId, url, debug) {
  var self = this;
  // contains a list of registered events - in case Meteor reloads
  var registredEvents = { 'deviceready' : true };
  
  deviceready = function() {
    console.log('Device is ready.....');
    var iframe = document.getElementById(iframeId);
    if (!iframe)
      throw new Error('meteorPhonegap cant find iframe with id: ' + iframeId);
    // Device ready event
    iframe.addEventListener("load", function(event) {
      console.log('Meteor <-> PhoneGap - Initialized');
      iframe.contentWindow.postMessage({
        eventName: 'deviceready',
        deviceready: true
      }, url);
    }, false);

    // Listen for requests to use it.
    window.addEventListener("message", function(event) {
      if (event.origin == url) {
        if (event.data) {
          // If call function:
          if (event.data.func && event.data.callbackId != undefined) {
            /*
              func = 'window.console.log'
              callbackId = id of method call
              args = applied arguments
              describer = [false, false, false, 0, 1] // where 0 and 1 is callbacks
            */

            /* callbacks should return:
              data.func = method name        
              data.callbackId =  method call
              data.invokeId = id of callback to invoke
              event.data.result
            */
            var newArg = [];
            var result;
            for (var key in event.data.args)
              newArg[key] = (event.data.describer[key] === false)? event.data.args[key]: function(e) {
                var resultMessage = {
                  func: event.data.func,
                  result: result, // TODO: Check if this works
                  callbackId: event.data.callbackId,
                  invokeId: event.data.describer[key],
                  result: e
                };

                iframe.contentWindow.postMessage(resultMessage, url);
            }; // EO newArg
            try {
              result = getNode(event.data.func).apply(window, newArg);
              //result = JSON.stringify(result);
              //iframe.contentWindow.postMessage({ callbackId: event.data.callbackId, error: null, result: result }, url);
            } catch(e) {
              //iframe.contentWindow.postMessage({ callbackId: event.data.callbackId, error: e.message, result: result }, url);
            }

          } // EO got func

          // If register event
          if (event.data.eventName) {
            // The client wants to listen for an event...
            var eventName = event.data.eventName;
            var preventDefault = !!(event.data.preventDefault);
            // Check if allready registered
            if (!registredEvents[eventName]) {
              // Registre eventName
              registredEvents[eventName] = true;
              // Rig event
              document.addEventListener(eventName, function(event) {
                iframe.contentWindow.postMessage({                  
                  eventName: eventName,
                  event: event
                }, url);
                if (preventDefault)
                  event.preventDefault();
              }, false);
            } // EO Registre event

          } // EO got event name
        } // EO event data
      }
    }, false);
    console.log('Setting iframe src');
    iframe.src= url;
  } // EO onload
  document.addEventListener("deviceready", deviceready, false); // EO Device ready
  if (debug)
    deviceready();

  return self;
}; // EO meteorPhonegap