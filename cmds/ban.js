const Discord = require('discord.js');
const DB = require('quick.db');
const ms = require('ms');
const Data = require('../functions.js');

exports.run = async (Client, message, params) => {

  let toBan = message.mentions.members.first() || message.guild.members.get(params[0]);
  if (!toBan) {

    let sendEmbed = Data.helpEmbed(message, this, Client);
    return message.channel.send(sendEmbed);
  }

  let isMod = await Client.elevation(toBan);
  if (isMod >= 1) {

    let modEmbed = Data.createEmbed(Data.colors.red, '🛑 No puedes banear a un miembro del personal.');
    return message.channel.send(modEmbed);
  }

  let isBot = toBan.user.bot;
  if (isBot == true) {

    let modEmbed = Data.createEmbed(Data.colors.red, '🛑 No puedes banear a un bot del servidor.');
    return message.channel.send(modEmbed);
  }

  let banReason = Data.getReasons(params[1]);
  if (!banReason || banReason == 'Error') {

    let sendEmbed = Data.helpEmbed(message, this, Client);
    return message.channel.send(sendEmbed);
  }

  let isTemporary = false;
  if (params[2]) {

    if ((!parseInt(params[2]) || !['m', 'h', 'd', 'w'].some(numberer => params[2].endsWith(numberer))) && !params[2].startsWith('0')) {

      let errEmbed = Data.createEmbed(Data.colors.red, '❌ Inserta un tiempo válido.\nOpciones: Xm (X minutos), Xh (X horas), Xd (X días), Xw (X semanas).');
      return message.channel.send(errEmbed);
    }

    isTemporary = true;
  }

  let currentTime = require('moment')().format('DD/MM/YYYY HH:mm');
  let banEmbed = Data.createEmbed(Data.colors.red, '✅ ' + toBan.user.tag + ' ha sido vetado por:\n`' + banReason.name + '`.');
  let sentMessage = await message.channel.send(banEmbed);

  let logEmbed = new Discord.RichEmbed()
    .setColor(Data.colors.red)
    .setTitle('⚒ Ban | Gaming Force Moderation Service')
    .setThumbnail((toBan.user.avatarURL || toBan.user.defaultAvatarURL))
    .setDescription('**Usuario**: ' + toBan.user.tag + ' | ' + toBan.id + '\n**Moderador**: ' + message.author + '\n**Razón**: ' + banReason.name + '\n**Hora**: ' + currentTime)
  if (isTemporary == true) {
    logEmbed.setFooter('Vetado Temporal, termina ');
    logEmbed.setTimestamp((+new Date()) + ms(params[2]));
  } else {
    logEmbed.setTimestamp();
  }

  Client.channels.get('541655906241478671').send(logEmbed);

  let userEmbed = Data.createEmbed(Data.colors.red, '🛠 Has sido vetado de ' + message.guild.name + '\n**Razón**: ' + banReason.name + '\n\n**Definición**: ' + banReason.def);
  await toBan.send(userEmbed).catch((error) => {

    banEmbed.setFooter('El usuario no pudo ser notificado.');
    sentMessage.edit(banEmbed);
  });

  message.guild.ban(toBan, { reason: 'Vetado por ' + banReason.name + ' || Moderador: ' + message.author.tag });

  if (isTemporary == true) {

    let Bans = new DB.table('bans');
    let fetchedBans = await Bans.get('banlist');
    if (!fetchedBans) Bans.set('banlist', {});

    Bans.set(`banlist.${toBan.id}`, { user: toBan.id, expiration: Date.now() + (ms(params[2])) });
  }
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 2,
  cooldown: '6s',
  requireSpaces: false
}

exports.help = {
  name: 'ban',
  description: 'Banea a un usuario del servidor.',
  usage: 'ban <Mención | ID> <Razón> [Tiempo]',
  example: '-ban 441371076887445523 5 3d'
}
