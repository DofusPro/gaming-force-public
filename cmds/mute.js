const Discord = require('discord.js');
const Data = require('../functions.js');
const DB = require('quick.db');
const Ms = require('ms');

exports.run = async (Client, message, params) => {

  let muteUser = message.mentions.members.first() || message.guild.members.get(params[0]);
  if (!muteUser) {

    let embed = Data.helpEmbed(message, this, Client);
    return message.channel.send(embed);
  }

  if (muteUser.user.id == message.author.id) {

    let embed = Data.helpEmbed(message, this, Client);
    return message.channel.send(embed);
  }

  if (Client.elevation(muteUser) >= 1) {

    let embed = Data.createEmbed(Data.colors.red, ':x: No puedes silenciar a un miembro del personal.');
    return message.channel.send(embed);
  }

  if (muteUser.user.bot == true) {

    let embed = Data.createEmbed(Data.colors.red, ':x: No puedes silenciar a un bot.');
    return message.channel.send(embed);    
  }

  let muteReason = Data.getReasons(params[1]);
  if (!muteReason || muteReason == 'Error') {

    let embed = Data.helpEmbed(message, this, Client);
    return message.channel.send(embed);
  }

  let muteTime = params[2];
  if (!muteTime) {

    let embed = Data.helpEmbed(message, this, Client);
    return message.channel.send(embed);
  }

  if ((!parseInt(muteTime) || !['m', 'h', 'd', 'w'].some((i) => muteTime.endsWith(i))) && !muteTime.startsWith('0')) {

    let errEmbed = Data.createEmbed(Data.colors.red, '❌ Inserta un tiempo válido.\nOpciones: Xm (X minutos), Xh (X horas), Xd (X días), Xw (X semanas).');
    return message.channel.send(errEmbed);
  }

  let muteRole = message.guild.roles.find((role) => role.name == '⛔ | Server Muted');
  if (!muteRole) {

    muteRole = await message.guild.createRole({
      name: '⛔ | Server Muted',
      color: Data.colors.red,
      permissions: []
    });

    message.guild.channels.forEach(async (channel) => {

      await channel.overwritePermissions(muteRole, {
        SEND_MESSAGES: false,
        ADD_REACTIONS: false,
        SPEAK: false
      });

    });
  }

  if (muteUser.roles.has(muteRole.id)) {

    let embed = Data.createEmbed(Data.colors.red, ':x: Ese miembro ya está silenciado.');
    return message.channel.send(embed);
  }

  await muteUser.addRole('512788018575310849');

  let embed = Data.createEmbed(Data.colors.orange, '✅ ' + muteUser.user.tag + ' ha sido silenciado por:\n`' + muteReason.name + '`.');
  let sentMessage = await message.channel.send(embed);

  let Mutes = new DB.table('mutes');
  let fetchedMutes = await Mutes.get('mutelist');

  Mutes.set(`mutelist.${muteUser.id}`, { user: muteUser.id, expiration: Date.now() + (Ms(muteTime)) });

  let sendEmbed = Data.createMediumEmbed(Data.colors.orange, '🔇 Has sido silenciado de ' + message.guild.name + '\n**Razón**: ' + muteReason.name + '\n\n**Definición**: ' + muteReason.def, 'Silenciado durante ' + muteTime);
  await muteUser.send(sendEmbed).catch((error) => {

    embed.setFooter('El usuario no pudo ser notificado.');
    sentMessage.edit(embed);
  });

  let currentTime = require('moment')().format('DD/MM/YYYY HH:mm');

  let logEmbed = new Discord.RichEmbed()
    .setColor(Data.colors.orange)
    .setTitle('🔇 Mute | Gaming Force Moderation Service')
    .setThumbnail((muteUser.user.avatarURL || muteUser.user.defaultAvatarURL))
    .setDescription('**Usuario**: ' + muteUser.user.tag + ' | ' + muteUser.id + '\n**Moderador**: ' + message.author + '\n**Razón**: ' + muteReason.name + '\n**Tiempo**: ' + muteTime + '\n**Hora**: ' + currentTime)
    .setTimestamp();
  Client.channels.get('529485500701212674').send(logEmbed);
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['tempmute'],
  permLevel: 2,
  cooldown: '3s',
  requireSpaces: false
}

exports.help = {
  name: 'mute',
  description: 'Silencia a un usuario del servidor para que no escriba o hable.',
  usage: 'mute <Mención | ID> <Razón = 1 - 10> <Tiempo>',
  example: '-mute @Discord#0001 5 30m'
}
