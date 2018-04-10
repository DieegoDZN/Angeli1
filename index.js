const botconfig = require("./botconfig.json");
const Discord = require("Discord.js");
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);

  let jsfile = files.filter(f => f.split(".").pop() === "js")
  if(jsfile.length <= 0){
    console.log("Couldn't find commands.");
    return;
  }

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);
  });

});
bot.on("ready", async () => {
  console.log(`${bot.user.username} is online!`)

  bot.user.setActivity("Esperando ser desenvolvido", {type: "Assistindo: "});
});

bot.on("message", async message => {
 if(message.author.bot) return;
 if(message.channel.type === "dm") return;

 let prefix = botconfig.prefix;
 let messageArray = message.content.split(" ");
 let cmd = messageArray[0];
 let args = messageArray.slice(1);

 if(cmd === `${prefix}kick`){

   let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
   if(!kUser) return message.channel.send("Usuário não encontrado.");
   let kReason = args.join(" ").slice(22);
   if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Não tem permissão.");
   if(kUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Essa pessoa não pode ser expulsada.");


   let kickEmbed = new Discord.RichEmbed()
   .setDescription("~Kick~")
   .setColor("#00FFFF")
   .addField("Usuário expulsado:", `${kUser} ID ${kUser.id}`)
   .addField("Author do punimento:", `<@${message.author.id}> ID ${message.author.id}`)
   .addField("Canal:", message.channel)
   .addField("Data:", message.createdAt)
   .addField("Motivo:", kReason);

   let kickChannel = message.guild.channels.find(`name`, "punições");
   if(!kickChannel) return message.channel.send("Não foi possível encontrar o canal de punições.");

   message.guild.member(kUser).kick(kReason);
   kickChannel.send(kickEmbed);

   return;

 }

  if(cmd === `${prefix}ban`){


    let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!bUser) return message.channel.send("Usuário não encontrado.");
    let bReason = args.join(" ").slice(22);
    if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.channel.send("Não tem permissão.");
    if(bUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Essa pessoa não pode ser banida.");


    let banEmbed = new Discord.RichEmbed()
    .setDescription("~Ban~")
    .setColor("#00FFFF")
    .addField("Usuário banido:", `${bUser} ID ${bUser.id}`)
    .addField("Author do banimento:", `<@${message.author.id}> ID ${message.author.id}`)
    .addField("Canal:", message.channel)
    .addField("Data:", message.createdAt)
    .addField("Motivo:", bReason);

    let incidentChannel = message.guild.channels.find(`name`, "punições");
    if(!incidentChannel) return message.channel.send("Não foi possível encontrar o canal de punições.");

    message.guild.member(bUser).ban(bReason);
    incidentChannel.send(banEmbed);



    return;
  }


 if(cmd === `${prefix}denunciar`){

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


 if(cmd === `${prefix}serverinfo`){

   let sicon = message.guild.iconURL;
   let serverembed = new Discord.RichEmbed()
   .setDescription("Informações do servidor")
   .setColor("#15f153")
   .setThumbnail(sicon)
   .addField("Nome do servidor", message.guild.name)
   .addField("Criado em", message.guild.createdAt)
   .addField("Você entrou em", message.member.joinedAt)
   .addField("Total de membros", message.guild.memberCount)

   return message.channel.send(serverembed);
 }


 if(cmd === `${prefix}botinfo`){

   let bicon = bot.user.displayAvatarURL;
   let botembed = new Discord.RichEmbed()
   .setDescription("InfoBOT.")
   .setColor("#15f153")
   .setThumbnail(bicon)
   .addField(bot.user.username ,"Bom, sou uma BOT muito legal.")
   .addField("Criado em", bot.user.createdAt);

   return message.channel.send(botembed);
}


});

bot.login(botconfig.token);
