const puppeteer = require("puppeteer");

const Discord = require("discord.js");
const client = new Discord.Client();

const Keytwo = require("./keytwo");
const MaitreRenard = require("./maitrerenard");
const Pikastorep1preco = require("./pikestorep1preco");
const Pikastorep2preco = require("./pikestorep2preco");
const Pikastorep1dispo = require("./pikestore1dispo");
const Pokemart = require("./pokemart");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
let stableListe = {
  keytwo: [],
  // maitrerenard: [],
  // pikestorep1preco: [],
  // pikestorep2preco: [],
  // pikastorep1disponible: [],
  // pokemart: [],
};
let numSite = 0;
client.on("message", (message) => {
  if (message.content === "play") {
    setInterval(async () => {
      let website = numSite % Object.values(stableListe).length;
      if (website == 0)
        stableListe.keytwo = await Keytwo(client, message, stableListe.keytwo);
      else if (website == 1)
        stableListe.maitrerenard = await MaitreRenard(
          client,
          message,
          stableListe.maitrerenard
        );
      else if (website == 2)
        stableListe.pikestorep1preco = await Pikastorep1preco(
          client,
          message,
          stableListe.pikestorep1preco
        );
      else if (website == 3)
        stableListe.pikestorep2preco = await Pikastorep2preco(
          client,
          message,
          stableListe.pikestorep2preco
        );
      else if (website == 4)
        stableListe.pikastorep1disponible = await Pikastorep1dispo(
          client,
          message,
          stableListe.pikastorep1disponible
        );
      else if (website == 5)
        stableListe.pokemart = await Pokemart(
          client,
          message,
          stableListe.pokemart
        );
      numSite++;
    }, 10000);
  }
});
// client.channels.cache.get("862724611246522388D").send("hello world");
client.login("MjY4ODc5NzQyOTA2NjYyOTIz.WHa7xg.1MkebqJl5j2ufQDtVMIW0D28cF0");
// client.login(process.env.TOKEN);
