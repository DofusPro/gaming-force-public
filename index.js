const Data = require("./functions.js");
/* Connect to express and auto-restart the project */
Data.connectExpress();

/* Requirements */
const Discord = require("discord.js");
const DB = require("quick.db");
const fs = require("fs");
const moment = require("moment");
const CommandCooldown = new Set();

const Client = new Discord.Client();
const prefix = Data.client.prefix;

/* Command Handling */
Client.commands = new Discord.Collection();
Client.aliases = new Discord.Collection();

fs.readdir("./cmds/", (err, files) => {
  if (err) log(err);

  log(`Loading a total of ${files.length} commands.`);

  files.forEach(f => {
    let props = require(`./cmds/${f}`);
    log(`Loading Command: ${props.help.name}.`);

    Client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      Client.aliases.set(alias, props.help.name);
    });
  });
});

/* Client Message Event */
Client.on("message", async message => {
  if (message.author.bot == true) return;
  if (message.channel.type == "dm") {
    let messageContent = message.content;
    if (messageContent.length > 1900) {
      let link = await Data.createPaste(
        messageContent,
        "Contenido de Mensaje - " + message.author.username
      );
      let embed = new Discord.RichEmbed()
        .setColor("#607d8b")
        .setDescription(
          "ℹ Mensaje enviado al buzón privado por `" +
            message.author.tag +
            "`, su contenido es (Acortado):\n\n" +
            link
        )
        .setFooter(
          message.author.id + " - " + message.author.username,
          message.author.avatarURL || message.author.defaultAvatarURL
        );
      if (message.attachments.first())
        embed.setImage(message.attachments.first().url);
      return Client.channels.get("").send(embed);
    } else {
      let embed = new Discord.RichEmbed()
        .setColor("#607d8b")
        .setDescription(
          "ℹ Mensaje enviado al buzón privado por `" +
            message.author.tag +
            "`, su contenido es:\n\n" +
            message.content
        )
        .setFooter(
          message.author.id + " - " + message.author.username,
          message.author.avatarURL || message.author.defaultAvatarURL
        );
      if (message.attachments.first())
        embed.setImage(message.attachments.first().url);
      return Client.channels.get("").send(embed);
    }
  }

  if (
    !Data.levelCooldown.includes(message.author.id) &&
    message.author.bot == false
  )
    await Data.generateExperience(message);

  if (message.isMentioned(Client.users.get('372466760848244736')))
    message.channel.send(
      "Si mencionas a Bisho por problemas del bot Unity, estás llamando a la persona errónea, ya que él no administra ese bot.\n**-** Admin de Gaming Force: `iBisho#7130`\n**-** Admin de Unity: `JυαиȻ#2918`"
    );

  if (message.content.startsWith(prefix) == false) return;
  let command = message.content
    .split(" ")[0]
    .slice(prefix.length)
    .toLowerCase();
  let perms = await Client.elevation(message.member);
  let fetchedUser = await DB.get(`${message.author.id}`);

  let cmd;

  if (Client.commands.has(command)) {
    cmd = Client.commands.get(command);
  } else if (Client.aliases.has(command)) {
    cmd = Client.commands.get(Client.aliases.get(command));
  }

  if (cmd) {
    if (fetchedUser.blacklisted == true) {
      message.delete();

      let embed = new Discord.RichEmbed()
        .setColor(Data.colors.outage)
        .setAuthor(
          message.author.username,
          message.author.avatarURL || message.author.defaultAvatarURL
        )
        .setDescription(
          "❌ **Error:** Estás en la lista negra, por lo tanto no puedes ocupar los comandos."
        )
        .setTimestamp();
      return message.channel.send(embed).then(msg => msg.delete(10000));
    }

    if (perms < cmd.conf.permLevel) {
      message.delete();

      let embed = new Discord.RichEmbed()
        .setColor(Data.colors.outage)
        .setAuthor(
          message.author.username,
          message.author.avatarURL || message.author.defaultAvatarURL
        )
        .setDescription("❌ **Error:** Permisos insuficientes.")
        .setTimestamp();
      return message.channel.send(embed).then(msg => msg.delete(10000));
    }

    if (CommandCooldown.has(message.author.id + cmd.help.name)) {
      message.delete();

      let embed = new Discord.RichEmbed()
        .setColor(Data.colors.outage)
        .setAuthor(
          message.author.username,
          message.author.avatarURL || message.author.defaultAvatarURL
        )
        .setDescription(
          "❌ **Error:** Estás en tiempo de espera de este comando."
        )
        .setTimestamp();
      return message.channel.send(embed).then(msg => msg.delete(10000));
    }

    if (
      cmd.conf.enabled == false &&
      message.author.id !== "372466760848244736" &&
      message.author.id !== "487085456450781186"
    ) {
      message.delete();

      let embed = new Discord.RichEmbed()
        .setColor(Data.colors.outage)
        .setAuthor(
          message.author.username,
          message.author.avatarURL || message.author.defaultAvatarURL
        )
        .setDescription("❌ **Error:** Comando en desarrollo o desactivado.")
        .setTimestamp();
      return message.channel.send(embed).then(msg => msg.delete(10000));
    }

    if (cmd.conf.requireSpaces == false)
      message.content = message.content.replace(/\s\s+/g, " ");
    let params = message.content.split(" ").slice(1);

    cmd.run(Client, message, params);
    let logChannel = Client.channels.get("594291762521178119");
    let logEmbed = new Discord.RichEmbed()
      .setColor("#607d8b")
      .setAuthor(Client.user.username, Client.user.avatarURL)
      .setDescription(
        "ℹ El comando `" +
          cmd.help.name +
          "` ha sido ejecutado en <#" +
          message.channel.id +
          "> por " +
          message.author +
          ":\n\n`" +
          message.content +
          "`\n\n[Saltar al mensaje.](" +
          message.url +
          ")"
      )
      .setTimestamp();
    logChannel.send(logEmbed);

    let ms = require("ms");
    CommandCooldown.add(message.author.id + cmd.help.name);

    setTimeout(function() {
      CommandCooldown.delete(message.author.id + cmd.help.name);
    }, ms(cmd.conf.cooldown));
  }
});

function log(message) {
  let time = moment().format("DD/MM HH:mm:ss");
  return console.log(`[${time}] ${message}`);
}

Client.elevation = member => {
  let permlvl = 0;
  if (member.roles.has("510994280177729536")) permlvl = 1; // Server Staff
  if (member.roles.has("415218556876095488")) permlvl = 2; // Moderador
  if (member.roles.has("462851055114518529")) permlvl = 3; // Mod Leader
  if (member.roles.has("462851061460238338")) permlvl = 4; // Admins
  if (member.user.id == "441371076887445523") permlvl = 5; // Matt
  if (
    member.user.id == Data.client.ownerID ||
    member.user.id == "487085456450781186"
  )
    permlvl = 6; // iBisho
  return permlvl;
};

setInterval(async () => {
  if (!Client.guilds.get("407892224064487435")) return;
  Client.guilds.get("407892224064487435").members.forEach(memer => {
    let timeNow = +new Date();
    let year = 31104000000;
    let Miliseconds = require("ms");

    if (memer.joinedTimestamp < timeNow - year)
      memer.addRole("584147499787485241");
    else return;
  });
}, 900000);

Client.on("ready", async () => {
  let readyEmbed = new Discord.RichEmbed()
    .setColor("#607d8b")
    .setAuthor(Client.user.username, Client.user.avatarURL)
    .setDescription(
      "ℹ El bot ha sido prendido correctamente, y está listo para cumplir sus funciones."
    )
    .setFooter("Gaming Force V2.0.4")
    .setTimestamp();
  Client.channels.get("594291112320040976").send(readyEmbed);

  Client.user.setPresence({
    status: "online",
    game: {
      name: "Gaming Force | -help",
      type: "WATCHING"
    }
  });

  setInterval(async () => {
    let bansFetcherManager = new DB.table("bans");
    let mutesFetcherManager = new DB.table("mutes");
    let banList = bansFetcherManager.get("banlist");
    let muteList = mutesFetcherManager.get("mutelist");

    if (banList == {} && muteList == {}) return;

    for (var key in banList) {
      let pKey = banList[key];
      if (pKey.expiration < Date.now()) {
        let fetchedUser = await Client.fetchUser(pKey.user);
        Client.guilds
          .get("407892224064487435")
          .unban(pKey.user, "Ban Temporal, ha expirado.");
        bansFetcherManager.delete(`banlist.${pKey.user}`);

        let timeNow = require("moment")().format("DD/MM/YYYY HH:mm");

        let unBanEmbed = new Discord.RichEmbed()
          .setColor(Data.colors.green)
          .setTitle("🔓 Unban [AUTO] | Gaming Force Moderation Service")
          .setThumbnail(fetchedUser.avatarURL || fetchedUser.defaultAvatarURL)
          .setDescription(
            "**Usuario**: " +
              fetchedUser.tag +
              " | " +
              fetchedUser.id +
              "\n**Moderador**: <@!" +
              Client.user.id +
              ">\n**Razón**: ✅ El ban temporal ha terminado.\n**Hora**: " +
              timeNow
          )
          .setTimestamp();
        Client.channels.get("541655906241478671").send(unBanEmbed);
        continue;
      } else {
        continue;
      }
    }

    for (var key in muteList) {
      let pKey = muteList[key];
      if (pKey.expiration < Date.now()) {
        let fetchedUser = await Client.fetchUser(pKey.user);
        mutesFetcherManager.delete(`mutelist.${pKey.user}`);

        let member = Client.guilds.get("407892224064487435").member(pKey.user);
        if (member)
          member.removeRole("512788018575310849", "Silencio terminado.");

        let timeNow = require("moment")().format("DD/MM/YYYY HH:mm");

        let unmuteEmbed = new Discord.RichEmbed()
          .setColor(Data.colors.blue)
          .setTitle("🔊 Unmute [AUTO] | Gaming Force Moderation Service")
          .setThumbnail(fetchedUser.avatarURL || fetchedUser.defaultAvatarURL)
          .setDescription(
            "**Usuario**: " +
              fetchedUser.tag +
              " | " +
              fetchedUser.id +
              "\n**Moderador**: <@!" +
              Client.user.id +
              ">\n**Razón**: ✅ El silencio temporal ha terminado.\n**Hora**: " +
              timeNow
          )
          .setTimestamp();
        Client.channels.get("529485500701212674").send(unmuteEmbed);
        continue;
      } else {
        continue;
      }
    }
  }, 2500);
});

Client.on("guildMemberAdd", async member => {
  if (ifGuildReturn(member.guild) == true) return;

  let aNick = "[🌀] " + member.user.username;

  for (let i = 0; i < 50; i++) {
    if (aNick.length <= 32) break;
    else aNick = aNick.substring(0, aNick.length - 1);
  }

  member.setNickname(aNick, "Autofunción de nicknames.");
  await member.addRole("");

  let mutesFetcher = new DB.table("mutes");
  let mutesFetcherManager = mutesFetcher.get("mutelist");

  if (mutesFetcherManager[member.id]) {
    await member.addRole("");
  }
});

Client.on("channelCreate", async chann => {
  if (chann.type !== "text" && chann.type !== "voice") return;
  if (!chann.guild) return;
  if (ifGuildReturn(chann.guild)) return;
  console.log(chann.name);
  let muteRole = chann.guild.roles.get("");
  chann.overwritePermissions(muteRole, {
    SEND_MESSAGES: false,
    ADD_REACTIONS: false,
    SPEAK: false
  });
});

Client.on("error", async info => {
  let errorEmbed = new Discord.RichEmbed()
    .setColor("#e74c3c")
    .setAuthor(Client.user.username, Client.user.avatarURL)
    .setDescription(
      "ℹ Ha ocurrido un error con el cliente, la información está a continuación:\n```js\n" +
        info.message +
        "\n```"
    )
    .setFooter("Gaming Force V2.0.4")
    .setTimestamp();
  Client.channels.get("").send(errorEmbed);
});

function ifGuildReturn(guild) {
  if (guild.id !== "407892224064487435") return true;
  else return false;
}

Client.login(Data.client.token);
