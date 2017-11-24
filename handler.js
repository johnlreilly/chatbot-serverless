'use strict';
var VERIFY_TOKEN = "sometoken";
var https = require('https');
var PAGE_ACCESS_TOKEN = "EAAOKICMsFRsBAFt7fxTkanpOWF6K7xPXTx5hVbWvvK2ZBSGJpfEOco3fuXVr3Nr4MQL2Haoq60off7Y3b5jUJWQpyz08fZCOuZCm7FjRkMzZBR4ZAgdZBdF535SMBR0LxUOi2k3XFOXNFaZBlBrgbK2UfhTzDaC90sXaEk35ByRbpvjOz5AGYBg";
console.log("Start!");

/**
 * Function to verify facebook webhook
 */
 module.exports.verify = (event, context, callback) => {

  console.log("Initial Post: " + JSON.stringify(event));
  if (event.query['hub.mode'] === 'subscribe' &&
    event.query['hub.verify_token'] === 'sometoken') {
    console.log("Validating webhook");
    return callback(null, parseInt(event.query['hub.challenge']));
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    return callback('Invalid token');
  }
};

module.exports.messages = (event, context, callback) => {

  console.log("Initial Post: " + JSON.stringify(event));
  console.log("Initial Post Raw: " + event);

  var data = event.body
  console.log("Initial Post 0: " + data);

    // Make sure this is a page subscription
    if (data.object === 'page') {
    console.log("Initial Post 1 is a page");

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      console.log("Initial Post 1 is a page");
      var pageID = entry.id;
      var timeOfEvent = entry.time;
        console.log("Initial Post 2: " + timeOfEvent);

        // Iterate over each messaging event
        entry.messaging.forEach(function(msg) {
          if (msg.message) {
            console.log("Initial Post 3: " + msg.message);
            receivedMessage(msg);
          } else {
            console.log("Webhook received unknown event: ", event);
          }
        });
      });
    }

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    var response = {
      'body': "ok",
      'statusCode': 200
    };

    callback(null, response);

  }

  function receivedMessage(event) {
    console.log("Message data: ", event.message);

    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;
    console.log("Received message for user %d and page %d at %d with message:", senderID, recipientID, timeOfMessage);
    console.log(JSON.stringify(message));
    var messageId = message.mid;
    var messageText = message.text;
    var messageAttachments = message.attachments;

    if (messageText) {
    // If we receive a text message, check to see if it matches a keyword
    // and send back the example. Otherwise, just echo the text we received.
    switch (messageText) {
      case 'generic':
        //sendGenericMessage(senderID);
        console.log("Generic: " + messageText);
        sendTextMessage(senderID, messageText);
        break;
        case 'event':
        console.log("Event: " + messageText);
        callPageEventAPI(senderId, messageText);
        sendTextMessage(senderID, messageText);
        break;
        default:
        console.log("Default: " + messageText);
        sendTextMessage(senderID, messageText);
      }
    } else if (messageAttachments) {
      sendTextMessage(senderID, "Message with attachment received");
    }
  }

  function sendTextMessage(recipientId, messageText) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        text: messageText
      }
    };
    callSendAPI(messageData);
  }

  function callSendAPI(messageData) {
    var body = JSON.stringify(messageData);
    var path = '/v2.6/me/messages?access_token=' + PAGE_ACCESS_TOKEN;
    var options = {
      host: "graph.facebook.com",
      path: path,
      method: 'POST',
      headers: {'Content-Type': 'application/json'}
    };
    var callback = function(response) {
      var str = ''
      response.on('data', function (chunk) {
        str += chunk;
      });
      response.on('end', function () {

      });
    }
    var req = https.request(options, callback);
    req.on('error', function(e) {
      console.log('problem with request: '+ e);
    });

    req.write(body);
    req.end();
  }

  function callPageEventAPI(recipientId, messageText) {

    // List of Venues
    var body;
    var venues = [];
  venues += "318908904908734"; // maxfields

  for (var venue of venues) {
    var path = '/v2.11/'+venue+'/events?access_token=' + PAGE_ACCESS_TOKEN;
    var options = {
      host: "graph.facebook.com",
      path: path,
      method: 'POST',
      headers: {'Content-Type': 'application/json'}
    };
    var callback = function(response) {
      var str = ''
      response.on('data', function (chunk) {
        str += chunk;
      });
      response.on('end', function () {
        body += str;
      });
    }
    // add break between events
  }

  var req = https.request(options, callback);
  req.on('error', function(e) {
    console.log('problem with request: '+ e);
  });

  req.write(body);
  req.end();
}


