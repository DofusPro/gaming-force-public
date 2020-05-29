const Discord = require('discord.js');
const DB = require('quick.db');
const Data = require('../functions.js');

const Warnings = new DB.table('warnings');

exports.run = async (Client, message, params) => {

  let mUser = message.mentions.members.first() || message.guild.members.get(params[0]);
  if (!mUser) {

    let embed = Data.helpEmbed(message, this, Client);
    return message.channel.send(embed);
  }

  let fetchedWarns = Warnings.get(mUser.id);
  if (!fetchedWarns) {

    let embed = Data.createEmbed(Data.colors.green, '💾 El usuario no tiene infracciones.');
    return message.channel.send(embed);
  } else {

    let warnKey = params[1];
    if (!warnKey) {

      let embed = Data.helpEmbed(message, this, Client);
      return message.channel.send(embed);
    }

    let gotWarn = fetchedWarns[warnKey];
    if (!gotWarn) {

      let embed = Data.createEmbed(Data.colors.red, '💾 El usuario no tiene una advertencia con ID `' + warnKey + '`.');
      return message.channel.send(embed);
    }

    let warnBoolean = Warnings.delete(mUser.id + '.' + warnKey);
    if (warnBoolean == false) {

      let embed = Data.createEmbed(Data.colors.red, '❌ Hubo un error al remover esa advertencia.');
      return message.channel.send(embed);
    }

    let newFetched = Warnings.get(mUser.id);
    let allWarns = Object.keys(newFetched).length;
    if (allWarns == 0) Warnings.delete(mUser.id);

    let embed = Data.createEmbed(Data.colors.green, '💾 La advertencia `' + warnKey + '` de <@!' + mUser.id + '> ha sido removida.');
    let sentMessage = await message.channel.send(embed);

    let userEmbed = Data.createEmbed(Data.colors.blue, '💾 Tu advertencia `' + warnKey + '` ha sido removida por el personal.');
    mUser.send(userEmbed).catch((error) => {

      embed.setFooter('El usuario no pudo ser notificado.');
      sentMessage.edit(embed);
    });
  }
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['removeinfraction'],
  permLevel: 2,
  cooldown: '5s',
  requireSpaces: false
}

exports.help = {
  name: 'removewarn',
  description: 'Remueve una advertencia específica de un usuario.',
  usage: 'removewarn <Mención | ID> <ID de la advertencia>',
  example: '-removewarn @Discord#0001'
}
