const puppeteer = require("puppeteer");
const comparer = require("./utils");

async function JelowStore(client, message, stableListe) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = (await browser.pages())[0];
  await page.setDefaultNavigationTimeout(0);

  await page.goto(
    "https://www.jelowstore.com/pokemon?Cat%C3%A9gorie=All&Filtre+personnalis%C3%A9=Pr%C3%A9commandes+%28PKM%29%2CDisplay%2CCoffrets%2FETB%2CDuopacks%2FTripacks%2CPok%C3%A9box%2FMini+Tins&page=1&sort=price_descending",
    {
      waitUntil: "load",
      timeout: 0,
    }
  );

  const listeArticles = await page.evaluate(() => {
    let listeArticles = [];
    let elements = document.querySelectorAll('[data-hook="product-list"] li');
    for (element of elements) {
      listeArticles.push({
        name: element.querySelector("h3").textContent,
        dispo:
          element.querySelector("button").textContent == "Rupture de stock"
            ? "pas dispo"
            : "dispo",
        url: element.querySelector("a").href,
      });
    }

    return listeArticles;
  });
  var newArticles = await listeArticles.filter(await comparer(stableListe));
  for (let index = 0; index < newArticles.length; index++) {
    if (newArticles[index].dispo === "dispo" && stableListe.length > 0) {
      message.channel.send(
        "JelowStore\n" + newArticles[index].name + "\n" + newArticles[index].url
      );
    }
  }

  await page.close();
  await browser.close();
  console.log("JelowStore" + listeArticles.length);
  return listeArticles;
}

module.exports = JelowStore;