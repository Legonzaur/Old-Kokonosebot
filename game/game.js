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

    embed.setAuthor(utils.getNickname(msg, id, client.guilds.find("id", "230405441845329930")), client.guilds.find("id", "230405441845329930").members.find("id", id).user.avatarURL);
    embed.setColor(client.guilds.find("id", "230405441845329930").members.find("id", id).displayHexColor);
    var healthstatus = "";
    for(var i = 0; i<20; i++){
      if(i/20<gameData.users[id].stats.health/gameData.users[id].stats.maxHealth){
        healthstatus += "=";
       
      } 
      else{
        healthstatus += " -";
        
      } 
    }
    embed.addField("❤ " + gameData.users[id].stats.health + " / " + gameData.users[id].stats.maxHealth, healthstatus);
    var manastatus = "";
    for(var i = 0; i<20; i++){
      if(i/20<gameData.users[id].stats.mana/gameData.users[id].stats.maxMana){
        manastatus += "=";
       
      } 
      else{
        manastatus += " -";
        
      } 
    }
    embed.addField("<:roadsign:443724893583048704> " + gameData.users[id].stats.mana + " / " + gameData.users[id].stats.maxMana, manastatus);
    var xpstatus = ""
    for(var i = 0; i<20; i++){
      if(i/20<gameData.users[id].stats.xp/Math.round(gameData.users[id].stats.level + Math.pow(gameData.users[id].stats.level, 2.5))){
        xpstatus += "=";
       
      } 
      else{
        xpstatus += " -";
        
      } 
    }
    embed.addField("<:xp:443734998068101120> " + gameData.users[id].stats.xp + " / " + Math.round(gameData.users[id].stats.level + Math.pow(gameData.users[id].stats.level, 2.5)) + " | Niveau " + gameData.users[id].stats.level, xpstatus);
    embed.addField("💰 " + gameData.users[id].stats.money, '\u200b');
    msg.channel.send(embed);
    return null;
  },

  clearing : function (msg, client){
    if(!client.guilds.find("id", "230405441845329930").members.find("id", msg.author.id).roles.exists("name","Team Saeru")) return null;
    if(msg.channel.type == "dm") return null;

    var requiredMana = 1;
    console.log("oi")

    if(gameData.users[msg.author.id].stats.mana-requiredMana <= 0){
      msg.reply("Vous n'avez pas assez de mana!");
      return null;
    }
    var args = msg.content.substr(1).split(" ");
    var command = args.shift();
    msg.content = "$" + args.slice(1, args.length).join(" ");
    if(args[1]){
      if(gameFunctions[args[1]]){
        if(args[1] == "clearing"){
          msg.reply("Vous ne pouvez pas utiliser ce pouvoir avec cette commande");
          return null;
        }
        if(client.guilds.find("id", "230405441845329930").members.find("id", args[0].replace(/[<@!>]/g, ''))) {
          if(!gameData.users[args[0].replace(/[<@!>]/g, '')]){
            msg.reply("Cet utilisateur n'a pas encore commencé le jeu!");
            return null;
          }
          clearing = client.guilds.find("id", "230405441845329930").members.find("id", args[0].replace(/[<@!>]/g, '')).id;
          gameData.users[msg.author.id].stats.mana -= requiredMana;
          gameFunctions[args[1]](msg, client, clearing)
          return null;
        }else{
          msg.reply("cet utilisateur n'a pas été trouvé dans la base de données");
          return null;
        }
      }
    }
  },

  decieving : function (msg, client, clearing){
    var id = 0;
    if(clearing){
      id = clearing;
    }else{
      id = msg.author.id;
    }
    var args = msg.content.substr(1).split(" ");
    var command = args.shift();
    if(!client.guilds.find("id", "434283741775396864").members.find("id", id).roles.exists("name","Team Kano")) return null;
    if(true){

    }
  }
}




module.exports = {
  profil: gameFunctions.profil,

  clearing : gameFunctions.clearing,

  decieving : gameFunctions.decieving

  };