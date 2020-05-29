const Discord = require('discord.js');
const DB = require('quick.db');
const Moment = require('moment');
const Data = require('../functions.js');

const Warnings = new DB.table('warnings');

exports.run = async (Client, message, params) => {

  let warnUser = message.mentions.members.first() || message.guild.members.get(params[0]);
  if (!warnUser || warnUser.bot == true) {

    let embed = Data.helpEmbed(message, this, Client);
    return message.channel.send(embed);
  }

  let warnReason = Data.getReasons(params.slice(1)[0]);
  if (!warnReason || warnReason == 'Error') {

    let embed = Data.helpEmbed(message, this, Client);
    return message.channel.send(embed);
  }

  let warnKey = Data.createKey(5);
  let TimeNow = Moment().format('DD/MM/YYYY HH:mm');

  Warnings.set(`${warnUser.id}.` + warnKey, { key: warnKey, reason: warnReason.name, moderator: (message.author.tag + ' | ' + message.author.id), time: TimeNow });

  let logEmbed = new Discord.RichEmbed()
    .setColor(Data.colors.yellow)
    .setTitle('⚒ Warn | Gaming Force Moderation Service')
    .setThumbnail((warnUser.user.avatarURL || warnUser.user.defaultAvatarURL))
    .setDescription('**Usuario**: ' + warnUser.user.tag + ' | ' + warnUser.id + '\n**Moderador**: ' + message.author + '\n**Razón**: ' + warnReason.name + '\n**Hora**: ' + TimeNow)
    .setTimestamp();
  Client.channels.get('529485500701212674').send(logEmbed);

  let embed = Data.createEmbed(Data.colors.yellow, '✅ ' + warnUser.user.tag + ' ha sido advertido por:\n `' + warnReason.name + '`.');
  let sentMessage = await message.channel.send(embed);

  let userEmbed = Data.createMediumEmbed(Data.colors.yellow, '⚠ Has sido advertido en ' + message.guild.name + '\n**Razón**: ' + warnReason.name + '\n\n**Definición**: ' + warnReason.def, 'Advertencia ' + warnKey);
  warnUser.send(userEmbed).catch((error) => {

    embed.setFooter('El usuario no pudo ser notificado.');
    sentMessage.edit(embed);
  });

}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['infract'],
  permLevel: 2,
  cooldown: '3s',
  requireSpaces: false
}

exports.help = {
  name: 'warn',
  description: 'Advierte a un usuario por una razón específica.',
  usage: 'warn <Mención | ID> <Razón = 1-10>',
  example: '-warn @Discord#0001 4'
}