const Discord = require('discord.js');
const Data = require('../functions.js');

exports.run = async (Client, message, params) => {

  let question = params.join(' ');
  if (!question || !question.endsWith('?')) {

    let embed = Data.helpEmbed(message, this, Client);
    return message.channel.send(embed);
  }

  let answer = Data.chooseArray(['Claro!', 'Definitivamente.', 'Está decidido.', 'El destino dice que sí.', 'Puede ser.', '50% y 50%', 'Posiblemente sí, o no.', 'No está decidido.', 'No.', 'Un no rotundo!', 'El destino ha dicho que no.', 'Claro que no!']);
  let embed = Data.createEmbed(Data.colors.green, message.author + ', la respuesta a tu pregunta `' + question + '` es:\n**' + answer + '**');
  message.channel.send(embed);
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['8'],
  permLevel: 0,
  cooldown: '1s',
  requireSpaces: false
}

exports.help = {
  name: '8ball',
  description: 'Hazle una pregunta a la bola del 8.',
  usage: '8ball <Pregunta terminada en ?>',
  example: '-8ball El servidor seguirá creciendo?'
}