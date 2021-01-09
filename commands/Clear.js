var Discord = require('discord.js');
const tokens = require('../tokens.json');
const log = require(`../handlers/logHandler.js`);
const client = new Discord.Client();

exports.run = async (client, msg, params) => {
  let server = client.getServer.get(msg.guild.id);
  const args = msg.content.slice(server.prefix.length+exports.help.name).trim().split(/ +/g);

  if (!msg.member.roles.has(server.staffrole)) {
    const embed = new Discord.RichEmbed()
    .setAuthor(tokens.generic.messages.noPermissions)
    .setDescription(`You do not have permission for this command, ${msg.author}`)
    .setColor(tokens.generic.colour.error)
    .setTimestamp()
    .setFooter(`${tokens.generic.footer}`, `${tokens.generic.footerURL}`)
    msg.channel.send(embed)
    return;
  }

    let amount = Number(params[0]);

    if (!amount) {
      msg.channel.send(`<:wumpusxmark:599363387801075712> Please specify the number of messages to clear`)
      return;
    }
    msg.channel.fetchMessages({limit: amount + 1})
    .then(messages => msg.channel.bulkDelete(messages)).catch(err => msg.channel.send('<:wumpusxmark:599363387801075712> Err: ' + err))
    msg.channel.send(`<:wumpuscheckmark:599362440026914818> I deleted **${amount} messages**`).then(m => {
      m.delete(1500);
    })
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['clear', 'purge', 'prune']
};

exports.help = {
  name: 'clear',
  description: 'Clears or purges messages',
  usage: 'clear'
};
