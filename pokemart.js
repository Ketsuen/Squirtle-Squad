const puppeteer = require("puppeteer");
const comparer = require("./utils");

async function Pokemart(client, message, stableListe) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = (await browser.pages())[0];
    await page.setDefaultNavigationTimeout(0);
    await page.goto(
      "https://fr.pokemart.be/cat%C3%A9gorie-de-produit/proger-pokemon-fr/?instock=true",
      { waitUntil: "load", timeout: 0 }
    );
    await page.waitForSelector("#primary > ul");

    const listeArticles = await page.evaluate(() => {
      let listeArticles = [];
      let elements = document.querySelectorAll("ul li.product");

      for (element of elements) {
        listeArticles.push({
          name: element.querySelector("h2").textContent,
          dispo:
            element.querySelector("a.button")?.textContent ===
            "Rupture de stock"
              ? "pas dispo"
              : "dispo",
          url: element.querySelector("a").href,
        });
      }

      return listeArticles;
    });

    if (listeArticles !== undefined && stableListe.tableau !== undefined) {
      var newArticles = await listeArticles.filter(
        await comparer(stableListe.tableau)
      );
      for (let index = 0; index < newArticles.length; index++) {
        if (
          newArticles[index].dispo === "dispo" &&
          stableListe.tableau.length > 0
        ) {
          client.channels.cache.get(`862724611246522388`).send(
            `"Pokemart\n" +
              newArticles[index].name +
              "\n" +
              newArticles[index].url`
          );
        }
      }
      stableListe.actif = true;
      await page.close();
      await browser.close();
      return listeArticles;
    } else {
      stableListe.actif = true;
      await page.close();
      await browser.close();
      return [];
    }
  } catch (error) {
    console.log(error);
    stableListe.actif = true;
  }
}

module.exports = Pokemart;
