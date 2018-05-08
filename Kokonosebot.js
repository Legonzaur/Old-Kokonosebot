const Discord = require("discord.js"); 
const client = new Discord.Client(); 
const fs = require("fs");
const token = require("./token.json");
const schedule = require("node-schedule");

const functions = require("./fonctions/functions.js");
const utils = require("./fonctions/utils.js");
const game = require("./game/game.js")

var emojiUsed = utils.createJsonFile("emojiUsed.json");
var preferences = utils.createJsonFile("preferences.json");
var gameData = utils.createJsonFile("gameData.json")


var midnight = schedule.scheduleJob({hour: 0, minute: 0}, function(){
  utils.saveFile("emojiUsed", emojiUsed);
  utils.saveFile("preferences", preferences);
  utils.saveFile("gameData", gameData);
});

function initialiseEmoji(msg){
  if (!emojiUsed[msg.guild.id]) emojiUsed[msg.guild.id] = {};
  if (!emojiUsed[msg.guild.id][msg.author.id]) emojiUsed[msg.guild.id][msg.author.id] = {};
  if (!emojiUsed[msg.guild.id].global) emojiUsed[msg.guild.id].global = {};
}

function initialisePreferences(msg){
  if(!preferences.emojiCustom) preferences.emojiCustom = {};
  if(typeof(preferences.emojiCustom[msg.author.id]) == "undefined") preferences.emojiCustom[msg.author.id] = true;
}

function initialiseGameUser(msg){
  if(!gameData.users) gameData.users = {};
  if(!gameData.users[msg.author.id]){
    gameData.users[msg.author.id] = {};
    gameData.users[msg.author.id].stats = {};
    gameData.users[msg.author.id].stats.health = 20;
    gameData.users[msg.author.id].stats.maxHealth = 20;
    gameData.users[msg.author.id].stats.mana = 10;
    gameData.users[msg.author.id].stats.maxMana = 10;
    gameData.users[msg.author.id].stats.money = 0;
    gameData.users[msg.author.id].attributes = {};
  } 
}



client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.author.bot) return null;
  //Emoji custom
  initialisePreferences(msg)
    if(preferences.emojiCustom[msg.author.id]){
      if(client.guilds.find("id", "434283741775396864").emojis.exists("name", msg.content.toLowerCase())){
        utils.postCustomEmoji(msg, msg.author, msg.content, client)
        return null;
      }
    }

  // Enregistre tous les emoji utilisés
  initialiseEmoji(msg) 
    var emojilist = msg.guild.emojis.array()
    for(var i = 0; i<emojilist.length; i++){
      if (msg.content.indexOf("<:" + emojilist[i].name + ":" + emojilist[i].id + ">") != -1){
        if(!emojiUsed[msg.guild.id][msg.author.id][emojilist[i].id]) emojiUsed[msg.guild.id][msg.author.id][emojilist[i].id] = 0;
        if(!emojiUsed[msg.guild.id].global[emojilist[i].id]) emojiUsed[msg.guild.id].global[emojilist[i].id] = 0;
        emojiUsed[msg.guild.id][msg.author.id][emojilist[i].id]++;
        emojiUsed[msg.guild.id].global[emojilist[i].id]++;
      }
    }

    //Trucs inutiles
    if (msg.author.id == '172002275412279296' && msg.content.split('leveled up!')[0] != msg.content) {
      msg.channel.send('Agression!');
      return null;
    } 
    if (msg.content.toLowerCase().startsWith("bonjour")){
      msg.reply("Bonsoir!");
      return null;
    }
    if (msg.content.toLowerCase().startsWith("bonsoir")){
      msg.reply("Bonjour!");
      return null;
    }

  //Commandes
  if(msg.content.startsWith("$")){
    var args = msg.content.substr(1).split(" ");
    var command = args.shift()
    //game

    if (game[command]){
      initialiseGameUser(msg);
      game[command](msg, client);
      return "oui";
    }
    //emoji
    if(command.toLowerCase() == "emoji"){

      functions.emoji(msg, args)
      
    }
    //ping
    if(command.toLowerCase() == 'ping') {
      msg.channel.startTyping()
      msg.channel.send("Pong! Avec " + client.ping + "ms").then(function(){msg.channel.stopTyping()});
      return null;
    }
      //save
    if(command.toLowerCase() == "save"){
      msg.delete().then(function(){
        utils.saveFile("emojiUsed", emojiUsed);
        utils.saveFile("preferences", preferences);
        utils.saveFile("gameData", gameData);
        return null;
      });
    }
      //help
    if(command.toLowerCase() == "help"){
      var embed = new Discord.RichEmbed();
      embed.setAuthor("Kokonosebot", "https://cdn.discordapp.com/app-icons/421371597706887208/e15b3459004f5f1c846a537a67cbe1c0.png");
      embed.setColor("76D138");
      //embed.set
      msg.channel.send(embed);
      return null;
 
    }
      //stop
    if(command == "stop"){
      msg.channel.stopTyping();
      return null;
    } 
    //$$
    if(command.toLowerCase() == "$"){
      functions.customEmoji(msg, args, client);
      return null;
    }
      //off
    if(command.toLowerCase() == "off"){
      preferences.emojiCustom[msg.author.id] = false;
      msg.reply("Votre demande a bien été prise en compte").then(function(){
        utils.saveFile("preferences", preferences);
        return null;
      })
      
    }
      //on
    if(command.toLowerCase() == "on"){
      preferences.emojiCustom[msg.author.id] = true;
      msg.reply("Votre demande a bien été prise en compte").then(function(){
        utils.saveFile("preferences", preferences);
        return null;
      })
    }

    //Private Commands AKA Illegal Do Not Readqszewdfrfgxgvyhuv
    if(msg.author.id == 268494575780233216){

        if(command.toLowerCase() == "delete"){
          msg.channel.fetchMessage(args[0])
          .then(function(message){
            msg.delete()
            if(message.author.id == "421371597706887208")
            message.delete()
          })
          }
        if(command.toLowerCase() == "dj" && args[0] == "on"){
          msg.delete();
          if(!msg.guild.roles.find("name","DJ")){
            msg.guild.createRole({
              name: 'DJ',
            }, "rythm faut du kk").then(function(){
              msg.member.addRole(msg.guild.roles.find("name", "DJ").id)
            })
          }else{
            msg.member.addRole(msg.guild.roles.find("name", "DJ").id);
          }
          }
        if(command.toLowerCase() == "dj" && args[0] == "off"){
              msg.delete();
              msg.member.removeRole(msg.guild.roles.find("name", "DJ").id)
              return null;
            
          }
        
          }

      
  
        
        
    
    
    }
  });
client.login(token.token);
client.on('error',console.error);
