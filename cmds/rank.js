const Discord = require('discord.js');
const DB = require('quick.db');
const Data = require('../functions.js');

exports.run = async (Client, message, params) => {

  let user = message.mentions.members.first() || message.guild.members.get(params[0]) || message.author;

  let userData = await DB.get(user.id);
  let userLevel = userData.leveling.level || 1;
  let userXP = userData.leveling.xp || 0;
  let nextXP = Math.floor(12 * (userLevel ^ 2) + 125 * userLevel + (175 * (userLevel ^ 2)));
  let embed = Data.createEmbed(Data.colors.green, 'Sistema de Experiencia de <@!' + user.id + '>\n\n💠 Nivel: ' + userLevel + '\n💠 Experiencia: ' + userXP.toLocaleString().replace(/\,/g, '.') + ' / ' + nextXP.toLocaleString().replace(/\,/g, '.'));
  return message.channel.send(embed);

}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['level'],
  permLevel: 0,
  cooldown: '20s',
  requireSpaces: false
}

exports.help = {
  name: 'rank',
  description: 'Muestra el Nivel y XP de un usuario.',
  usage: 'rank [Usuario]',
  example: '-rank @Discord#0001'
}