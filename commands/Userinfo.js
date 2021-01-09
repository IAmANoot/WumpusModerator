var Discord = require('discord.js');
const tokens = require('../tokens.json');
const log = require(`../handlers/logHandler.js`);
const client = new Discord.Client();
const moment = require('moment');

exports.run = async (client, msg, params) => {
  let server = client.getServer.get(msg.guild.id);
  const args = msg.content.slice(server.prefix.length+exports.help.name).trim().split(/ +/g);

  if (msg.mentions.users.size < 1) {

    let date = msg.author.createdAt
    let nowdate = new Date()
    let timedif = Math.abs(nowdate.getTime() - date.getTime())
    let daydif = timedif / (1000 * 3600 * 24)

    const embed = new Discord.RichEmbed()
    .setDescription(`:inbox_tray: ${msg.author.tag} | ${msg.author.id}\n\n**Roles (${msg.member.roles.filter(r => r.name).size}):** ${msg.member.roles.map(roles => `${roles.name}`).join(', ')}`)
    .addField('Status', `${msg.author.presence.status.toUpperCase()}`, true)
    .addField('Game', `${msg.author.presence.game === null ? "No Game" : msg.author.presence.game.name}`, true)
    .addField('Nickname', `${msg.member.nickname !== null ? `${msg.member.nickname}` : `None`}`, true)
    .addField('Joined Discord', `${moment(msg.author.createdAt).format('DD/MM/YY')}`, true)
    .addField('Joined Server', `${moment(msg.member.joinedAt).format('DD/MM/YY')}`, true)
    .addField('Bot', `${msg.author.bot.toString()}`, true)
    .addField('Age', `${parseInt(daydif)} days`)
    .setColor(tokens.generic.colour.default)
    .setThumbnail(msg.author.avatarURL)
    .setTimestamp()
    .setFooter(`Check another users info with ${server.prefix}userinfo <user>`, `${tokens.generic.footerURL}`)
    msg.channel.send(embed).catch((error) => {log.error(error)});
    return;
  }


  let user = msg.mentions.users.first();

  let date = user.createdAt
  let nowdate = new Date()
  let timedif = Math.abs(nowdate.getTime() - date.getTime())
  let daydif = timedif / (1000 * 3600 * 24)

  const embed = new Discord.RichEmbed()
  .setDescription(`:inbox_tray: ${user.tag} | ${user.id}\n\n**Roles (${msg.guild.member(user).roles.filter(r => r.name).size}):** ${msg.guild.member(user).roles.map(roles => `${roles.name}`).join(', ')}`)
  .addField('Status', `${user.presence.status.toUpperCase()}`, true)
  .addField('Game', `${user.presence.game === null ? "No Game" : user.presence.game.name}`, true)
  .addField('Nickname', `${msg.guild.member(user).nickname !== null ? `${msg.member.nickname}` : `None`}`, true)
  .addField('Joined Discord', `${moment(user.createdAt).format('DD/MM/YY')}`, true)
  .addField('Joined Server', `${moment(msg.member.joinedAt).format('DD/MM/YY')}`, true)
  .addField('Bot', `${user.bot.toString()}`, true)
  .addField('Age', `${parseInt(daydif)} days`)
  .setColor(tokens.generic.colour.default)
  .setThumbnail(user.avatarURL)
  .setTimestamp()
  .setFooter(`Check another users info with ${server.prefix}userinfo <user>`, `${tokens.generic.footerURL}`)
  msg.channel.send(embed).catch((error) => {log.error(error)});
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['userinfo', 'user']
};

exports.help = {
  name: 'userinfo',
  description: 'View a users info and stats',
  usage: 'userinfo'
};
