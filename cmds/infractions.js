const Discord = require('discord.js');
const DB = require('quick.db');
const Data = require('../functions.js');

const Warnings = new DB.table('warnings');

exports.run = async (Client, message, params) => {

  let mUser = message.mentions.members.first() || message.guild.members.get(params[0]);
  if (!mUser) {

    let embed = Data.helpEmbed(message, this, Client);
    return message.channel.send(embed);
  }

  let fetchedWarns = Warnings.get(mUser.id);
  if (!fetchedWarns) {

    let embed = Data.createEmbed(Data.colors.green, '💾 El usuario no tiene infracciones.');
    return message.channel.send(embed);
  } else {

    let userWarnings = '\n---------\n';
    for (let warn in fetchedWarns) {

      warn = Warnings.get(mUser.id + '.' + warn);
      userWarnings += warn.key + '\n\nRazón: ' + warn.reason + '\nModerador: ' + warn.moderator + '\nFecha: ' + warn.time + '\n---------\n';
      continue;
    }

    let embed = Data.createMediumEmbed(Data.colors.orange, '```\n' + userWarnings + '\n```', 'Infracciones de ' + mUser.user.tag);
    return message.channel.send(embed);
  }
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['infr'],
  permLevel: 2,
  cooldown: '5s',
  requireSpaces: false
}

exports.help = {
  name: 'infractions',
  description: 'Revisa las infracciones de un miembro específico.',
  usage: 'infractions <Mención | ID>',
  example: '-infractions @Discord#0001'
}
