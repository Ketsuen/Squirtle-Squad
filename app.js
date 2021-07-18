const puppeteer = require("puppeteer");

const Discord = require("discord.js");
const client = new Discord.Client();

const Keytwo = require("./keytwo");
const MaitreRenard = require("./maitrerenard");
const Pikastorep1preco = require("./pikestorep1preco");
const Pikastorep2preco = require("./pikestorep2preco");
const Pikastorep1dispo = require("./pikestore1dispo");
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
  pikastorep1disponible: {
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
    try {
      setInterval(async () => {
        let website = numSite % Object.values(stableListe).length;
        if (website == 0) {
          if (stableListe.keytwo.actif) {
            stableListe.keytwo.actif = false;
            let tempArray1 = [];
            tempArray1 = await Keytwo(
              client,
              message,
              stableListe.keytwo.tableau
            );
          }
          if (tempArray1.length > 0) {
            stableListe.keytwo.tableau = tempArray1;
            stableListe.keytwo.actif = true;
          }
        } else if (website == 1) {
          if (stableListe.maitrerenard.actif) {
            stableListe.maitrerenard.actif = false;
            let tempArray2 = [];
            tempArray2 = await MaitreRenard(
              client,
              message,
              stableListe.maitrerenard.tableau
            );
          }
          if (tempArray2.length > 0) {
            stableListe.maitrerenard.tableau = tempArray2;
            stableListe.maitrerenard.actif = true;
          }
        } else if (website == 2) {
          if (stableListe.pikestorep1preco.actif) {
            stableListe.pikestorep1preco.actif = false;
            let tempArray3 = [];
            tempArray3 = await Pikastorep1preco(
              client,
              message,
              stableListe.pikestorep1preco.tableau
            );
          }
          if (tempArray3.length > 0) {
            stableListe.pikestorep1preco.tableau = tempArray3;
            stableListe.pikestorep1preco.actif = true;
          }
        } else if (website == 3) {
          if (stableListe.pikestorep2preco.actif) {
            stableListe.pikestorep2preco.actif = false;
            let tempArray4 = [];
            tempArray4 = await Pikastorep2preco(
              client,
              message,
              stableListe.pikestorep2preco.tableau
            );
          }
          if (tempArray4.length > 0) {
            stableListe.pikestorep2preco.tableau = tempArray4;
            stableListe.pikestorep2preco.actif = true;
          }
        } else if (website == 4) {
          if (stableListe.pikastorep1disponible.actif) {
            stableListe.pikastorep1disponible.actif = false;
            let tempArray5 = [];
            tempArray5 = await Pikastorep1dispo(
              client,
              message,
              stableListe.pikastorep1disponible.tableau
            );
          }
          if (tempArray5.length > 0) {
            stableListe.pikastorep1disponible.tableau = tempArray5;
            stableListe.pikastorep1disponible.actif = true;
          }
        } else if (website == 5) {
          if (stableListe.pokemart.actif) {
            stableListe.pokemart.actif = false;
            let tempArray6 = [];
            tempArray6 = await Pokemart(
              client,
              message,
              stableListe.pokemart.tableau
            );
          }
          if (tempArray6.length > 0) {
            stableListe.pokemart.tableau = tempArray6;
            stableListe.pokemart.actif = true;
          }
        } else if (website == 6) {
          if (stableListe.jelowstore.actif) {
            stableListe.jelowstore.actif = false;
            let tempArray7 = [];
            tempArray7 = await JelowStore(
              client,
              message,
              stableListe.jelowstore.tableau
            );
          }
          if (tempArray7.length > 0) {
            stableListe.jelowstore.tableau = tempArray7;
            stableListe.jelowstore.actif = true;
          }
        } else if (website == 7) {
          if (stableListe.maxitoys.actif) {
            stableListe.maxitoys.actif = false;
            let tempArray8 = [];
            tempArray8 = await Maxitoys(
              client,
              message,
              stableListe.maxitoys.tableau
            );
          }
          if (tempArray8.length > 0) {
            stableListe.maxitoys.tableau = tempArray8;
            stableListe.maxitoys.actif = true;
          }
        }
        numSite++;
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  }
});
// client.channels.cache.get("862724611246522388D").send("hello world");
client.login(process.env.TOKEN);
