const Discord = require('discord.js');
const DB = require('quick.db');
const Data = require('../functions.js');

const Suggestions = new DB.table('suggestions');

String.prototype.fixString = function() {
  let fString = this;
  let fixedString = fString[0].toUpperCase() + fString.slice(1).toLowerCase();
  return fixedString;
}

exports.run = async (Client, message, params) => {

  let configManager = params[0];
  if (!configManager || (configManager.toLowerCase() !== 'aprobar' && configManager.toLowerCase() !== 'denegar' && configManager.toLowerCase() !== 'potencial')) {

    let embed = Data.helpEmbed(message, this, Client);
    return message.channel.send(embed);
  }

  let suggestionKey = params[1];
  let foundSuggestion = await Suggestions.get(suggestionKey);
  if (!suggestionKey || !foundSuggestion) {

    let embed = Data.helpEmbed(message, this, Client);
    return message.channel.send(embed);
  }

  let reason = params.slice(2).join(' ');
  if (!reason) {

    let embed = Data.helpEmbed(message, this, Client);
    return message.channel.send(embed);
  }

  let getterSuggestion = await Suggestions.get(suggestionKey);
  let fetchedMessage = await message.guild.channels.get('417182323386351620').fetchMessage(getterSuggestion.message);

  if (configManager.toLowerCase() == 'aprobar') {
    color = '#3498db';
    status = 'Aprobada';
  } else if (configManager.toLowerCase() == 'denegar') {
    color = '#e74c3c';
    status = 'Denegada';
  } else {
    color = '#f1c40f';
    status = 'Potencial';
  }

  let newEmbed = new Discord.RichEmbed(fetchedMessage.embeds[0])
    .setColor(color)
    .setTitle('Sugerencia ' + status)
    .addField('Razón', reason)
  fetchedMessage.edit(newEmbed);

  await Suggestions.delete(suggestionKey);

  let embed = Data.createEmbed(Data.colors.blue, '✅ La sugerencia ha sido marcada como `' + status + '`.');
  message.channel.send(embed);
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 4,
  cooldown: '1s',
  requireSpaces: false
}

exports.help = {
  name: 'suggestion',
  description: 'Marca aprobado, denegado o potencial en una sugerencia.',
  usage: 'suggestion <aprobar | denegar | potencial> <key> <Razón>',
  example: '-suggestion aprobar IMSBRN Es una buena sugerencia, la añadiremos más adelante.'
}
