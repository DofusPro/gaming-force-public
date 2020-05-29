const Discord = require('discord.js');
const Moment = require('moment');
const Fs = require('fs');
const Data = require('../functions.js');

exports.run = async (Client, message, params) => {

  let command = params[0];
  if (!command) {

    message.delete();
    let embed = Data.helpEmbed(message, this, Client);
    return message.channel.send(embed).then(msg => msg.delete(10000));
  }

  try {
    delete require.cache[require.resolve(`./${command}.js`)];
    Client.commands.delete(command);
    const props = require(`./${command}.js`);
    Client.commands.set(command, props);

    props.conf.aliases.forEach(alias => {

      Client.aliases.set(alias, props.help.name);

    });
  } catch (e) {

    let embed = Data.createEmbed(Data.colors.red, ':x: **Error:** Comando no existente o recargable.\n\n`' + e.code + '`');
    return message.channel.send(embed);
  };

  let sCommand = command.split('.')[0].charAt(0).toUpperCase() + command.split('.')[0].slice(1);

  message.delete();
  let sEmbed = Data.createEmbed(Data.colors.blue, '✅ ' + sCommand + ' ha sido recargado exitosamente.');
  message.channel.send(sEmbed).then((msg) => msg.delete(5000));

};

exports.conf = {
  enabled: true,
  aliases: ['recharge', 'refresh'],
  permLevel: 6,
  cooldown: '0s',
  requireSpaces: false
}

exports.help = {
  name: 'reload',
  description: 'Recarga un comando específico para que surgan cambios en él.',
  usage: 'reload <Comando>',
  example: '-reload Ban'
}
