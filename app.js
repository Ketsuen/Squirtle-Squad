const Discord = require("discord.js");
const client = new Discord.Client();

const Keytwo = require("./keytwo");
const MaitreRenard = require("./maitrerenard");
const Pikastorep1preco = require("./pikestorep1preco");
const Pikastorep2preco = require("./pikestorep2preco");
const Pokemart = require("./pokemart");
const JelowStore = require("./jelowstore");
const Maxitoys = require("./maxitoys");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
let stableListe = {
  keytwo: {
    actif: true,
    tableau: [],
  },
  maitrerenard: {
    actif: true,
    tableau: [],
  },
  pikestorep1preco: {
    actif: true,
    tableau: [],
  },
  pikestorep2preco: {
    actif: true,
    tableau: [],
  },
  pokemart: {
    actif: true,
    tableau: [],
  },
  jelowstore: {
    actif: true,
    tableau: [],
  },
  maxitoys: {
    actif: true,
    tableau: [],
  },
};
let numSite = 0;

client.on("message", (message) => {
  if (message.content === "run") {
    setInterval(() => {
      stableListe.keytwo.actif = true;
      stableListe.maitrerenard.actif = true;
      stableListe.pikestorep1preco.actif = true;
      stableListe.pikestorep2preco.actif = true;
      stableListe.pokemart.actif = true;
      stableListe.jelowstore.actif = true;
      stableListe.maxitoys.actif = true;
    }, 300000);
    try {
      setInterval(async () => {
        let website = numSite % Object.values(stableListe).length;
        if (website == 0) {
          if (stableListe.keytwo.actif) {
            stableListe.keytwo.actif = false;
            stableListe.keytwo.tableau = await Keytwo(
              client,
              message,
              stableListe.keytwo
            );
          }
        } else if (website == 1) {
          if (stableListe.maitrerenard.actif) {
            stableListe.maitrerenard.actif = false;
            stableListe.maitrerenard.tableau = await MaitreRenard(
              client,
              message,
              stableListe.maitrerenard
            );
          }
        } else if (website == 2) {
          if (stableListe.pikestorep1preco.actif) {
            stableListe.pikestorep1preco.actif = false;
            stableListe.pikestorep1preco.tableau = await Pikastorep1preco(
              client,
              message,
              stableListe.pikestorep1preco
            );
          }
        } else if (website == 3) {
          if (stableListe.pikestorep2preco.actif) {
            stableListe.pikestorep2preco.actif = false;
            stableListe.pikestorep2preco.tableau = await Pikastorep2preco(
              client,
              message,
              stableListe.pikestorep2preco
            );
          }
        } else if (website == 4) {
          if (stableListe.pokemart.actif) {
            stableListe.pokemart.actif = false;
            stableListe.pokemart.tableau = await Pokemart(
              client,
              message,
              stableListe.pokemart
            );
          }
        } else if (website == 5) {
          if (stableListe.jelowstore.actif) {
            stableListe.jelowstore.actif = false;
            stableListe.jelowstore.tableau = await JelowStore(
              client,
              message,
              stableListe.jelowstore
            );
          }
        } else if (website == 6) {
          if (stableListe.maxitoys.actif) {
            stableListe.maxitoys.actif = false;
            stableListe.maxitoys.tableau = await Maxitoys(
              client,
              message,
              stableListe.maxitoys
            );
          }
        }
        numSite++;
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  }
});
// client.channels.cache.get("862724611246522388D").send("hello world");
client.login(process.env.TOKEN);
