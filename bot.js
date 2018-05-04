const Discord = require("discord.js"); 
const client = new Discord.Client(); 
const fs = require("fs");
const token = require("./token.json");
const schedule = require("node-schedule");

const functions = require("./functions.js");
const utils = require("./utils.js")

var emojiUsed = utils.createJsonFile("emojiUsed.json");
const preferences = utils.createJsonFile("preferences.json");

function saveFile(fileName, file){
  fs.writeFile(fileName +".json", JSON.stringify(file), function(err) {
    if (err) return console.log(err);
  });
  }

var midnight = schedule.scheduleJob({hour: 0, minute: 0}, function(){
  saveFile("emojiUsed", emojiUsed);
  saveFile("preferences", preferences);
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

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  });

client.on('message', msg => {
  //Emoji custom
  initialisePreferences(msg)
    if(preferences.emojiCustom[msg.author.id]){
      if(client.guilds.find("id", "434283741775396864").emojis.exists("name", msg.content.toLowerCase())){
        utils.postCustomEmoji(msg, msg.author, msg.content, client)
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
      } 
    if (msg.content.toLowerCase().startsWith("bonjour")){
      msg.reply("Bonsoir!");
      }
    if (msg.content.toLowerCase().startsWith("bonsoir")){
      msg.reply("Bonjour!");
      }

  //Commandes
  if(msg.content.startsWith("$")){
    var args = msg.content.substr(1).split(" ");
    var command = args.shift()

    if(command.toLowerCase() == "emoji"){

      functions.emoji(msg, args)
      
      }
    if(command.toLowerCase() == 'ping') {
      msg.channel.startTyping()
      msg.channel.send("Pong! Avec " + client.ping + "ms").then(function(){msg.channel.stopTyping()});
      }
    if(command.toLowerCase() == "save"){
      msg.delete().then(function(){
        saveFile("emojiUsed", emojiUsed);
        saveFile("preferences", preferences);           
      });
      }
    if(command.toLowerCase() == "help"){
      var embed = new Discord.RichEmbed();
      embed.setAuthor("Kokonosebot", "https://cdn.discordapp.com/app-icons/421371597706887208/e15b3459004f5f1c846a537a67cbe1c0.png");
      embed.setColor("76D138");
      embed.set
      msg.channel.send(embed)
 
      }
    if(command == "stop") msg.channel.stopTyping()
    if(command.toLowerCase() == "$"){
      functions.customEmoji(msg, args, client)
      }
    if(command.toLowerCase() == "off"){
      preferences.emojiCustom[msg.author.id] = false;
      msg.reply("Votre demande a bien été prise en compte").then(function(){
        saveFile("preferences", preferences);
      })
      
      }
    if(command.toLowerCase() == "on"){
      preferences.emojiCustom[msg.author.id] = true;
      msg.reply("Votre demande a bien été prise en compte").then(function(){
        saveFile("preferences", preferences);
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
          }
          }
        if(command.toLowerCase() == "dj" && args[0] == "off"){
          msg.delete();
              msg.member.removeRole(msg.guild.roles.find("name", "DJ").id)
            
          }
        
          }
      
  
        
        
    
    
    }
  });
client.login(token.token);
client.on('error',console.error);
