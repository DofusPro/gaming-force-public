const Discord = require('discord.js');
const Data = require('../functions.js');

String.prototype.fixString = function() {
  let fString = this;
  let fixedString = fString[0].toUpperCase() + fString.slice(1).toLowerCase();
  return fixedString;
}

exports.run = async (Client, message, params) => {

  let colorGet = params[0];
  if (!colorGet) {

    let embed = Data.helpEmbed(message, this, Client);
    return message.channel.send(embed);
  }

  let colorName = '[🌀] ' + colorGet.fixString();
  let colorRole = message.guild.roles.find((rol) => rol.name == colorName);
  if (!colorRole) {

    let embed = Data.createEmbed(Data.colors.red, ':x: Ese color no está listado.');
    return message.channel.send(embed).then((msg) => msg.delete(4000));
  }

  if (message.member.roles.has(colorRole.id)) {

    message.member.removeRole(colorRole);
    let embed = Data.createEmbed(Data.colors.orange, '✅ Te has quitado el color ' + colorGet.fixString() + '.');
    return message.channel.send(embed);
  } else {

    let allColorRoles = message.guild.roles.filter((role) => role.name.startsWith('[🌀] '));
    await message.member.removeRoles(allColorRoles);

    await message.member.addRole(colorRole);
    let embed = Data.createEmbed(Data.colors.blue, '✅ Te has añadido el color ' + colorGet.fixString() + '.\n**Si ya tenías otro color, se te ha quitado.**');
    return message.channel.send(embed);
  }

}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['colors', 'getcolor', 'getcolors'],
  permLevel: 0,
  cooldown: '5s',
  requireSpaces: false
}

exports.help = {
  name: 'color',
  description: 'Te da un color que esté en el servidor.',
  usage: 'color <Color>',
  example: '-color Azul'
}
