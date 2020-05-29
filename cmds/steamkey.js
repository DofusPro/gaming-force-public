const Discord = require('discord.js');
const Data = require('../functions.js');
const DB = require('quick.db');

exports.run = async (Client, message, params) => {

  let fetched = await DB.fetch('steamkeys');
  if (!fetched) DB.set('steamkeys', []);

  let typeo = params[0];
  if (!typeo || isNaN(typeo) || Number(typeo) > 25 || Number(typeo) < 1) {

  let embed = Data.helpEmbed(message, this, Client);
  return message.channel.send(embed);
  }

  let SteamKey = Data.createSteamKey(typeo);
  let embed = Data.createMediumEmbed(Data.colors.aqua, ':white_check_mark: Se ha(n) generado una(s) key(s) de Steam:\n\n' + SteamKey, message.guild.name);
  message.channel.send(embed);
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['sk'],
  permLevel: 0,
  cooldown: '5s',
  requireSpaces: false
}

exports.help = {
  name: 'steamkey',
  description: 'Genera una o varias keys de steam aleatoriamente.',
  usage: 'steamkey <Cantidad = Mínimo 1 | Máximo 25>',
  example: '-steamkey 3'
}