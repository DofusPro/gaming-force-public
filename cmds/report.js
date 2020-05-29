const Discord = require('discord.js');
const Moment = require('moment');
const Data = require('../functions.js');

exports.run = async (Client, message, params) => {

  message.delete();
  let rUser = message.mentions.members.first() || message.guild.members.get(params[0]);
  if (!rUser) {

    let embed = Data.helpEmbed(message, this, Client);
    return message.channel.send(embed);
  }

  let reason = params.slice(1).join(' ');
  if (!reason) {

    let embed = Data.helpEmbed(message, this, Client);
    return message.channel.send(embed);
  }

  let ReportEmbed = new Discord.RichEmbed()
    .setColor(Data.colors.red)
    .setAuthor(message.author.username, (message.author.avatarURL || message.author.defaultAvatarURL))
    .setThumbnail((rUser.user.avatarURL || rUser.user.defaultAvatarURL))
    .setDescription('Ha llegado un nuevo reporte!')
    .addField('Usuario Reportado', '**Nombre**: ' + rUser.user.username + '\n**ID**: ' + rUser.user.id + '\n**Avatar**: [Link](' + (rUser.user.avatarURL || rUser.user.defaultAvatarURL) + ')')
    .addField('Usuario/Moderador', '**Nombre**: ' + message.author.username + '\n**ID**: ' + message.author.id + '\n**Avatar**: [Link](' + (message.author.avatarURL || message.author.defaultAvatarURL) + ')')
    .addField('Información Del Reporte', '**Razón**: ' + reason + '\n**Fecha**: ' + (Moment().format('DD/MM/YYYY HH:mm:ss')))
  Client.channels.get('529485500701212674').send(ReportEmbed);

  let embed = Data.createEmbed(Data.colors.blue, 'Tu reporte ha sido enviado al personal!');
  message.channel.send(embed).then((msg) => msg.delete(3000));
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['userreport', 'reportabuse'],
  permLevel: 0,
  cooldown: '1s',
  requireSpaces: false
}

exports.help = {
  name: 'report',
  description: 'Reporta a un usuario por una razón válida.',
  usage: 'report <Mención | ID> <Razón>',
  example: '-report @Discord#0001 Insulto a miembros.'
}
