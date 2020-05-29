const Discord = require('discord.js');
const Data = require('../functions.js');

exports.run = async (Client, message, params) => {

  let channelTo = message.mentions.channels.first() || message.guild.channels.get(params[0]);
  if (!channelTo) {

    let embed = Data.helpEmbed(message, this, Client);
    return message.channel.send(embed);
  }

  let messageTo = params.slice(1).join(' ');
  if (!messageTo) {

    let embed = Data.helpEmbed(message, this, Client);
    return message.channel.send(embed);
  }

  channelTo.send(messageTo);
  let embed = Data.createEmbed(Data.colors.green, '✅ Tu mensaje ha sido enviado al canal.');
  message.channel.send(embed).then((msg) => msg.delete(6000));

}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 3,
  cooldown: '5s',
  requireSpaces: true
}

exports.help = {
  name: 'say',
  description: 'Hace que el bot diga algo específico en un canal.',
  usage: 'say <Mención de Canal | ID> <Mensaje>',
  example: '-say #general Hola Mundo!'
}
