const Discord = require("discord.js"); 
const fs = require("fs");

function getNickname(msg, userId) {
  if(msg.guild.members.get(userId).nickname){
    var nickname = msg.guild.members.get(userId).nickname
    }else{
    var nickname = msg.guild.members.get(userId).user.username
    }
  return nickname
    
}
module.exports = {
  createJsonFile: function (fileName) {
      try{
        return file = require("../jsons/"+fileName);
      }catch (err){
        console.log(err)
        fs.appendFile("../jsons/" + fileName, '{}', function (err) {
          if (err) throw err;
          console.log('Saved!');  
        });
      }
    },
  getNickname: getNickname
        
    ,
  postCustomEmoji : function (msg, author, emoji, client){
      msg.channel.startTyping()
      msg.delete().then(function(){
        client.guilds.find("id", "434283741775396864").emojis.find("name", emoji);
        var embed = new Discord.RichEmbed();
        embed.setTitle(msg.content)
        embed.setAuthor(getNickname(msg, author.id), msg.author.displayAvatarURL);
        embed.setImage(client.guilds.find("id", "434283741775396864").emojis.find("name", emoji.toLowerCase()).url)
        msg.channel.send(embed).then(function(){
            msg.channel.stopTyping()
          })
      })
    },
    saveFile : function(fileName, file){
      fs.writeFile("./jsons/" + fileName +".json", JSON.stringify(file), function(err) {
        if (err) return console.log(err);
      });
      }
  };
  