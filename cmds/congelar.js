const Discord = require('discord.js');
const DB = require('quick.db');
const Data = require('../functions.js');

exports.run = async (Client, message, params) => {
  
  const Mutes = new DB.table('mutes');
  const MuteList = Mutes.get('mutelist');
  
  if (!MuteList) MuteList = Mutes.set('mutelist', {});

  let tUser = message.mentions.members.first();
  if (!tUser || tUser.id == message.author.id || tUser.user.bot) {

    let embed = Data.helpEmbed(message, this, Client);
    return message.channel.send(embed);
  }

  let authorClan = Data.getUserClan(message.author);

  if (!authorClan || authorClan !== '❄ Hielo ❄') {

    let embed = Data.createEmbed(Data.colors.red, ':x: No tienes clan, o no eres del Clan Hielo.');
    return message.channel.send(embed);
  }

  if (Data.clanInmunity('❄ Hielo ❄', tUser)) {

    let embed = Data.createEmbed(Data.colors.red, ':x: Ese usuario es inmune a congelar.');
    return message.channel.send(embed);
  }

  if (MuteList[tUser.id]) {

    let embed = Data.createEmbed(Data.colors.red, ':x: Ese usuario está silenciado.');
    return message.channel.send(embed);
  }

  let nEmbed = new Discord.RichEmbed()
    .setDescription('❄ | ' + tUser + ' ha sido congelado por 30 segundos.')
    .setImage('https://cdn.discordapp.com/attachments/516024968195211265/521043762957254660/Congelar.gif')
    .setColor(Data.colors.red)
  message.channel.send(nEmbed);

  Data.clanMute(tUser);
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0,
  cooldown: '40s',
  requireSpaces: false
}

exports.help = {
  name: 'congelar',
  description: 'Congela a un usuario (30 Segundos).',
  usage: 'congelar <Mención>',
  example: '-congelar @Discord#0001'
}