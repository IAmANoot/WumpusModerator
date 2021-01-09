var Discord = require('discord.js');
const tokens = require('../tokens.json');
const log = require(`../handlers/logHandler.js`);
const client = new Discord.Client();

exports.run = async (client, msg, params) => {
  let server = client.getServer.get(msg.guild.id);
  const args = msg.content.slice(server.prefix.length+exports.help.name).trim().split(/ +/g);

  let banUser;

  if (!msg.member.roles.has(server.staffrole)) {
    msg.channel.send(`<:wumpusxmark:599363387801075712> You need to be staff to use this command!`).catch((error) => {log.error(error)});
    return;
  }

  if (msg.mentions.users.size < 1) {
    let user = args[1];
    if (msg.guild.member(user)) {
      banUser = msg.guild.members.get(user).user;
    } else {
      msg.channel.send(`<:wumpusxmark:599363387801075712> Please mention a user`).catch((error) => {log.error(error)});
      return;
    }
  } else {
    banUser = msg.mentions.users.first();
  }

  if (msg.guild.member(banUser).roles.has(server.staffrole)) {
    msg.channel.send(`<:wumpusxmark:599363387801075712> You cannot ban another staff member`).catch((error) => {log.error(error)});
    return;
  }

  let reason = msg.content.split(" ").slice(2).join(" ");

  if (!reason) {
    msg.channel.send(`<:wumpusxmark:599363387801075712> You need to supply a reason!`).catch((error) => {log.error(error)});
    return;
  }

  msg.guild.member(banUser).ban(reason)
  const embed = new Discord.RichEmbed()
  .setAuthor(`${banUser.tag} has been banned`, banUser.avatarURL)
  .addField(`Reason:`, `${reason}`)
  .setColor(tokens.generic.colour.default)
  .setTimestamp()
  .setFooter(`${tokens.generic.footer} `, `${tokens.generic.footerURL}`)
  msg.channel.send(embed).catch((error) => {log.error(error)});

  if (server.logchannel != "None") {
    let logChannel = client.channels.find(ch => ch.id == server.logchannel);

    const embedLog = new Discord.RichEmbed()
    .setAuthor(`[Ban] ${banUser.tag}`, banUser.avatarURL)
    .addField(`User`, `${banUser}`, true)
    .addField(`Moderator`, `${msg.author}`, true)
    .addField(`Reason`, `${reason}`)
    .setColor(tokens.generic.colour.error)
    .setTimestamp()
    .setFooter(`${tokens.generic.footer} `, `${tokens.generic.footerURL}`)
    logChannel.send(embedLog).catch((error) => {log.error(error)});
  }

}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['ban']
};

exports.help = {
  name: 'ban',
  description: 'Bans a user from the server',
  usage: 'ban'
};
