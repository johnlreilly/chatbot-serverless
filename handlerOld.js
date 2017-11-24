'use strict';
const nodeFetch = require('node-fetch');
const request = require('request-promise');  
const accessToken = 'EAAOKICMsFRsBAFt7fxTkanpOWF6K7xPXTx5hVbWvvK2ZBSGJpfEOco3fuXVr3Nr4MQL2Haoq60off7Y3b5jUJWQpyz08fZCOuZCm7FjRkMzZBR4ZAgdZBdF535SMBR0LxUOi2k3XFOXNFaZBlBrgbK2UfhTzDaC90sXaEk35ByRbpvjOz5AGYBg';

/**
 * Function to verify facebook webhook
 */
 module.exports.fbVerify = (event, context, callback) => {
    if (event.query['hub.mode'] === 'subscribe' &&
        event.query['hub.verify_token'] === 'sometoken') {
        console.log("Validating webhook");
    return callback(null, parseInt(event.query['hub.challenge']));
} else {
    console.error("Failed validation. Make sure the validation tokens match.");
    return callback('Invalid token');
}
};

/**
 * Function to reply to other messages
 */
 module.exports.fbMessages = (event, context, callback) => {
    console.log("-------------------- Event from FB: " + JSON.stringify(event));
    // event.body.entry.map((entry) => {
    //     entry.messaging.map((messagingItem) => {
    //         if (messagingItem.message && messagingItem.message.text) {
    //             const url = `https://graph.facebook.com/v2.6/me/messages?access_token=EAAOKICMsFRsBAFt7fxTkanpOWF6K7xPXTx5hVbWvvK2ZBSGJpfEOco3fuXVr3Nr4MQL2Haoq60off7Y3b5jUJWQpyz08fZCOuZCm7FjRkMzZBR4ZAgdZBdF535SMBR0LxUOi2k3XFOXNFaZBlBrgbK2UfhTzDaC90sXaEk35ByRbpvjOz5AGYBg`;

    //             const responsePayload = {
    //                 recipient: {
    //                     id: messagingItem.sender.id
    //                 },
    //                 message: {
    //                     text: messagingItem.message.text
    //                 }
    //             };

    //             nodeFetch(
    //                 url,
    //                 {
    //                     method: 'POST',
    //                     body: JSON.stringify(responsePayload),
    //                     headers: {'Content-Type': 'application/json'}
    //                 }
    //             )
    //                 .then(res => res.json())
    //                 .then(json => {
    //                     console.log("Json result ", json);
    //                     callback(null, json)
    //                 })
    //                 .catch(error => {
    //                     console.error("Call failed ", error);
    //                     callback(null, error)
    //                 });
    //         }
    //     });
    // });
};






/**
 * Function to pull Events for specific Venues & Bands
 */
 module.exports.fbEvents = (event, context, callback) => {
    console.log("-------------------- Event from FB: " + JSON.stringify(event));

    // List of Venues
    var venues = [];
    venues += "318908904908734"; // maxfields

    for (var venue of venues) {

        GraphRequest request = GraphRequest.newGraphPathRequest(
          accessToken,
          "/" + venue + "/events",
          new GraphRequest.Callback() {
            @Override
            public void onCompleted(GraphResponse response) {
                console.log("Events for " + venue + ": ", JSON.stringify(response));
                for (var performance of data) {
                   console.log("Event: ", performance.name);
                }
            }
        });
        request.executeAsync();

    }
};