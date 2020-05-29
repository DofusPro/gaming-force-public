const Discord = require('discord.js');
const Data = require('../functions.js');

exports.run = async (Client, message, params) => {
  
  const DB = require('quick.db');

	let user = message.mentions.members.first() || message.guild.members.get(params[0]) || message.member;
	let pickleSize;
	let realPickle;
	if ((!DB.get(user.id) || !DB.get(user.id + '.pickle')) && DB.get(user.id + '.pickle') !== 0) {
		
		let random = randomInt(0, 1);
		if (random <= 0.1) pickleSize = randomSize(30, 50);
		else if (random <= 0.3) pickleSize = randomSize(18, 29);
		else if (random <= 0.8) pickleSize = randomSize(10, 17);
		else if (random <= 1) pickleSize = randomSize(0 ,9);
		
		realPickle = (pickleSize + (pickleSize ** 0.6) * 1.005 + 1).toFixed(2);
		DB.set(user.id + '.pickle', pickleSize);
	} else {
		pickleSize = DB.get(user.id + '.pickle');
		realPickle = (pickleSize + (pickleSize ** 0.6) * 1.005 + 1).toFixed(2);
	}
	
	let embed = Data.createEmbed(Data.colors.blue, '✅ A ' + user + ' le mide ' + pickleSize + 'CM y erecto ' + realPickle + 'CM.');
	message.channel.send(embed);
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['dick'],
  permLevel: 0,
  cooldown: '1s',
  requireSpaces: false
}

exports.help = {
  name: 'pickle',
  description: 'Muestra cuánto le mide a alguien o a ti mismo.',
  usage: 'pickle [Usuario]',
  example: '-pickle @Discord#0001'
}

function randomSize(low, high) {
  return Number((Math.random() * (high - low + 1) + low).toFixed(2));
}

function randomInt(low, high) {
  return ((Math.random() * (high - low) + low).toFixed(2));
}