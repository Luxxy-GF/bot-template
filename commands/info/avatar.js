const Discord = require("discord.js");

module.exports = {
    name: "avatar",
    aliases: ["av"],
    category: "info",
    run: async (client, message, args) => {
        const avatar = message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 });
        message.channel.send(avatar)

    }
}