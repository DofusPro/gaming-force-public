const Discord = require('discord.js');
const DB = require('quick.db');
const Data = require('../functions.js');

exports.run = async (Client, message, params) => {

  let operationMan = params[0];
  if (!operationMan || !['count', 'share', 'add', 'open'].some((i) => operationMan == i)) {

    let embed = Data.helpEmbed(message, this, Client);
    return message.channel.send(embed);
  }

  let fetchedUser = DB.get(message.author.id);
  if (operationMan == 'count') {

    let userCount = 0;
    if (message.member.roles.has('522866846211375106')) userCount++;
    if (fetchedUser.mysteryBoxes) userCount += fetchedUser.mysteryBoxes;

    let embed = Data.createEmbed(Data.colors.green, 'ℹ Tienes ' + userCount + ' Mystery Box.');
    return message.channel.send(embed);
  } else if (operationMan == 'share') {

    let otherUser = message.mentions.members.first() || message.guild.members.get(params[1]);
    if (!otherUser || otherUser.user.bot) {

      let embed = Data.helpEmbed(message, this, Client);
      return message.channel.send(embed);
    }

    if (message.member.roles.has('522866846211375106')) {

      message.member.removeRole('522866846211375106');
      otherUser.addRole('522866846211375106');
    } else if (fetchedUser.mysteryBoxes) {

      if (fetchedUser.mysteryBoxes == 1) DB.delete(message.author.id + '.mysteryBoxes');
      else if (fetchedUser.mysteryBoxes > 1) DB.add(message.author.id + '.mysteryBoxes', -1);

      let userData = DB.get(otherUser.id);
      if (!userData) {

        let embed = Data.createEmbed(Data.colors.red, '❌ El usuario tiene que hablar por lo menos una vez.');
        return message.channel.send(embed);
      }

      DB.add(otherUser.id + '.mysteryBoxes', 1);
    } else {

      let embed = Data.createEmbed(Data.colors.red, '❌ No tienes Mystery Box para compartir.');
      return message.channel.send(embed);
    }

    let embed = Data.createEmbed(Data.colors.green, '✅ Has compartido 1 Mystery Box con ' + otherUser + '.');
    return message.channel.send(embed);
  } else if (operationMan == 'add') {

    let userPerms = await Client.elevation(message.member);
    if (!(userPerms >= 4)) {

      let embed = Data.createEmbed(Data.colors.red, '❌ No tienes suficientes permisos.');
      return message.channel.send(embed);
    }

    let addMember = message.mentions.members.first() || message.guild.members.get(params[1]);
    if (!addMember || addMember.user.bot) {

      let embed = Data.helpEmbed(message, this, Client);
      return message.channel.send(embed);
    }

    let quantity = Number(params[2]);
    if (!quantity || quantity < 1 || isNaN(quantity)) quantity = 1;

    let sentMessage;
    let embed = Data.createEmbed(Data.colors.green, '✅ Le han sido añadidas ' + quantity + ' Mystery Box a ' + addMember + '.');

    let userData = DB.get(addMember.id);
    if (!userData || (userData && !userData.mysteryBoxes)) {

      DB.set(addMember.id + '.mysteryBoxes', quantity);
      sentMessage = await message.channel.send(embed);
    } else {

      DB.add(addMember.id + '.mysteryBoxes', quantity);
      sentMessage = await message.channel.send(embed);
    }

    userData = DB.get(addMember.id);
    let emojis = ['📦', '🍫', '🍨', '🎮', '🎧', '🎉', '💰', '💻', '🎰'];
    let userEmbed = Data.createEmbed(Data.colors.blue, '✅ Ahora eres poseedor de ' + userData.mysteryBoxes + ' Mystery Box.\nEscribe `-mb open` en el servidor para abrirla.\n\n' + emojis[0] + ' Contenido Posible' + emojis[0] + '\nChocolate ' + emojis[1] + '\nHelado ' + emojis[2] + '\nCuenta Minecraft NFA ' + emojis[3] + '\nCuenta Spotify ' + emojis[4] + '\nCuenta UPlay ' + emojis[7] + '\nRol Personalizado ' + emojis[5] + '\nLotería ' + emojis[6] + '\nJackpot ' + emojis[8]);
    addMember.send(userEmbed).catch((error) => {

      embed.setFooter('El usuario no pudo ser notificado.');
      sentMessage.edit(embed);
    });
  } else {

    let continueOp = true;
    if (message.member.roles.has('522866846211375106')) { 

      message.member.removeRole('522866846211375106');
      continueOp = false;
    } else if (fetchedUser.mysteryBoxes && continueOp) {

      if (fetchedUser.mysteryBoxes == 1) {

        DB.delete(message.author.id + '.mysteryBoxes');
        continueOp = false;
      } else if (fetchedUser.mysteryBoxes > 1 && continueOp) {

        DB.add(message.author.id + '.mysteryBoxes', -1);
      }
    } else {

      let embed = Data.createEmbed(Data.colors.red, '❌ No tienes Mystery Box para abrir.');
      return message.channel.send(embed);
    }

    let useReward = getReward();
    let embed = Data.createEmbed(Data.colors.blue, '🌐 ' + message.author + ' has obtenido ' + useReward + '!');
    message.channel.send(embed);

    let logEmbed = Data.createEmbed(Data.colors.blue, message.author + ' ha ganado ' + useReward);
    Client.channels.get('518826985665986560').send(logEmbed);
  }

}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['mb'],
  permLevel: 0,
  cooldown: '0s',
  requireSpaces: false
}

exports.help = {
  name: 'mysterybox',
  description: 'Revisar, compartir, abrir o dar Mystery Boxes.',
  usage: 'mysterybox <count | share | add | open> [Mención | ID] [Cantidad]',
  example: '-mysterybox @Discord#0001 2'
}

function getReward() {

  let x = Data.randomFloat(0, 150);
  if (x <= 1) return 'Jackpot 🎰';
  if (x <= 3) return 'Lotería 💰';
  if (x <= 5) return 'Rol Personalizado 🎉';
  if (x <= 15) return 'Cuenta UPlay 💻';
  if (x <= 30) return 'Cuenta Spotify 🎧';
  if (x <= 60) return 'Cuenta Minecraft NFA 🎮';
  if (x <= 100) return 'Helado 🍨';
  if (x <= 150 || x > 150) return 'Chocolate 🍫';
}