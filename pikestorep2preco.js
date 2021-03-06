const puppeteer = require("puppeteer");
const comparer = require("./utils");

async function Pikastorep2preco(client, stableListe) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = (await browser.pages())[0];
    await page.setDefaultNavigationTimeout(0);
    await page.goto(
      "https://www.pikastore.fr/cartes/jeux-de-cartes/pokemon/?page=2&product=2&q=Disponibilit%C3%A9-Precommande/Langue-Fran%C3%A7ais/Type+de+Produit-Booster-Coffret-Display-Pack-Pok%C3%A9box",
      { waitUntil: "load", timeout: 0 }
    );

    const listeArticles = await page.evaluate(() => {
      let listeArticles = [];
      let elements = document.querySelectorAll("ul li.product_item");
      for (element of elements) {
        listeArticles.push({
          name: element.querySelector("h3")?.textContent,
          dispo:
            element.querySelector("div.catalog-stock-not-available")
              ?.textContent === "Rupture de stock"
              ? "pas dispo"
              : "dispo",
          url: element.querySelector("h3 a").href,
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
            `"Pikastore\n" +
            ${newArticles[index].name} +
            "\n" +
            ${newArticles[index].url}`
          );
        }
      }
      console.log(
        "pikastorep2prec " +
          listeArticles.length +
          " " +
          stableListe.tableau.length
      );
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

module.exports = Pikastorep2preco;
