const Discord = require("discord.js"); 
const utils = require("./utils.js")
var emojiUsed = utils.createJsonFile("emojiUsed.json");

module.exports = {
    emoji: function (msg, args,) {
        
        
        msg.channel.startTyping()
        if(!args[0]){
          var request = emojiUsed[msg.guild.id][msg.author.id];
          var nickname = utils.getNickname(msg, msg.author.id);
          var avatarURL = msg.author.displayAvatarURL;
        }else if(args[0] == "global"){
          var request = emojiUsed[msg.guild.id].global;
          var nickname = msg.guild.name;
          var avatarURL = msg.guild.iconURL;
        }else if(emojiUsed[msg.guild.id][args[0].replace(/[<@!>]/g, '')]){
           var request = emojiUsed[msg.guild.id][args[0].replace(/[<@!>]/g, '')];
           var nickname = utils.getNickname(msg, args[0].replace(/[<@!>]/g, ''));
           var avatarURL = msg.guild.members.find("id", args[0].replace(/[<@!>]/g, '')).displayAvatarURL;
            }
        if(request){
          var emojiSorted = Object.keys(request).sort(function(a,b){return request[b]-request[a]});
          var embed = new Discord.RichEmbed({
            title : Object.values(request).reduce((a, b) => a + b) + " Emoji used",
          });
          embed.setColor([199, 184, 2]);
          embed.setAuthor(nickname, avatarURL);
          for(var i = 0; i<8; i++){
            if(emojiSorted[i]) embed.addField("\u200b", `<:${msg.guild.emojis.find("id", emojiSorted[i]).name}:${emojiSorted[i]}>  :  ${request[emojiSorted[i]]}`);
          }
          msg.channel.send(embed).then(function(){msg.channel.stopTyping()});
        }else{
          msg.channel.send("Aucune donnée pour cette entrée").then(function(){
            msg.channel.stopTyping()
          }
            
          );
            }
      
            },
    customEmoji: function (msg, args, client) {
        msg.delete()
        msg.channel.startTyping()
        var embed = new Discord.RichEmbed({
            title : "Liste des emoji",
            });
        embed.setAuthor(utils.getNickname(msg, msg.author.id), msg.author.displayAvatarURL);
        var customEmoji =  client.guilds.find("id", "434283741775396864").emojis.array()
        for(var i = 0; i< customEmoji.length; i+=2){
          var table = [":zero:", ":one:", ":two:", ":three:", ":four:", ":five:", ":six:", ":seven:", ":eight:", ":nine:", ":keycap_ten:", ":regional_indicator_a:", ":regional_indicator_b:", ":regional_indicator_c:", ":regional_indicator_d:", ":regional_indicator_e:", ":regional_indicator_f:", ":regional_indicator_g:", ":regional_indicator_h:"]
          if(!customEmoji[i+1]){
            var second = ""
            var secondname = ""
            table[i+1] = ""
            }else{
            secondname = customEmoji[i+1].name
           second = customEmoji[i+1]
            }
            embed.addField(table[i] + " : " + customEmoji[i] +customEmoji[i].name, table[i+1] + " : " + second + secondname)
             }
        msg.channel.send(embed).then(message =>{
            msg.channel.stopTyping()
            var i = 0
            loop(i)
            function loop(i){
            message.channel.fetchMessage(message.id).then(function(){
                message.react(customEmoji[i]).then(function(){
                if(i<customEmoji.length){
                    i++
                    loop(i)
                }
                })
                }).catch(console.error)
                }
            var filter = (reaction, user) => user.id === msg.author.id;
            var collectorReaction = message.createReactionCollector(filter, { time: 25000 });
            collectorReaction.on('collect', r => utils.postCustomEmoji(message, msg.author, r.emoji.name, client));
            var collectorMessage = new Discord.MessageCollector(msg.channel, m => m.author.id == msg.author.id, { time: 25000 })
            collectorMessage.on('collect', mesg => {
                    if(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j"].indexOf(mesg.content.toLowerCase()) != -1){
                        message.delete()
                        utils.postCustomEmoji(mesg, msg.author, customEmoji[["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j"].indexOf(mesg.content.toLowerCase())].name, client)
                     }
                })
            message.delete(25000)
        
            })
      
        }
  };
  