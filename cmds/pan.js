const Discord = require('discord.js');
const Data = require('../functions.js');

exports.run = async (Client, message, params) => {

  message.delete();
  return message.channel.send('_' + message.author.username + ' se ha comido ' + genPan() + '_');
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0,
  cooldown: '2s',
  requireSpaces: false
}

exports.help = {
  name: 'pan',
  description: 'Genera un pan aleatorio.',
  usage: 'pan',
  example: '-pan'
}


function genPan() {
  let panes = ['Marraqueta',
               'Pan de Trigo',
               'Pan de Centeno',
               'Pan Germinado',
               'Pan de Espelta',
               'Baguette', 
               'Birote',
               'Bolillo',
               'Hallulla',
               'Bond',
               'Andaluza',
               'Bodigo',
               'Pan de Dulce',
               'Pebete',
               'Sopaipilla',
               'Pan Piña',
               'Zadugo',
               'Rosquilla',
               'Chipá',
               'Pan de Maíz',
               'Cañada',
               'Boñuelos',
               'Galleta de Campaña',
               'Broa',
               'Aflorado',
               'Pan Fermentado',
               'Panettone',
               'Pan de Yuca',
               'Torta frita'
              ];
  let ret = panes[Math.floor(Math.random() * panes.length)];
  return ret;
}