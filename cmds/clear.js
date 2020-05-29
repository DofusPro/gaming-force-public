const Discord = require('discord.js');
const Data = require('../functions.js');

exports.run = async (Client, message, params) => {

  let connManager = params[0];
  if (!connManager) {

    let embed = Data.helpEmbed(message, this, Client);
    return message.channel.send(embed);
  }

  if (connManager !== 'after' && isNaN(params[0])) {
    
    let embed = Data.helpEmbed(message, this, Client);
    return message.channel.send(embed); 
  }

  if (connManager.toLowerCase() == 'after') {

    let messageID = params[1];
    if (!messageID) {

      let embed = Data.helpEmbed(message, this, Client);
      return message.channel.send(embed);
    }

    if (isNaN(messageID)) {

      let embed = Data.helpEmbed(message, this, Client);
      return message.channel.send(embed);
    }

    let fetchedMessage = await message.channel.fetchMessage(messageID);
    if (!fetchedMessage) {

      let embed = Data.helpEmbed(message, this, Client);
      return message.channel.send(embed);
    }

    let messageCollection = await message.channel.fetchMessages({ after: messageID, limit: 100 });
    message.channel.bulkDelete(messageCollection).then((messages) => {

      let embed = Data.createEmbed(Data.colors.green, '✅ `' + messages.size + '` mensajes borrados, que venían después del mensaje `' + messageID + '`.');
      message.channel.send(embed).then((dt) => { dt.delete(5000) });
    }).catch((error) => {

      let embed = Data.createEmbed(Data.colors.red, '⚠ Hubo un error eliminando un(os) mensaje(s), puede que hayan sido mensajes con más de 2 semanas desde su envío, o que sean más de 100 mensajes (o menos de 2).');
      message.channel.send(embed);
    });
  } else {

    if (params[0] > 100 || params[0] < 2) {

      let embed = Data.createEmbed(Data.colors.red, '⚠ Discord API sólo puede borrar mínimo 2 mensajes y máximo 100.');
      return message.channel.send(embed);
    }

    message.channel.bulkDelete(params[0]).then((messages) => {

      let embed = Data.createEmbed(Data.colors.green, '✅ `' + messages.size + '` mensajes borrados.');
      message.channel.send(embed).then((dt) => { dt.delete(5000) });
    }).catch((error) => {

      let embed = Data.createEmbed(Data.colors.red, '⚠ Hubo un error eliminando un(os) mensaje(s), puede que hayan sido mensajes con más de 2 semanas desde su envío.');
      message.channel.send(embed);
    });
  }

}

exports.conf = {
  enabled: true,
  aliases: ['purge'],
  permLevel: 3,
  cooldown: '10s',
  requireSpaces: false
}

exports.help = {
  name: 'clear',
  description: 'Limpia la cantidad de mensajes escrita (2 a 100) o después de un mensaje específico.',
  usage: 'clear <Cantidad | after> [ID del Mensaje]',
  example: '-clear after 586752052970127384'
}
