require("dotenv").config();
const request = require('request');

  // git@github.com:abdullah-manafikhi/chatbot.git

const test = (req, res) => {
  res.send("hello from the chatbot controller");
};

const getWebhook = (req, res) => {
  // let VERIFY_TOKEN = process.env.MY_VERIFY_TOKEN;
  // console.log(VERIFY_TOKEN);
  // Parse the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];
  console.log("1");
  // Check if a token and mode is in the query string of the request
  console.log("2");
  // Check the mode and token sent is correct
  if (mode === "subscribe" && token) {
    // Respond with the challenge token from the request
    console.log("WEBHOOK_VERIFIED");
    res.status(200).send(challenge);
  } else {
    console.log("4");
    // Respond with '403 Forbidden' if verify tokens do not match
    res.sendStatus(403);
  }
};

const postWebhook = (req, res) => {
  let body = req.body;
  console.log(process.env.MY_VERIFY_TOKEN)
  console.log(`\u{1F7EA} Received webhook:`);
  console.dir(body, { depth: null });

  // Send a 200 OK response if this is a page webhook

  if (body.object === "page") {
    console.log("fuck");
    body.entry.forEach((entry) => {
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      // console.log("Sender PSID: " + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send("EVENT_RECEIVED");

    // Determine which webhooks were triggered and get sender PSIDs and locale, message content and more.
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
};

// Handles messages events
function handleMessage(sender_psid, received_message) {
  let response;

  // Check if the message contains text
  if (received_message.text) {
    // Create the payload for a basic text message
    response = {
      text: `You sent the message: "${received_message.text}". Now send me an image!`,
    };
  }

  // Sends the response message
  callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
   // Construct the message body
   let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
}

module.exports = {
  test,
  getWebhook,
  postWebhook,
};
