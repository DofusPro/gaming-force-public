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

  if (!authorClan || authorClan !== '⚡ Electricidad ⚡') {

    let embed = Data.createEmbed(Data.colors.red, ':x: No tienes clan, o no eres del Clan Electricidad.');
    return message.channel.send(embed);
  }

  if (Data.clanInmunity('⚡ Electricidad ⚡', tUser)) {

    let embed = Data.createEmbed(Data.colors.red, ':x: Ese usuario es inmune a electrocutar.');
    return message.channel.send(embed);
  }

  if (MuteList[tUser.id]) {

    let embed = Data.createEmbed(Data.colors.red, ':x: Ese usuario está silenciado.');
    return message.channel.send(embed);
  }

  let nEmbed = new Discord.RichEmbed()
    .setDescription('⚡ | ' + tUser + ' ha sido electrocutado por 30 segundos.')
    .setImage('https://cdn.discordapp.com/attachments/508672706196275231/581718570463920128/Electricidad_GF.gif')
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
  name: 'electrocutar',
  description: 'Electrocuta a un usuario (30 Segundos).',
  usage: 'electrocutar <Mención>',
  example: '-electrocutar @Discord#0001'
}