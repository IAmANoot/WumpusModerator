var Discord = require('discord.js');
const tokens = require('../tokens.json');
const log = require(`../handlers/logHandler.js`);
const client = new Discord.Client();

exports.run = async (client, msg, params) => {
  let server = client.getServer.get(msg.guild.id);
  const args = msg.content.slice(server.prefix.length+exports.help.name).trim().split(/ +/g);

    if (!msg.member.hasPermission('MANAGE_GUILD')) {
      const embed = new Discord.RichEmbed()
      .setAuthor(tokens.generic.messages.noPermissions)
      .setDescription("You need the `MANAGE_GUILD` permission to do this")
      .setColor(tokens.generic.colour.error)
      .setTimestamp()
      .setFooter(`${tokens.generic.footer}`, `${tokens.generic.footerURL}`)
      msg.channel.send(embed).catch((error) => {log.error(error)});
      return;
    }

  if (!args[1]) {
    const embed = new Discord.RichEmbed()
    .setAuthor(tokens.generic.messages.invalidSyntax)
    .setDescription("`" + server.prefix + "config [key] [value]`\n\nUse one of the following keys: `prefix`, `staffRole`, `muteRole`, `logChannel`")
    .setColor(tokens.generic.colour.error)
    .setTimestamp()
    .setFooter(`${tokens.generic.footer}`, `${tokens.generic.footerURL}`)
    msg.channel.send(embed).catch((error) => {log.error(error)});
    return;
  }

  let key = args[1].toLowerCase();

  if (!args[2]) {
    let value;
    if (key === "prefix") {
      value = server.prefix
    } else if (key === "staffrole") {
      value = `<@&${server.staffrole}> (${server.staffrole})`
    } else if (key === "logchannel") {
      value = `<#${server.logchannel}> (${server.logchannel})`
    } else if (key === "muterole") {
      value = `<@&{server.muterole}> (${server.muterole})`
    }
    const embed = new Discord.RichEmbed()
    .setAuthor(key)
    .setDescription("Use `" + server.prefix + "config " + key + " <value>` to change the value.")
    .addField(`Current Value`, `${value}`)
    .setColor(tokens.generic.colour.default)
    .setTimestamp()
    .setFooter(`${tokens.generic.footer}`, `${tokens.generic.footerURL}`)
    msg.channel.send(embed).catch((error) => {log.error(error)});
    return;
  }

  let value = args[2];

  if (key === "prefix") {
    server.prefix = value;
    client.setServer.run(server);
    msg.channel.send(`<:wumpuscheckmark:599362440026914818> prefix was set to ${value}`)
  } else if (key === "staffrole") {
    let role = msg.mentions.roles.first();
    if (msg.mentions.roles.size < 1) {
      server.staffrole = value;
      client.setServer.run(server);
      msg.channel.send(`<:wumpuscheckmark:599362440026914818> staffRole was set to <@&${value}>`)
      return;
    }
    server.staffrole = role.id;
    client.setServer.run(server);
    msg.channel.send(`<:wumpuscheckmark:599362440026914818> staffRole was set to ${role}`)
  } else if (key === "muterole") {
    let role = msg.mentions.roles.first();
    if (msg.mentions.roles.size < 1) {
      server.muterole = value;
      client.setServer.run(server);
      msg.channel.send(`<:wumpuscheckmark:599362440026914818> muteRole was set to <@&${value}>`)
      return;
    }
    server.muterole = role.id;
    client.setServer.run(server);
    msg.channel.send(`<:wumpuscheckmark:599362440026914818> muteRole was set to ${role}`)
  } else if (key === "logchannel") {
    let channel = msg.mentions.channels.first();
    if (msg.mentions.channels.size < 1) {
      server.logchannel = value;
      client.setServer.run(server);
      msg.channel.send(`<:wumpuscheckmark:599362440026914818> logChannel was set to <#${value}>`)
      return;
    }
    server.logchannel = channel.id;
    client.setServer.run(server);
    msg.channel.send(`<:wumpuscheckmark:599362440026914818> logChannel was set to ${channel}`)
  }

}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['config']
};

exports.help = {
  name: 'config',
  description: 'Edits the bot config',
  usage: 'config'
};
