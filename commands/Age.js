var Discord = require('discord.js');
const tokens = require('../tokens.json');
const log = require(`../handlers/logHandler.js`);
const client = new Discord.Client();

exports.run = async (client, msg, params) => {
  if (msg.mentions.users.size < 1) {
    let date = msg.author.createdAt
    let nowdate = new Date()
    let timedif = Math.abs(nowdate.getTime() - date.getTime())
    let daydif = timedif / (1000 * 3600 * 24)
    const embed = new Discord.RichEmbed()
    .setDescription(`Your account is **${parseInt(daydif)}** days old`)
    .setColor(tokens.generic.colour.default)
    .setTimestamp()
    .setFooter(`${tokens.generic.footer}`, `${tokens.generic.footerURL}`)
    msg.channel.send(embed).catch((error) => {log.error(error)});
    return;
  }
  let user = msg.mentions.users.first();
  let date = user.createdAt
  let nowdate = new Date()
  let timedif = Math.abs(nowdate.getTime() - date.getTime())
  let daydif = timedif / (1000 * 3600 * 24)
  const embed = new Discord.RichEmbed()
  .setDescription(`${user.username}'s account is **${parseInt(daydif)}** days old`)
  .setColor(tokens.generic.colour.default)
  .setTimestamp()
  .setFooter(`${tokens.generic.footer}`, `${tokens.generic.footerURL}`)
  msg.channel.send(embed).catch((error) => {log.error(error)});
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['age']
};

exports.help = {
  name: 'age',
  description: 'Check how old an account is',
  usage: 'age'
};
