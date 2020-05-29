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

  if (!authorClan || authorClan !== '🔥 Fuego 🔥') {

    let embed = Data.createEmbed(Data.colors.red, ':x: No tienes clan, o no eres del Clan Fuego.');
    return message.channel.send(embed);
  }

  if (Data.clanInmunity('🔥 Fuego 🔥', tUser)) {

    let embed = Data.createEmbed(Data.colors.red, ':x: Ese usuario es inmune a quemar.');
    return message.channel.send(embed);
  }

  if (MuteList[tUser.id]) {

    let embed = Data.createEmbed(Data.colors.red, ':x: Ese usuario está silenciado.');
    return message.channel.send(embed);
  }

  let nEmbed = new Discord.RichEmbed()
    .setDescription('🔥 | ' + tUser + ' ha sido quemado por 30 segundos.')
    .setImage('https://cdn.discordapp.com/attachments/508672706196275231/581718177852030997/Fuego_GF.gif')
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
  name: 'quemar',
  description: 'Quema a un usuario (30 Segundos).',
  usage: 'quemar <Mención>',
  example: '-quemar @Discord#0001'
}