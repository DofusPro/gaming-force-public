const Discord = require('discord.js');
const Data = require('../functions.js');
const DB = require('quick.db');

exports.run = async (Client, message, params) => {
  
  const Mutes = new DB.table('mutes');
  const Mutelist = Mutes.get('mutelist');

  let mUser = message.mentions.members.first() || message.guild.members.get(params[0]);
  if (!mUser) {

    let embed = Data.helpEmbed(message, this, Client);
    return message.channel.send(embed);
  }
  
  console.log(Mutelist)

  if (!Mutelist[mUser.id]) {

    let embed = Data.createEmbed(Data.colors.red, ':x: **Error**: El usuario no está muteado.');
    return message.channel.send(embed);
  }

  let embed = Data.createEmbed(Data.colors.blue, '✅ ' + mUser.user.tag + ' ha sido desilenciado.');
  let sentMessage= await message.channel.send(embed);

  let userEmbed = Data.createEmbed(Data.colors.green, '🔊 Has sido desilenciado de ' + message.guild.name);
  mUser.send(userEmbed).catch((error) => {

    embed.setFooter('El usuario no pudo ser notificado.');
    sentMessage.edit(embed);
  });

  Mutes.delete('mutelist.' + mUser.id);
  let currentTime = require('moment')().format('DD/MM/YYYY HH:mm');

  await mUser.removeRole('512788018575310849');
  let logEmbed = new Discord.RichEmbed()
    .setColor(Data.colors.blue)
    .setTitle('🔊 Unmute | Gaming Force Moderation Service')
    .setThumbnail((mUser.user.avatarURL || mUser.user.defaultAvatarURL))
    .setDescription('**Usuario**: ' + mUser.user.tag + ' | ' + mUser.id + '\n**Moderador**: ' + message.author + '\n**Hora**: ' + currentTime)
    .setTimestamp();
  Client.channels.get('529485500701212674').send(logEmbed);
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 2,
  cooldown: '5s',
  requireSpaces: false
}

exports.help = {
  name: 'unmute',
  description: 'Desmutea a un usuario para que vuelva a escribir y hablar.',
  usage: 'unmute <Mención | ID>',
  example: '-unmute @Discord#0001 Persona equivocada.'
}
