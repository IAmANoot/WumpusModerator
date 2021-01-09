var Discord = require('discord.js');
const tokens = require('../tokens.json');
const log = require(`../handlers/logHandler.js`);
const client = new Discord.Client();

exports.run = async (client, msg, params) => {
  let server = client.getServer.get(msg.guild.id);

  if (!msg.member.roles.has(server.staffrole)) {
    msg.channel.send(`<:wumpusxmark:599363387801075712> You need to be staff to use this command!`).catch((error) => {log.error(error)});
    return;
  }

  if (msg.mentions.users.size < 1) {
    msg.channel.send(`<:wumpusxmark:599363387801075712> Please mention a user`).catch((error) => {log.error(error)});
    return;
  }

  let user = msg.mentions.users.first();

  let warningType = `${user.id}-${msg.guild.id}`
  let warnings = client.getWarnings.get(warningType);

  if (!warnings) {
    msg.channel.send(`<:wumpusxmark:599363387801075712> ${user} has no infractions`).catch((error) => {log.error(error)});
    return;
  }

  const embed = new Discord.RichEmbed()
  .setAuthor(`${user.tag}'s infractions`, user.avatarURL)
  .setDescription(`**Infractions**${warnings.warnings}`)
  .setColor(tokens.generic.colour.default)
  .setTimestamp()
  .setFooter(`${tokens.generic.footer} `, `${tokens.generic.footerURL}`)
  msg.channel.send(embed).catch((error) => {log.error(error)});
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['infractions']
};

exports.help = {
  name: 'infractions',
  description: 'Check a users infractions',
  usage: 'infractions'
};
