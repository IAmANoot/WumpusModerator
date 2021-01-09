var Discord = require('discord.js');
const tokens = require('../tokens.json');
const log = require(`../handlers/logHandler.js`);
const client = new Discord.Client();

exports.run = async (client, msg, params) => {
  let server = client.getServer.get(msg.guild.id);
  const args = msg.content.slice(server.prefix.length+exports.help.name).trim().split(/ +/g);

  let region = {
      "brazil": "Brazil",
      "eu-central": "Central Europe",
      "singapore": "Singapore",
      "us-central": "U.S. Central",
      "sydney": "Sydney",
      "us-east": "U.S. East",
      "us-south": "U.S. South",
      "us-west": "U.S. West",
      "eu-west": "Western Europe",
      "vip-us-east": "VIP U.S. East",
      "london": "London",
      "amsterdam": "Amsterdam",
      "hongkong": "Hong Kong"
  };

  if (!args[1]) {

    if (!msg.guild.me.permissions.has("MANAGE_GUILD")) {
      const embed = new Discord.RichEmbed()
        .setDescription("I need the permission `MANAGE_GUILD` on **" + msg.guild.name + "**")
        .setColor(tokens.generic.colour.error)
        .setTimestamp()
        .setFooter(`${tokens.generic.footer}`, `${tokens.generic.footerURL}`)
        msg.channel.send(embed).catch((error) => {log.error(error)});
        return;
    }

    const invites = await msg.guild.fetchInvites();
    let invite = "No invite";
    if (invites.size > 0) {
      invite = invites.first().url
    }

    const embed = new Discord.RichEmbed()
    .setDescription(`:inbox_tray: ${msg.guild.name} | ${msg.guild.id}\n\nInvite link: ${invite}`)
    .addField(`Owner`, `${msg.guild.owner.user.tag}`, true)
    .addField(`Owner ID`, `${msg.guild.owner.user.id}`, true)
    .addField(`Server Humans`, `${checkMembers(msg.guild)}`, true)
    .addField(`Server Bots`, `${checkBots(msg.guild)}`, true)
    .addField(`Channels`, `${msg.guild.channels.size}`, true)
    .addField(`Roles`, `${msg.guild.roles.size}`, true)
    .addField(`Region`, `${region[msg.guild.region]}`, true)
    .addField("Creation Date", `${msg.guild.createdAt.toUTCString().substr(0, 16)}`, true)
    .setColor(tokens.generic.colour.default)
    .setThumbnail(msg.guild.iconURL)
    .setTimestamp()
    .setFooter(`Check another guilds info with ${server.prefix}serverinfo <guild ID>`, `${tokens.generic.footerURL}`)
    msg.channel.send(embed).catch((error) => {log.error(error)});
    return;
  }

  if (!client.guilds.has(args[1])) {
    const embed = new Discord.RichEmbed()
    .setDescription("I am not in a guild with that ID")
    .setColor(tokens.generic.colour.error)
    .setTimestamp()
    .setFooter(`${tokens.generic.footer}`, `${tokens.generic.footerURL}`)
    msg.channel.send(embed).catch((error) => {log.error(error)});
    return;
  }

  guild = client.guilds.get(args[1]);

  if (!guild.me.permissions.has("MANAGE_GUILD")) {
    const embed = new Discord.RichEmbed()
      .setDescription("I need the permission `MANAGE_GUILD` on **" + guild.name + "**")
      .setColor(tokens.generic.colour.error)
      .setTimestamp()
      .setFooter(`${tokens.generic.footer}`, `${tokens.generic.footerURL}`)
      msg.channel.send(embed).catch((error) => {log.error(error)});
      return;
  }

  const invites = await guild.fetchInvites();
  let invite = "No invite";
  if (invites.size > 0) {
    invite = invites.first().url
  }

  const embed = new Discord.RichEmbed()
  .setDescription(`:inbox_tray: ${guild.name} | ${guild.id}\n\nInvite link: ${invite}`)
  .addField(`Owner`, `${guild.owner.user.tag}`, true)
  .addField(`Owner ID`, `${guild.owner.user.id}`, true)
  .addField(`Server Humans`, `${checkMembers(guild)}`, true)
  .addField(`Server Bots`, `${checkBots(guild)}`, true)
  .addField(`Channels`, `${guild.channels.size}`, true)
  .addField(`Roles`, `${guild.roles.size}`, true)
  .addField(`Region`, `${region[guild.region]}`, true)
  .addField("Creation Date", `${guild.createdAt.toUTCString().substr(0, 16)}`, true)
  .setColor(tokens.generic.colour.default)
  .setThumbnail(guild.iconURL)
  .setTimestamp()
  .setFooter(`Check another guilds info with ${server.prefix}serverinfo <guild ID>`, `${tokens.generic.footerURL}`)
  msg.channel.send(embed).catch((error) => {log.error(error)});


  function checkBots(guild) {
    let botCount = 0;
    guild.members.forEach(member => {
      if(member.user.bot) botCount++;
    });
    return botCount;
  }
  function checkMembers(guild) {
      let memberCount = 0;
      guild.members.forEach(member => {
        if(!member.user.bot) memberCount++;
      });
      return memberCount;
    }
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['serverinfo', 'guildinfo', 'server', 'guild']
};

exports.help = {
  name: 'serverinfo',
  description: 'View a guilds info and stats',
  usage: 'serverinfo'
};
