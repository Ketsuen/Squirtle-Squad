const puppeteer = require("puppeteer");
const comparer = require("./utils");

async function Pikastorep1dispo(client, message, stableListe) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = (await browser.pages())[0];
    await page.setDefaultNavigationTimeout(0);
    await page.goto(
      "https://www.pikastore.fr/cartes/jeux-de-cartes/pokemon/?order=product.price.desc&q=Disponibilit%C3%A9-En+stock/Langue-Fran%C3%A7ais",
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

    if (listeArticles) {
      var newArticles = await listeArticles.filter(
        await comparer(stableListe.tableau)
      );
      for (let index = 0; index < newArticles.length; index++) {
        if (
          newArticles[index].dispo === "dispo" &&
          stableListe.tableau.length > 0
        ) {
          message.channel.send(
            "Pikastore\n" +
              newArticles[index].name +
              "\n" +
              newArticles[index].url
          );
        }
      }
      console.log("pikastore1d" + listeArticles.length);
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
    await page.close();
    await browser.close();
  }
}

module.exports = Pikastorep1dispo;
