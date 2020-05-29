module.exports = {

    client: {
      "prefix": "-",
      "token": process.env.TOKEN,
      "id": "",
      "ownerID": ""
    },

    colors: {
      "blue": "#3498db",
      "red": "#e74c3c",
      "yellow": "#f1c40f",
      "green": "#2ecc71",
      "aqua": "#1abc9c",
      "purple": "#9b59b6",
      "orange": "#e67e22",
      "discord": "#36393f",
      "blurple": "#7289da",
      "outage": "#f04747"
    },

    levelCooldown: [],

    connectExpress: function() {

      const http = require('http');
      const express = require('express');
      const app = express();

      app.use(express.static('public'));

      app.get("/", function (request, response) {
        response.sendFile(__dirname + '/views/index.html');
      });

      app.get("/", (request, response) => {
        response.sendStatus(200);
      });

      app.listen(process.env.PORT);

      setInterval(() => {
        http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`); 
      }, 240000);

      return;
    },

    generateExperience: async function(message) {

      let User = message.member;

      const DB = require('quick.db');
      const Discord = require('discord.js');
      let eNumber = this.randomNumber(10, 30);
      let fetchedUser = await DB.get(`${User.id}`);
      if ((fetchedUser && !fetchedUser.leveling) || !fetchedUser) {

        DB.set(`${User.id}.leveling`, { level: 1, xp: 0 });
      }

      fetchedUser = await DB.get(`${User.id}`);
      let currentLevel = fetchedUser.leveling.level;
      let currentXP = fetchedUser.leveling.xp;
      currentXP += eNumber;

      let Formula = Math.floor(12 * (currentLevel ^ 2) + 125 * currentLevel + (175 * (currentLevel ^ 2)));

      if (Formula <= currentXP) {

        currentXP = 0;
        currentLevel += 1;

        DB.set(`${User.id}.leveling.level`, currentLevel);
        DB.set(`${User.id}.leveling.xp`, currentXP);

        this.levelCooldown.push(User.id);

        let self = this;

        setTimeout(function() {

          let index = self.levelCooldown.indexOf(User.id);
          if (index > -1) {

            self.levelCooldown.splice(index, 1);
          }
        }, 30000);

        let levelUP = this.createEmbed(this.colors.blue, '💠 <@!' + User.id + '>, has alcanzado el nivel **' + currentLevel + '**!');
        return message.channel.send(levelUP);
      }

      DB.set(`${User.id}.leveling.xp`, currentXP);
      this.levelCooldown.push(User.id);

      let self = this;

      setTimeout(function() {

        let index = self.levelCooldown.indexOf(User.id);
        if (index > -1) {

          self.levelCooldown.splice(index, 1);
        }
      }, 30000);
    },

    getUserClan: function(user) {

      const DB = require('quick.db');
      let userClan = DB.get(`${user.id}.clan`) || 'Ninguno.';

      return userClan;
    },

    getUserLevel: function(user) {

      const DB = require('quick.db');
      let fetchManager = DB.get(`${user.id}`);
      if (!fetchManager) return 'Nulo.';
      if (!fetchManager.leveling) return 'Nulo.';

      return fetchManager.leveling;
    },

    clanMute: function(member) {

      member.addRole(member.guild.roles.find((i) => i.name == '⛔ | Server Muted'));

      setTimeout(function() {

        member.removeRole(member.guild.roles.find((i) => i.name == '⛔ | Server Muted'));
      }, 30000);
    },

    clanInmunity: function(clan, user) {

      if (user.roles.has('478025492377894913') && (clan == '🔥 Fuego 🔥' || clan == '❄ Hielo ❄')) return true;
      if (user.roles.has('476391490092924940') && (clan == '⚡ Electricidad ⚡' || clan == '🌪 Aire 🌪')) return true;

      if (this.getUserClan(user)) {

        if (this.getUserClan(user) == '🔥 Fuego 🔥' && clan == '🔥 Fuego 🔥') return true;
        else if (this.getUserClan(user) == '❄ Hielo ❄' && clan == '❄ Hielo ❄') return true;
        else if (this.getUserClan(user) == '⚡ Electricidad ⚡' && clan == '⚡ Electricidad ⚡') return true;
        else if (this.getUserClan(user) == '🌪 Aire 🌪' && clan == '🌪 Aire 🌪') return true;

        else return false;

      } else {

        return false;
      }
    },

    createKey: function(length) {

      let output = '';
      let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

      for (let i = 0; i < length; i++) {

        output += chars[Math.floor(Math.random() * chars.length)];
      }

      return output;
    },

    createSteamKey: function(quantity) {

      let output = '**';
      let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

      for (let x = 0; x < quantity; x++) {

        output += '`-` ';

        for (let z = 0; z < 15; z++) {

          if ([5, 10, 15].some((i) => z == i)) output += '-';

          output += chars[Math.floor(Math.random() * chars.length)];
        }

        output += '\n';
      }

      output += '**';
      return output;
    },

    createEmbed: function(color, description) {

      const Discord = require('discord.js');

      let Embed = new Discord.RichEmbed()
        .setColor(color)
        .setDescription(description);
      return Embed;
    },

    createMediumEmbed: function(color, description, footer) {

      const Discord = require('discord.js');

      let Embed = new Discord.RichEmbed()
        .setColor(color)
        .setDescription(description)
        .setFooter(footer);
      return Embed;
    },

    helpEmbed: function(message, information, client) {

      let permissions = client.elevation(message.member);

      const Discord = require('discord.js');
      let helpEmbed = new Discord.RichEmbed()
        .setColor('#117ea6')
        .setTitle('ℹ Información')
        .setDescription('**Descripción**: ' + information.help.description + '\n**Uso**: -' + information.help.usage + '\n**Ejemplo**: ' + information.help.example + '\n\n**Permiso requerido**: ' + information.conf.permLevel + '\n**Permiso actual**: ' + permissions)
        .setFooter('<> Significa requerido, [] Significa opcional.')
        .setTimestamp();
      return helpEmbed;
    },

    typeOf: function(object) {

      let toString = Object.prototype.toString;
      let type = typeof(object);

      if (type == 'undefined') {
        return 'undefined';
      }

      if (object) {
        type = object.constructor.name;
      } else if (type == 'object') {
        type = toString.call(object).slice(8, -1);
      }

      return type;
    },

    randomNumber: function(min, max) {

      let tNumber = Math.floor(Math.random() * (max - min + 1) + min);
      return tNumber;
    },

    randomFloat: function(min, max) {

      let tNumber = Math.random() * (max - min + 1) + min;
      return tNumber;
    },

    chooseArray: function(array) {

      if (array.constructor.name !== 'Array') throw new TypeError('It should be an array!');
      let chosen = array[Math.floor(Math.random() * array.length)];
      return chosen;
    },

    getReasons: function(ruleNumber) {

      if (isNaN(ruleNumber)) return 'Error';
      let getNumber = Number(ruleNumber) - 1;

      let guildReasons = [ 
        { name: '📡 Flood', def: 'Repetición constante de mensajes.' },
        { name: '📡 Spam', def: 'Mensajes constantes indeseados.' },
        { name: '📡 Publicidad', def: 'Publicitar servicios, páginas, etc.' },
        { name: '📡 No usar los comandos en su canal respectivo', def: 'Usar comandos en el chat, etc.' },
        { name: '📡 No usar los canales para su uso dado', def: 'Postear arte en el canal de comandos, etc.' },
        { name: '🚫 No respetar a los demás', def: 'Ser tóxico, ofensivo, etc.' },
        { name: '🚫 No seguir los términos de servicio', def: 'Romper el ToS de Discord ([Términos de Servicio](https://discordapp.com/tos)).' },
        { name: '🚫 No seguir las órdenes de los moderadores', def: 'Seguir insultando después de que te hayan dicho que pares, etc.' },
        { name: '🔞 NSFW', def: 'Contenido no apropiado para los chats.' },
        { name: '🔞 Gore', def: 'Contenido con mucha sangre, también inapropiado.' },
        ];
      let getReason = guildReasons[getNumber];

      return getReason;
    }

};