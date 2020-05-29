const Discord = require('discord.js');
const Data = require('../functions.js');

exports.run = async (Client, message, params) => {

  let kickUser = message.mentions.members.first() || message.guild.members.get(params[0]);
  if (!kickUser) {

    let embed = Data.helpEmbed(message, this, Client);
    return message.channel.send(embed);
  }

  let reason = params.slice(1)[0];
  if (!reason) {

    let embed = Data.helpEmbed(message, this, Client);
    return message.channel.send(embed);
  }

  let kickReason = Data.getReasons(reason);
  if (kickReason == 'Error') {

    let embed = Data.createEmbed(Data.colors.red, ':x: **Error**: Ese número de regla no existe.');
    return message.channel.send(embed);
  }

  let memberPerms = await Client.elevation(kickUser);
  if (memberPerms >= 1) {

    let embed = Data.createEmbed(Data.colors.red, '**Error**: No puedes expulsar a un miembro del personal.');
    return message.channel.send(embed);
  }

  let embed = Data.createEmbed(Data.colors.purple, '✅ ' + kickUser.user.tag + ' ha sido expulsado por:\n`' + kickReason.name + '`.');
  let sentMessage = await message.channel.send(embed);

  let userEmbed = Data.createEmbed(Data.colors.purple, '👢 Has sido expulsado de ' + message.guild.name + '\n**Razón**: ' + kickReason.name + '\n\n**Definición**: ' + kickReason.def);
  await kickUser.send(userEmbed).catch((error) => {

    embed.setFooter('El usuario no ha podido ser notificado.');
    sentMessage.edit(embed);
  });

  let currentTime = require('moment')().format('DD/MM/YYYY HH:mm');

  let logEmbed = new Discord.RichEmbed()
    .setColor(Data.colors.purple)
    .setTitle('👢 Kick | Gaming Force Moderation Service')
    .setThumbnail((kickUser.user.avatarURL || kickUser.user.defaultAvatarURL))
    .setDescription('**Usuario**: ' + kickUser.user.tag + ' | ' + kickUser.id + '\n**Moderador**: ' + message.author + '\n**Razón**: ' + kickReason.name + '\n**Hora**: ' + currentTime)
    .setTimestamp();
  message.guild.channels.get('529485500701212674').send(logEmbed);
  kickUser.kick('Expulsado por ' + kickReason.name + ' || Moderador: ' + message.author.username);

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
  name: 'kick',
  description: 'Kickea a un usuario del servidor.',
  usage: 'kick <Mención | ID> <Razón>',
  example: '-kick @Discord#0001 5'
}
