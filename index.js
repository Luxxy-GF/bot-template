const Discord = require("discord.js");
const { Client, Collection } = require("discord.js");
const config = require("./config.json");
const client = new Client({
    disableEveryone: true,
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});
const prefix = (config.prefix)
const fs = require("fs");
require("dotenv").config()



client.on("ready", async () => {
    console.log(`${client.user.tag} is online :)`)
    client.user.setActivity(`Sex With Sophie`, { type: "PLAYING"})
})

client.commands = new Collection();
client.aliases = new Collection();
const cooldowns = new Collection();

client.categories = fs.readdirSync("./commands/");
["command"].forEach(handler => {
    require(`./handlers/command`)(client);
});



client.on("message", async message => {

    if (message.author.bot) return;
    if (!message.guild) return; 

    if(!message.content.startsWith(prefix)&& message.content.startsWith(client.user.id)) return message.reply(`My Prefix is: **\`${prefix}\`**, type \`${prefix}help\` for more information!`); //if the messages is not a command and someone tags the bot, then send an info msg
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    
    if (cmd.length === 0) return;
    
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));

   
    if (command)
    {
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Collection());
        }
        
        const now = Date.now();
        const timestamps = cooldowns.get(command.name); 
        const cooldownAmount = (command.cooldown || 1) * 1000;
      
        if (timestamps.has(message.author.id)) { 
          const expirationTime = timestamps.get(message.author.id) + cooldownAmount; 
      
          if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000; 
            return message.reply( 
              `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`
            );
          }
        }
      
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
      try{
        command.run(client, message, args, message.author, args.join(" "), prefix);

      }catch (error){
        console.log(error)
        return message.reply("Something went wrong while, running the: `" + command.name + "` command")
      }
    } 
});

client.login(process.env.TOKEN)