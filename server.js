const Slapp = require('slapp')
const ConvoStore = require('slapp-convo-beepboop')
const Context = require('slapp-context-beepboop')

var ping = require('net-ping');
var express = require('express')

var app = express()

// use `PORT` env var on Beep Boop - default to 3000 locally
var port = process.env.PORT || 3000

var slapp = Slapp({
  // Beep Boop sets the SLACK_VERIFY_TOKEN env var
  verify_token: process.env.SLACK_VERIFY_TOKEN,
  convo_store: ConvoStore(),
  context: Context()
})


function pingAssets() {

  // server addresses
  var servers = {
    'whatculture.com': '91.238.165.49',
    'cdn3.whatculture.com': '104.25.240.108'
  };

  session = ping.createSession()
  for (var key in servers) {

    session.pingHost(servers[key], function (error, target) {

      if (error) {
        console.log(key + ' is down');
      } else {
        console.log(key + ' is up');
      }
    });
  }

  res.send('Boop!!')
};


var HELP_TEXT = `
\`help\` - to see this message.
\`is it up?\` - to see what is up and what is down.
`;

//*********************************************
// Setup different handlers for messages
//*********************************************

// response to the user typing "help"
slapp.message('help', ['mention', 'direct_message'], (msg) => {
  msg.say(HELP_TEXT)
});


// attach Slapp to express server
var server = slapp.attachToExpress(express())

// start http server
server.listen(port, (err) => {
  if (err) {
    return console.error(err)
  }

  console.log(`Listening on port ${port}`)
})
