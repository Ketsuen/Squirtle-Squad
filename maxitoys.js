const puppeteer = require("puppeteer");
const comparer = require("./utils");

async function Maxitoys(client, message, stableListe) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = (await browser.pages())[0];
    await page.setDefaultNavigationTimeout(0);

    await page.goto(
      "https://www.maxitoys.fr/jouets/jeux-de-societe/cartes-a-collectionner.html?mt_hero=Pok%C3%A9mon&product_list_limit=96",
      {
        waitUntil: "load",
        timeout: 0,
      }
    );

    const listeArticles = await page.evaluate(() => {
      let listeArticles = [];
      let elements = document.querySelectorAll("ol li.product");
      for (element of elements) {
        listeArticles.push({
          name: element.querySelector("h2").innerText,
          dispo: "dispo",
          url: element.querySelector("a").href,
        });
      }

      return listeArticles;
    });

    stableListe.actif = true;
    await page.close();
    await browser.close();

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
            "Maxitoys\n" +
              newArticles[index].name +
              "\n" +
              newArticles[index].url
          );
        }
      }
      console.log(
        "Maxitoys " + listeArticles.length + " " + stableListe.tableau.length
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
    if (page) {
      await page.close();
      await browser.close();
    }
  }
}

module.exports = Maxitoys;
