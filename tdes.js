const puppeteer = require("puppeteer");
const comparer = require("./utils");

async function Tdes(client, stableListe) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = (await browser.pages())[0];
    await page.setDefaultNavigationTimeout(0);
    await page.goto(
      "https://3des.bzh/?s=display+pokemon&post_type=product&product_cat=0",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    const listeArticles = await page.evaluate(() => {
      let listeArticles = [];
      let elements = document.querySelectorAll(
        "div.products div.product-wrapper"
      );
      for (element of elements) {
        listeArticles.push({
          name: element.querySelector("h3 a").textContent,
          dispo: "dispo",
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
            `"3DES\n" +
            ${newArticles[index].name} +
            "\n" +
            ${newArticles[index].url}`
          );
        }
      }
      console.log(
        "3des " + listeArticles.length + " " + stableListe.tableau.length
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

module.exports = Tdes;
