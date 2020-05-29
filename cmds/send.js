const Discord = require('discord.js');
const Data = require('../functions.js');

exports.run = async (Client, message, params) => {

  let userID = params[0];
  if (!userID) {
  
    let embed = Data.helpEmbed(message, this, Client);
    return message.channel.send(embed);
  }
  
  if (!message.guild.members.get(userID)) {
  
    let embed = Data.helpEmbed(message, this, Client);
    return message.channel.send(embed);
  }
  
  let msg = params.slice(1).join(' ');
  if (!msg) {
  
    let embed = Data.helpEmbed(message, this, Client);
    return message.channel.send(embed);
  }

  let member = message.guild.members.get(userID);
  
  let embed = Data.createEmbed(Data.colors.green, ':white_check_mark: Se le ha enviado a ' + member.user.username + ' (' + member.id + ') el siguiente mensaje:\n\n' + msg);
  let sentMessage = await message.channel.send(embed);
  member.send(msg).catch((error) => {

    embed.setColor(Data.colors.red);
    embed.setDescription('No se le ha podido enviar el mensaje.');
    sentMessage.edit(embed);
  });
  
}

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: 2,
  cooldown: '3s',
  requireSpaces: true
}

exports.help = {
  name: 'send',
  description: 'Envía un mensaje a alguien por privado.',
  usage: 'send <ID> <Mensaje>',
  example: '-send 274750397607051268 Hola!'
}
