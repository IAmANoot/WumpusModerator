const tokens = require(`../tokens.json`);
const Discord = require(`discord.js`);
const client = new Discord.Client();
const log = require(`../handlers/logHandler.js`);
const ms = require('ms');

module.exports = async client => {
  try {
    setTimeout(async function() {
      log.info(`Connecting...`)
    }, ms('1s'));
    setTimeout(async function() {
      log.info(`Logged in as ${client.user.tag}`)
    }, ms('3s'));
    client.user.setActivity(`over the server | w!help`, { type: 'WATCHING' })
    log.info(`${client.users.keyArray().length} Users Online`);
    log.info(`${client.guilds.keyArray().length} Guilds`);
  } catch(e) {
    log.error(e.stack)
  }
}
