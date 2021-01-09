var Discord = require('discord.js');
const tokens = require('../tokens.json');
const log = require(`../handlers/logHandler.js`);
const client = new Discord.Client();

exports.run = async (client, msg, params) => {
  const embed = new Discord.RichEmbed()
  .setAuthor(`Commands`, msg.author.avatarURL)
  .setDescription("**Moderation:** `ban`, `kick`, `mute`, `infractions`, `warn`, `prune`\n**Info:** `userinfo`, `serverinfo`, `stats`, `age`\n**Misc:** `invite`, `config`")
  .setColor(tokens.generic.colour.default)
  .setTimestamp()
  .setFooter(`${tokens.generic.footer} `, `${tokens.generic.footerURL}`)
  msg.channel.send(embed).catch((error) => {log.error(error)});
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['help', 'commands', 'cmds']
};

exports.help = {
  name: 'help',
  description: 'Shows help page',
  usage: 'help'
};
