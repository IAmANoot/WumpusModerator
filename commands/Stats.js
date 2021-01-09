var Discord = require('discord.js');
const tokens = require('../tokens.json');
const log = require(`../handlers/logHandler.js`);
const client = new Discord.Client();

exports.run = async (client, msg, params) => {

   var hrs = Math.round(client.uptime / (1000 * 60 * 60)) + "h,"
   var mins = " " + Math.round(client.uptime / (1000 * 60)) % 60 + "m, "
   var sec = Math.round(client.uptime / 1000) % 60 + "s"
   if (hrs == "0h,") hrs = ""
   if (mins == " 0m, ") mins = ""
   let uptime = hrs+mins+sec

   let startTime = Date.now();
   const embed = new Discord.RichEmbed()
   .setDescription(`<a:loading:531244385040596992> Loading stats... <a:loading:531244385040596992>`)
   .setColor(tokens.generic.colour.default)
   msg.channel.send(embed).catch((error) => {log.error(error)}).then(newMessage => {
   let endTime = Date.now();
   embed.setDescription(`<a:loading:531244385040596992> ${client.user.username} stats <a:loading:531244385040596992>`)
    embed.addField(`• Ping: `, `${Math.round(endTime - startTime)}ms`, true)
    embed.addField(`• Uptime: `, `${uptime}`, true)
    embed.addField(`• RAM Usage: `, `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`, true)
    embed.addField(`• Servers: `, `${client.guilds.keyArray().length}`, true)
    embed.addField(`• Users: `, `${client.users.keyArray().length}`, true)
    embed.addField(`• Developer: `, `!AmANoot#0123`, true)
    newMessage.edit(embed).catch((error) => {log.error(error)});
  })
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['stat', 'info', 'ping', 'uptime']
};

exports.help = {
  name: 'stats',
  description: 'View the bot stats',
  usage: 'stats'
};
