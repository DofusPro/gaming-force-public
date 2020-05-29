const Discord = require('discord.js');
const Data = require('../functions.js');
const Ascii = require('ascii-art');

exports.run = async (Client, message, params) => {

  if (!params.join(' ')) {

    let embed = Data.helpEmbed(message, this, Client);
    return message.channel.send(embed);
  }

  let args = params.join(' ');

  Ascii.font(args, 'Doom', async function(rendered) {

    rendered = rendered.trimRight();
    if (rendered.length > 2000) {

      let embed = Data.createEmbed(Data.colors.red, '❌ Texto muy largo.');
      return message.channel.send(embed);
    };

    message.channel.send(rendered, {
      code: 'md'
    });

  });

}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['asciitext'],
  permLevel: 0,
  cooldown: '30s',
  requireSpaces: true
}

exports.help = {
  name: 'ascii',
  description: 'Convierte un texto a ascii.',
  usage: 'ascii <Texto>',
  example: '-ascii Hola Mundo!'
}
