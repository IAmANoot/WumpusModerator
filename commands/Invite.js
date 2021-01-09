var Discord = require('discord.js');
const tokens = require('../tokens.json');
const log = require(`../handlers/logHandler.js`);
const client = new Discord.Client();

exports.run = async (client, msg, params) => {
  const embed = new Discord.RichEmbed()
  .setDescription(`[Click here](https://discordapp.com/oauth2/authorize?client_id=599290971187838978&scope=bot&permissions=8&redirect_uri=https%3A%2F%2Fdiscord.gg%2FEg286wY) to invite Wumpus to your server!\n\n[Click here](https://discord.gg/Eg286wY) to join the support server for Wumpus!\n\n[Click here](https://donatebot.io/checkout/529775327657066506?buyer=${msg.author.id}) to donate to Wumpus!`)
  .setColor(tokens.generic.colour.default)
  .setTimestamp()
  .setFooter(`${tokens.generic.footer}`, `${tokens.generic.footerURL}`)
  msg.channel.send(embed).catch((error) => {log.error(error)});
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['invite', 'wumpus', 'support', 'donate']
};

exports.help = {
  name: 'invite',
  description: 'Edits the bot config',
  usage: 'invite'
};
