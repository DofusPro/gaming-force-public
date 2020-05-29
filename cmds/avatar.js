const Discord = require('discord.js');
const Data = require('../functions.js');

exports.run = async (Client, message, params) => {

  let user = message.mentions.members.first() || message.guild.members.get(params[0]) || message.member;
  let image = !(user.user.avatarURL || user.user.defaultAvatarURL).endsWith('?size=2048') ? (user.user.avatarURL + '?size=2048' || user.user.defaultAvatarURL + '?size=2048') : (user.user.avatarURL || user.user.defaultAvatarURL);
  let sendEmbed = new Discord.RichEmbed()
    .setColor(Data.colors.blue)
    .setImage(image)
    .setFooter('Avatar de ' + user.user.tag + ' pedido por ' + message.author.tag)
    .setTimestamp();
  return message.channel.send(sendEmbed);
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['av'],
  permLevel: 0,
  cooldown: '5s',
  requireSpaces: false
}

exports.help = {
  name: 'avatar',
  description: 'Muestra el avatar de un usuario.',
  usage: 'avatar [Usuario]',
  example: '-avatar @Discord#0001'
}
