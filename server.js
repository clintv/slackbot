var ping = require('net-ping');
var SlackBot = require('slackbots');

// create a bot
var bot = new SlackBot({
    token: 'xoxb-158083023233-XdX4ReySgso33MCTVt11Sir6', // Add a bot https://my.slack.com/services/new/bot and put the token
    name: 'DevBot'
});

// monitor for messages
bot.on('message', function(message) {

  var response = '';

  // if message is a user message
  if(message.type !== 'message') {
    return false;
  }

  // extract commands
  switch(extractCommand(message.text)) {

    // is it up? (ping!)
    case 'ping':
      response = pingAssets();
      break;
  }

  if(response.length) {
    bot.postMessage(message.channel, response);
  }
});

/**
 * search string from messages and identify a command, could use
 * regex or accept multiple commands in the future for the same task.
 * @param string
 * @return string
 */
function extractCommand(string) {

  var lowerCaseString = string.toLowerCase();

  if(!(lowerCaseString.indexOf('isitup'))) {
    return 'ping';
  }

  return false;
}

function pingAssets() {

  // server addresses
  var servers = {
    'whatculture.com': '91.238.165.49',
    'cdn3.whatculture.com': '104.25.240.108'
  };

  var response = '';

  session = ping.createSession()
  for (var key in servers) {

    response += session.pingHost(servers[key], function (error, target, response) {

      if (error) {
        response = ":white_circle: " + key + " is down\n";
      } else {
        response = ":black_circle: " + key + " is up\n";
      }

      return response;
    });
  }

  return response;
};
