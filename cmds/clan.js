String.prototype.fixString = function() {
  let fString = this;
  let fixedString = fString[0].toUpperCase() + fString.slice(1).toLowerCase();
  return fixedString;
}

const Discord = require('discord.js');
const DB = require('quick.db');
const Data = require('../functions.js');

exports.run = async (Client, message, params) => {

  let sClan = params[0];
  if (!sClan || (sClan.toLowerCase() !== 'fuego' && sClan.toLowerCase() !== 'hielo' && sClan.toLowerCase() !== 'aire' && sClan.toLowerCase() !== 'electricidad')) {

    let embed = Data.helpEmbed(message, this, Client);
    return message.channel.send(embed);
  }

  let clans = {'Fuego': '🔥 Fuego 🔥', 'Hielo': '❄ Hielo ❄', 'Electricidad': '⚡ Electricidad ⚡', 'Aire': '🌪 Aire 🌪'};
  let cRole = message.guild.roles.find((i) => i.name == clans[sClan.fixString()]);

  let fetchedUser = await DB.get(`${message.author.id}`);
  if (!fetchedUser) DB.set(`${message.author.id}`, {});

  if (!fetchedUser.clan) {

    await message.member.addRole(cRole);
    fetchedUser.clan = clans[sClan.fixString()];
    DB.set(`${message.author.id}`, fetchedUser);

    let embed = Data.createEmbed(Data.colors.green, '✅ Te has unido al clan ' + sClan.fixString() + '.');
    return message.channel.send(embed);
  } else if (fetchedUser.clan && fetchedUser.leveling.level >= 10) {

    if (fetchedUser.clan == clans[sClan.fixString()]) {

      let embed = Data.createEmbed(Data.colors.red, '⚠ Ya estás en ese clan.');
      return message.channel.send(embed);
    }

    await message.member.removeRoles(['476063386111705088', '476063377370906644', '521105855542984705', '521105863482802221']);
    await message.member.addRole(cRole);
    fetchedUser.clan = clans[sClan.fixString()];
    fetchedUser.leveling.level -= 10;
    if (fetchedUser.leveling.level == 0) fetchedUser.leveling.level = 1;
    fetchedUser.leveling.xp = 0;
    DB.set(`${message.author.id}`, fetchedUser);

    let embed = Data.createEmbed(Data.colors.green, '✅ Te has cambiado al clan ' + sClan + ' a cambio de 10 niveles.');
    return message.channel.send(embed);
  } else {

    let embed = Data.createEmbed(Data.colors.yellow, '⚠ No tienes suficientes niveles para cambiar de clan.\nNecesitas tener 10 niveles mínimo para poder cambiarte de clan.');
    return message.channel.send(embed);
  }

}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0,
  cooldown: '3s',
  requireSpaces: false
}

exports.help = {
  name: 'clan',
  description: 'Entra a un clan de Gaming Force.',
  usage: 'clan <Fuego | Hielo | Electricidad | Aire>',
  example: '-clan Fuego'
}