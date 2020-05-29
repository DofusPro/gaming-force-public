const Discord = require('discord.js');
const Data = require('../functions.js');

exports.run = async (Client, message, params) => {

  let options = message.content.split(' ').slice(1).join(' ').split(',').map((i) => i.trim());
  if (!options || options.length < 2) {

    let embed = Data.helpEmbed(message, this, Client);
    return message.channel.send(embed);
  }

  let chosen = Data.chooseArray(options);
  let embed = Data.createEmbed(Data.colors.green, message.author + ', Yo elijo: `' + chosen + '`.');
  message.channel.send(embed);
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['choose'],
  permLevel: 0,
  cooldown: '1s',
  requireSpaces: false
}

exports.help = {
  name: 'pick',
  description: 'Elije una de las opciones escritas, separadas por comas.',
  usage: 'pick <Opción 1, Opción 2...>',
  example: '-pick Matar a Bisho, Matar a Gaming Force'
}