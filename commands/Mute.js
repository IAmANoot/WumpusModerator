var Discord = require('discord.js');
const tokens = require('../tokens.json');
const log = require(`../handlers/logHandler.js`);
const client = new Discord.Client();
const ms = require("ms");
const toTime = require('to-time');

exports.run = async (client, msg, params) => {
  let server = client.getServer.get(msg.guild.id);
  const args = msg.content.slice(server.prefix.length+exports.help.name).trim().split(/ +/g);

  let time;
  let muteUser;

  if (!msg.member.roles.has(server.staffrole)) {
    msg.channel.send(`<:wumpusxmark:599363387801075712> You need to be staff to use this command!`).catch((error) => {log.error(error)});
    return;
  }

  if (msg.mentions.users.size < 1) {
    let user = args[1];
    if (msg.guild.member(user)) {
      muteUser = msg.guild.members.get(user).user;
    } else {
      msg.channel.send(`<:wumpusxmark:599363387801075712> Please mention a user`).catch((error) => {log.error(error)});
      return;
    }
  } else {
    muteUser = msg.mentions.users.first();
  }
  
  let muteTime = args[2];

  if (msg.guild.member(muteUser).roles.has(server.staffrole)) {
    msg.channel.send(`<:wumpusxmark:599363387801075712> You cannot mute another staff member`).catch((error) => {log.error(error)});
    return;
  }

  if (msg.guild.member(muteUser).roles.has(server.muterole)) {
    msg.channel.send(`<:wumpusxmark:599363387801075712> This user is already muted!`).catch((error) => {log.error(error)});
    return;
  }

  let reason;
  if (!msg.content.split(" ").slice(3).join(" ")) {
    msg.guild.member(muteUser).addRole(server.muterole)
    reason = msg.content.split(" ").slice(2).join(" ")
    time = "Forever"
  }

  if (msg.content.split(" ").slice(3).join(" ")) {
    time = toTime(muteTime);
    reason = msg.content.split(" ").slice(3).join(" ")

    msg.guild.member(muteUser).addRole(server.muterole);
    setTimeout(function() {
      msg.guild.member(muteUser).removeRole(server.muterole)

      if (server.logchannel != "None") {
        let logChannel = client.channels.find(ch => ch.id == server.logchannel);

        const embedLog = new Discord.RichEmbed()
        .setAuthor(`[Unmute] ${muteUser.tag}`, muteUser.avatarURL)
        .addField(`User`, `${muteUser}`, true)
        .addField(`Moderator`, `${client.user}`, true)
        .setColor(tokens.generic.colour.confirm)
        .setTimestamp()
        .setFooter(`${tokens.generic.footer} `, `${tokens.generic.footerURL}`)
        logChannel.send(embedLog).catch((error) => {log.error(error)});
      }
    }, ms(muteTime))
  }

  const embed = new Discord.RichEmbed()
  .setAuthor(`${muteUser.tag} has been muted`, muteUser.avatarURL)
  .addField(`Reason:`, `${reason}`, true)
  .addField(`Time:`, `${time}`, true)
  .setColor(tokens.generic.colour.default)
  .setTimestamp()
  .setFooter(`${tokens.generic.footer} `, `${tokens.generic.footerURL}`)
  msg.channel.send(embed).catch((error) => {log.error(error)});

  if (server.logchannel != "None") {
    let logChannel = client.channels.find(ch => ch.id == server.logchannel);

    const embedLog = new Discord.RichEmbed()
    .setAuthor(`[Mute] ${muteUser.tag}`, muteUser.avatarURL)
    .addField(`User`, `${muteUser}`, true)
    .addField(`Time`, `${time}`, true)
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
  aliases: ['mute', 'tempmute']
};

exports.help = {
  name: 'mute',
  description: 'kick a user from the server',
  usage: 'mute'
};
