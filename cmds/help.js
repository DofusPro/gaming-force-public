const Discord = require('discord.js');
const Data = require('../functions.js');

exports.run = async (Client, message, params) => {

  let command = params[0];
  if (!command) {

    let clientCommands = Client.commands.array();
		let iterator = 0;
		let embeds = [];

		for (let cmd of clientCommands) {
			if (!embeds[iterator]) {
				embeds[iterator] = '';
			}

			let toAdd = '```asciidoc\n= ' + cmd.help.name + ' =\nUso :: ' + cmd.help.usage + '\n```';
			if ((embeds[iterator] + toAdd).length > 1970) {
        iterator++;
        console.log(toAdd);
				embeds[iterator] = toAdd;
				continue;
			}

			embeds[iterator] += toAdd;
		}

    let helpEmbed = new Discord.RichEmbed()
      .setColor(Data.colors.green)
      .setTitle('Comandos de Gaming Force');
    message.channel.send('**✅ | Revisa tus mensajes privados!**');
    message.author.send(helpEmbed).catch((error) => {

      message.channel.send('**❌ | Tienes los mensajes directos deshabilitados o has bloqueado al bot.**');
    });

    embeds.forEach((helper) => {

      if (!helper) return;
      let embed = Data.createEmbed(Data.colors.green, helper);
      message.author.send(embed).catch((error) => {});
    });

    return;
  } else {

    if (!Client.commands.has(command)) {

      let embed = Data.helpEmbed(message, this, Client);
      return message.channel.send(embed);
    }

    let commandData = Client.commands.get(command);
    let commandAliases = commandData.conf.aliases.join(', ');
    let helpEmbed = new Discord.RichEmbed()
      .setColor(Data.colors.blurple)
      .setAuthor(message.author.username, message.author.displayAvatarURL)
      .setDescription('**Nombre**: `' + commandData.help.name + '`\n**Uso**: `' + commandData.help.usage + '`\n**Descripción**: `' + commandData.help.description + '`\n\n**Permiso requerido**: `' + commandData.conf.permLevel + '`\n**Cooldown**: `' + commandData.conf.cooldown + '`\n**Alias**: `' + (commandAliases || 'Ninguno') + '`')
      .setTimestamp();
    return message.channel.send(helpEmbed);
  }
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['ayuda'],
  permLevel: 0,
  cooldown: '2s',
  requireSpaces: false
}

exports.help = {
  name: 'help',
  description: 'Muestra el comando de ayuda, o sobre un comando específico.',
  usage: 'help [Comando]',
  example: '-help ban'
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}