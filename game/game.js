const Discord = require("discord.js"); 
const fs = require("fs");
const utils = require("../fonctions/utils.js");
const gameData = utils.createJsonFile("gameData.json")


const gameFunctions = {
  profil : function (msg, client, clearing) {
    var id = 0;
    if(clearing){
      id = clearing;
    }else{
      id = msg.author.id;
    }

    var embed = new Discord.RichEmbed();

    embed.setAuthor(utils.getNickname(msg, id), msg.guild.members.find("id", id).user.avatarURL);
    embed.setColor(msg.guild.members.find("id", id).roles.last().hexColor);
    var healthstatus = "";
    var trigger = true;
    for(var i = 0; i<20; i++){
      if(i/20<gameData.users[id].stats.health/gameData.users[id].stats.maxHealth && trigger){
        healthstatus += "=";
       
      } 
      else{
        healthstatus += "-";
        
      } 
    }
    embed.addField("❤ " + gameData.users[id].stats.health + " / " + gameData.users[id].stats.maxHealth, healthstatus)
    msg.channel.send(embed)
  },

  clearing : function (msg, client){
    if(!msg.guild.members.find("id", msg.author.id).roles.exists("name","Team Saeru")) return null;
    var args = msg.content.substr(1).split(" ");
    var command = args.shift();
    if(args[1]){
      if(gameFunctions[args[1]]){
        if(msg.guild.members.find("id", args[0].replace(/[<@!>]/g, ''))) {
          if(!gameData.users[args[0].replace(/[<@!>]/g, '')]){
            msg.reply("Cet utilisateur n'a pas encore commencé le jeu!");
            return null;
          }
          clearing = msg.guild.members.find("id", args[0].replace(/[<@!>]/g, '')).id;
          gameFunctions[args[1]](msg, client, clearing)
          return null;
        }else{
          msg.reply("cet utilisateur n'a pas été trouvé dans la base de données");
          return null;
        }
      }
    }
  }
}




module.exports = {
  profil: gameFunctions.profil,

  clearing : gameFunctions.clearing

  };