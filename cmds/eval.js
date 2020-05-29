const Discord = require('discord.js');
const Data = require('../functions.js');

exports.run = async (Client, message, params) => {

  let toEval = params.join(' ');
  if (!toEval) {

    let embed = Data.helpEmbed(message, this, Client);
    return message.channel.send(embed);
  }

  try {

    let evaled = eval(toEval);
    let utilEvaled = require('util').inspect(evaled);

    if (utilEvaled.length > 1870) {

      let EvalEmbed = new Discord.RichEmbed()
        .setColor(Data.colors.green)
        .setDescription('**__💻 Evaluado__**\n```js\n' + toEval + '\n```\n\n**__📥 Salida__**\n```md\n' + 'Error: Content too long.' + '\n```\n\n**__📜 Tipo__**\n```js\n' + typeof(evaled) + ' - ' + Data.typeOf(evaled) + '\n```')
        .setFooter(message.guild.name, message.guild.iconURL);
      return message.channel.send(EvalEmbed);
    } else {

      let EvalEmbed = new Discord.RichEmbed()
        .setColor(Data.colors.green)
        .setDescription('**__💻 Evaluado__**\n```js\n' + toEval + '\n```\n\n**__📥 Salida__**\n```js\n' + clean(utilEvaled) + '\n```\n\n**__📜 Tipo__**\n```js\n' + typeof(evaled) + ' - ' + Data.typeOf(evaled) + '\n```')
        .setFooter(message.guild.name, message.guild.iconURL);
      return message.channel.send(EvalEmbed);
    }

  } catch (error) {

    let cleanError = require('util').inspect(error);

    let EvalEmbed = new Discord.RichEmbed()
      .setColor(Data.colors.green)
      .setDescription('**__💻 Evaluado__**\n```js\n' + toEval + '\n```\n\n**__📥 Salida__**\n```js\n' + clean(cleanError) + '\n```\n\n**__📜 Tipo__**\n```js\n' + typeof(error) + ' - ' + Data.typeOf(error) + '\n```')
      .setFooter(message.guild.name, message.guild.iconURL);
    return message.channel.send(EvalEmbed);
  }

}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['e'],
  permLevel: 6,
  cooldown: '0s',
  requireSpaces: false
}

exports.help = {
  name: 'eval',
  description: 'Evalúa un código JavaScript en vivo.',
  usage: 'eval <Código>',
  example: '-eval Client.ping'
}

function clean(text) {
  if (typeof(text) === 'string')
    return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
  else
    return text;
}