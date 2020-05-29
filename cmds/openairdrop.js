const Discord = require('discord.js');
const Data = require('../functions.js');

exports.run = async (Client, message, params) => {

  if (!message.member.roles.has('630095884792627210')) return message.channel.send(':x: Dato Curioso: Necesitas tener un airdrop para poder abrir uno.');
  let awards = [getReward(), getReward(), getReward()];
  await message.member.removeRole('630095884792627210');
  message.channel.send('✅ Has abierto tu Airdrop y has obtenido:\n\n' + awards.map((val) => `**-** ${val}`).join('\n'));
  let msg = awards.map((val) => `**-** ${val}`).join('\n');
  let embed = Data.createEmbed('#7289da', msg)
    .setAuthor(message.author.tag, message.author.displayAvatar)
    .setFooter(message.author.id);
  await message.guild.channels.get('518826985665986560').send(embed);
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['oad'],
  permLevel: 0,
  cooldown: '1s',
  requireSpaces: false
}

exports.help = {
  name: 'openairdrop',
  description: 'Abre un airdrop.',
  usage: 'openairdrop',
  example: '-openairdrop'
}

function getReward() {

  let x = Data.randomFloat(0, 100);
  if (x <= 60) return 'Nada';
  else if (x > 60 && x <= 70) {
    let z = Data.chooseArray(['Minecraft NFA', 'Spotify Premium'])
    return `${z == 'Minecraft NFA' ? '🎮' : '🎧'} **Cuenta**: ${z}`;
  } else if (x > 70 && x <= 80) {
    let z = Data.chooseArray(['Venenosa', 'Protectora', 'Reductora']);
    return '🧪 **Poción**: ' + z;
  } else if (x > 80 && x <= 100) {
    let z = Data.randomNumber(1000, 9000);
    return '💰 **Dinero**: $' + z;
  } else {
    return 'Nada';
  }
}