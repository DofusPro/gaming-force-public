const Discord = require('discord.js');
const Data = require('../functions.js');
const Moment = require('moment');

exports.run = async (Client, message, params) => {

  let userTo = message.mentions.members.first() || message.guild.members.get(params[0]) || message.member;
  let createdAt = Moment(userTo.user.createdAt).format('DD/MM/YYYY HH:mm:ss');
  let joinedAt = Moment(userTo.joinedAt).format('DD/MM/YYYY HH:mm:ss');
  let acknowledgements = 'Usuario';
  let userData = Data.getUserLevel(userTo);
  let isBot = userTo.user.bot ? 'Sí.' : 'No.';

  if (userTo.hasPermission('MANAGE_MESSAGES')) acknowledgements = 'Moderador';
  if (userTo.hasPermission('ADMINISTRATOR')) acknowledgements = 'Administrador';

  let embed = new Discord.RichEmbed()
    .setColor(Data.colors.blue)
    .setThumbnail(userTo.user.displayAvatarURL)
    .setTitle('ℹ Información Básica')
    .setDescription('🔹 **Nombre**: ' + userTo.user.username + '\n🔹 **Discriminador**: ' + userTo.user.discriminator + '\n🔹 **ID**: ' + userTo.id + '\n🔹 **Fecha de creación**: ' + createdAt + '\n🔹 **Bot?**: ' + isBot)
    .addField('📥 Entrada', joinedAt, true)
    .addField('🔧 Rol', userTo.highestRole.name, true)
    .addField('🛠 Permisos', acknowledgements, true)
    .addField('🛡 Clan', Data.getUserClan(userTo), true)
    .addField('🔬 Roles', '`' + userTo.roles.map(role => role.name).join(', ') + '`')
    .addField('📁 Sistema de Niveles', '**Nivel**: ' + (userData.level || 'Nulo') + '\n**XP**: ' + ((userData.xp && userData.xp.toLocaleString().replace(/\,/g, '.')) || 'Nulo'))
    .setFooter('Pedido por ' + message.author.tag)
  message.channel.send(embed);

}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['useri'],
  permLevel: 0,
  cooldown: '15s',
  requireSpaces: false
}

exports.help = {
  name: 'userinfo',
  description: 'Muestra la información de un usuario específico.',
  usage: 'userinfo [Usuario]',
  example: '-userinfo @Discord#0001'
}
