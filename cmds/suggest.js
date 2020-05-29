const Discord = require('discord.js');
const DB = require('quick.db');
const Data = require('../functions.js');

exports.run = async (Client, message, params) => {

  let Suggestion = params.join(' ');
  if (!Suggestion) {

    let embed = Data.helpEmbed(message, this, Client);
    return message.channel.send(embed);
  }

  let suggestionKey = Data.createKey(6);

  let SuggestionEmbed = new Discord.RichEmbed()
    .setColor(Data.colors.green)
    .setAuthor(message.author.username, (message.author.avatarURL || message.author.defaultAvatarURL))
    .setTitle('Nueva Sugerencia')
    .setDescription(Suggestion)
    .setFooter('Sugerencia ' + suggestionKey + ' emitida.')
    .setTimestamp();
  if (message.attachments.first() && (message.attachments.first().filename.endsWith('png') || message.attachments.first().filename.endsWith('jpg') || message.attachments.first().filename.endsWith('jpeg')))
    SuggestionEmbed.setImage(message.attachments.first().url)
  let sentMessage = await Client.channels.get('417182323386351620').send(SuggestionEmbed);

  await sentMessage.react('✅');
  await sentMessage.react('❌');

  let embed = Data.createEmbed(Data.colors.blue, '✅ Se ha enviado tu sugerencia, puedes revisarla en <#417182323386351620>.');
  message.channel.send(embed);

  let Suggestions = new DB.table('suggestions');
  Suggestions.set(suggestionKey, { message: sentMessage.id });
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0,
  cooldown: '5s',
  requireSpaces: true
}

exports.help = {
  name: 'suggest',
  description: 'Envía una sugerencia y se hace una votación respecto a ésta.',
  usage: 'suggest <Sugerencia>',
  example: '-suggest Añadir nuevos canales.'
}
