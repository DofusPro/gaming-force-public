const Discord = require('discord.js');
const Data = require('../functions.js');
const DB = require('quick.db');

exports.run = async (Client, message, params) => {

  let indexer = params[0];
  if (!indexer || (indexer !== 'add' && indexer !== 'remove' && indexer !== 'list')) {

    let embed = Data.helpEmbed(message, this, Client);
    return message.channel.send(embed);
  }

  if (indexer == 'add' || indexer == 'remove') {

    let fUser = message.mentions.users.first();
    if (!fUser) {

      let rEmbed = Data.createEmbed(Data.colors.red, '❌ Al añadir o remover a alguien de la lista negra, necesitas mencionar a la persona.');
      return message.channel.send(rEmbed);
    }

    if (indexer == 'add') {

    let checkBlack = await DB.get(`${fUser.id}`);
    if (!checkBlack) DB.set(`${fUser.id}`, {});
    if (checkBlack.blacklisted == true) {

      let rEmbed = Data.createEmbed(Data.colors.red, '❌ La persona mencionada ya está en la lista negra.');
      return message.channel.send(rEmbed);
    }

    checkBlack.blacklisted = true;
    DB.set(`${fUser.id}`, checkBlack);
    let fEmbed = Data.createEmbed(Data.colors.green, '✅ <@!' + fUser.id + '> ha sido añadido a la lista negra y ha sido notificado.');
    message.channel.send(fEmbed);

    let uEmbed = Data.createEmbed(Data.colors.orange, '⚠ Estás en la lista negra, por lo que no puedes usar los comandos del bot.');
    fUser.send(uEmbed).catch((error) => {

      let eEmbed = Data.createEmbed(Data.colors.red, '⚠ La persona no ha podido ser notificada.');
      return message.channel.send(eEmbed);
    });
    
    return;
          
    } else {

    let checkBlack = await DB.get(`${fUser.id}`);
    if (!checkBlack) DB.set(`${fUser.id}`, {});
    if (!checkBlack.blacklisted) {

      let rEmbed = Data.createEmbed(Data.colors.red, '❌ La persona mencionada no está en la lista negra.');
      return message.channel.send(rEmbed);
    }

    delete checkBlack.blacklisted;
    DB.set(`${fUser.id}`, checkBlack);
    let fEmbed = Data.createEmbed(Data.colors.green, '✅ <@!' + fUser.id + '> ha sido removido de la lista negra y ha sido notificado.');
    message.channel.send(fEmbed);

    let uEmbed = Data.createEmbed(Data.colors.green, '🛡 Ya no estás en la lista negra, por lo que ya podrás usar los comandos del bot.');
    fUser.send(uEmbed).catch((error) => {

      let eEmbed = Data.createEmbed(Data.colors.red, '⚠ La persona no ha podido ser notificada.');
      return message.channel.send(eEmbed);
    });

    return;
    }

  } else {

    let usersBlacklisted = [];
    await asyncForEach(message.guild.members.array(), async (member) => {

      let fetchUser = await DB.get(`${member.id}`);
      if (!fetchUser) return;
      if (!fetchUser.blacklisted) return;

      let fetchedUser = await Client.fetchUser(member.id);
      let pushMessage = ('<@!' + fetchedUser.id + '> | ' + fetchedUser.tag + ' (' + fetchedUser.id + ')');
      usersBlacklisted.push(pushMessage)
    });

    let blacklistEmbed = new Discord.RichEmbed()
      .setColor(Data.colors.yellow)
      .setTitle('🛡 Usuarios en la lista negra')
      .setDescription(usersBlacklisted.join('\n'))
      .setTimestamp();
    return message.channel.send(blacklistEmbed);
  }
    
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['bl'],
  permLevel: 6,
  cooldown: '0s',
  requireSpaces: false
}

exports.help = {
  name: 'blacklist',
  description: 'Añade/Remueve a miembros de la lista negra.',
  usage: 'blacklist <add | remove | list> [Mención]',
  example: '-blacklist add 441371076887445523'
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}