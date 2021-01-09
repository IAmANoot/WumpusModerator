const Discord = require(`discord.js`);
const tokens = require('../tokens.json');
const log = require(`../handlers/logHandler.js`);
const client = new Discord.Client();
const talkedRecently = new Set();

module.exports = (client, msg) => {
  if (msg.author.bot) return;

  let server = client.getServer.get(msg.guild.id);

  if (!server) {
    server = {
      id: `${msg.guild.id}`,
      prefix: `${tokens.prefix}`,
      staffrole: `None`,
      muterole: `None`,
      logchannel: `None`
    }
    client.setServer.run(server);
  }

  if (msg.mentions.users.size) {

    if (msg.mentions.users.first().id === '599290971187838978') {
      msg.channel.send(`My prefix on this server is ${server.prefix}`)
      return;
    }
  }

  if (!msg.content.startsWith(server.prefix)) return;
  if (!msg.guild) return;
  let command = msg.content.toLowerCase().split(' ')[0].slice(server.prefix.length);
  let params = msg.content.split(' ').slice(1);
  let cmd;
  client.cmd = cmd;

  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
      log.info(`User ${msg.author.tag} executed command: "${msg.content}" in #${msg.channel.name} in guild: ${msg.guild} (${msg.guild.id})`)
      cmd.run(client, msg, params);
    }
  }
