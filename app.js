const Discord = require(`discord.js`);
const log = require(`./handlers/logHandler.js`);
const tokens = require(`./tokens.json`);
const fs = require(`fs`);
const client = new Discord.Client();

const SQLite = require("better-sqlite3");
const serverdb = new SQLite('assets/server.sqlite');
const warningsdb = new SQLite('assets/warnings.sqlite');

const table5 = serverdb.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'Server';").get();
if (!table5['count(*)']) {
  serverdb.prepare("CREATE TABLE Server (id TEXT PRIMARY KEY, prefix TEXT, staffrole TEXT, muterole TEXT, logchannel TEXT);").run();
  serverdb.prepare("CREATE UNIQUE INDEX idx_scores_id ON Server (id);").run();
  serverdb.pragma("synchronous = 1");
  serverdb.pragma("journal_mode = wal");
}
client.getServer = serverdb.prepare("SELECT * FROM Server WHERE id = ?");
client.setServer = serverdb.prepare("INSERT OR REPLACE INTO Server (id, prefix, staffrole, muterole, logchannel) VALUES (@id, @prefix, @staffrole, @muterole, @logchannel);");

const table = warningsdb.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'Warnings';").get();
if (!table['count(*)']) {
  warningsdb.prepare("CREATE TABLE Warnings (user TEXT PRIMARY KEY, warnings TEXT);").run();
  warningsdb.prepare("CREATE UNIQUE INDEX idx_scores_id ON Warnings (user);").run();
  warningsdb.pragma("synchronous = 1");
  warningsdb.pragma("journal_mode = wal");
}
client.getAllWarnings = warningsdb.prepare("SELECT * FROM Warnings");
client.getWarnings = warningsdb.prepare("SELECT * FROM Warnings WHERE user = ?");
client.deleteWarnings = warningsdb.prepare("DELETE FROM Warnings WHERE user = ?");
client.setWarnings = warningsdb.prepare("INSERT OR REPLACE INTO Warnings (user, warnings) VALUES (@user, @warnings);");


client.tokens = tokens;
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./commands', (err, files) => {
  if (err) console.error(err);
  files.forEach(f => {
    let props = require(`./commands/${f}`);
    log.info(`Loading Command: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
  log.info(`Loading a total of ${files.length} commands.`);
});

fs.readdir('./events/', (err, files) => {
  if (err) console.error(err);
  log.info(`Loading a total of ${files.length} events.`);
  files.forEach(file => {
    const eventName = file.split(".")[0];
    const event = require(`./events/${file}`);
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
  });
});

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

client.on("guildCreate", newguild => {
  let guild = client.guilds.find(guild => guild.id === tokens.guild);
  let channel = guild.channels.find(channel => channel.name === "guild-join");

  const embed = new Discord.RichEmbed()
  .setThumbnail(newguild.ironURL)
  .setDescription(`:inbox_tray: Guild Join | Guilds: ${client.guilds.keyArray().length}`)
  .addField(`Owner Name | ID`, `${newguild.owner.user.tag} | ${newguild.ownerID}`)
  .addField(`Server Name | ID`, `${newguild.name} | ${newguild.id}`)
  .addField(`Server Humans`, `${checkMembers(newguild)}`)
  .addField(`Server Bots`, `${checkBots(newguild)}`)
  .setColor(tokens.generic.colour.default)
  .setTimestamp()
  .setFooter(`${tokens.generic.footer}`, `${tokens.generic.footerURL}`)
  channel.send(embed).catch((error) => {log.error(error)});
})

client.on("guildDelete", newguild => {
  let server = client.getServer.get(newguild.id);

  let guild = client.guilds.find(guild => guild.id === tokens.guild);
  let channel = guild.channels.find(channel => channel.name === "guild-leave");

  const embed = new Discord.RichEmbed()
  .setThumbnail(newguild.ironURL)
  .setDescription(`:outbox_tray: Guild Leave | Guilds: ${client.guilds.keyArray().length}`)
  .addField(`Owner Name | ID`, `${newguild.owner.user.tag} | ${newguild.ownerID}`)
  .addField(`Server Name | ID`, `${newguild.name} | ${newguild.id}`)
  .addField(`Server Humans`, `${checkMembers(newguild)}`)
  .addField(`Server Bots`, `${checkBots(newguild)}`)
  .setColor(tokens.generic.colour.error)
  .setTimestamp()
  .setFooter(`${tokens.generic.footer}`, `${tokens.generic.footerURL}`)
  channel.send(embed).catch((error) => {log.error(error)});

  if (!server) return;
  const deleteStatement = serverdb.prepare(`DELETE FROM Server WHERE id='${newguild.id}'`);
  deleteStatement.run();
})

client.on('error', console.error);

process.on("unhandledRejection", err => {
  log.error("Unhandled Promise Rejection: " + err.stack);
});

client.login(`${tokens.token}`);
