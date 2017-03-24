var ping = require('ping');
var SlackBot = require('slackbots');

// create a bot
var bot = new SlackBot({
    token: 'xoxb-158083023233-1Ump5FlIpViwytYZrbtEK3Bc', // Add a bot https://my.slack.com/services/new/bot and put the token
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
      response = pingAssets(message.channel);
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

function pingAssets(channelId) {

  // server addresses
  var servers = [
    'www.whatculture.com',
    'create.whatculture.com',
    'cdn3.whatculture.com'
  ]

  servers.forEach(function (host) {

     var response = ''

     !function outer(host) {
      ping.sys.probe(host, function(isAlive){
          if (isAlive) {
            response = ':arrow_up_small: ' + host + ' is up\n'
          } else {
            response = ':arrow_down_small: ' + host + ' is down\n'
          }

          bot.postMessage(channelId, response);
       }, {
         timeout: 10
       })
     }(host)
  })

  return true
}
