const Discord = require('discord.js');
const Moment = require('moment');
const Data = require('../functions.js');

exports.run = async (Client, message, params) => {

  let msg = await message.channel.send('Obteniendo datos...');
  let ClientPing = Math.round(Client.ping);
  let Stamp = Moment().format('DD/MM/YYYY HH:mm')

  let color;

  if (ClientPing <= 50) color = Data.colors.green;
  else if (ClientPing > 50 && ClientPing <= 100) color = Data.colors.blue;
  else if (ClientPing > 100 && ClientPing <= 200) color = Data.colors.orange;
  else if (ClientPing > 200 && ClientPing <= 400) color = Data.colors.red;
  else if (ClientPing > 400) color = Data.colors.outage;

  let embed = new Discord.RichEmbed()
    .setColor(color)
    .setAuthor(Client.user.username, Client.user.avatarURL)
    .setDescription('**Ping: ' + ClientPing + ' ms**')
    .setFooter('Pedido por: ' + message.author.username + ' - ' + Stamp);
  msg.edit(embed).then(mesg => mesg.delete(15000));
}

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: 0,
  cooldown: '5s',
  requireSpaces: false
}

exports.help = {
  name: 'ping',
  description: 'Muestra la velocidad del cliente.',
  usage: 'ping',
  example: '-ping'
}
