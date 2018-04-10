const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

  let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if(!rUser) return message.channel.send("Não foi possível encontrar o usuário");
  let reason = args.join(" ").slice(22);

  let reportEmbed = new Discord.RichEmbed()
  .setDescription("Reports")
  .setColor("#00FFFF")
  .addField("Usuário denunciado:", `${rUser} ID: ${rUser.id}`)
  .addField("Quem denunciou:", `${message.author} ID: ${message.author.id}`)
  .addField("Canal:", message.channel)
  .addField("Data:", message.createdAt)
  .addField("Motivo:", reason);

  let reportschannel = message.guild.channels.find(`name`, "reports");
  if(!reportschannel) return message.channel.send("Não foi possível encontrar o canal de denúncias.");

  message.delete().catch(O_o=>{});
  reportschannel.send(reportEmbed);
  return;
}


 module.exports.help = {
   name: "reports"
 }
