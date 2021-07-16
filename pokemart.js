const puppeteer = require("puppeteer");
const comparer = require("./utils");

async function Pokemart(client, message, stableListe) {
  const browser = await puppeteer.launch({ headless: false });

  const page = (await browser.pages())[0];
  await page.goto(
    "https://fr.pokemart.be/cat%C3%A9gorie-de-produit/proger-pokemon-fr/?instock=true"
  );

  const listeArticles = await page.evaluate(() => {
    let listeArticles = [];
    let elements = document.querySelectorAll("ul li.product");
    for (element of elements) {
      listeArticles.push({
        name: element.querySelector("h2").textContent,
        dispo:
          element.querySelector("a.button")?.textContent === "Rupture de stock"
            ? "pas dispo"
            : "dispo",
        url: element.querySelector("a").href,
      });
    }

    return listeArticles;
  });
  var newArticles = await listeArticles.filter(await comparer(stableListe));
  for (let index = 0; index < newArticles.length; index++) {
    if (newArticles[index].dispo === "dispo") {
      message.channel.send(
        "Pikastore\n" + newArticles[index].name + "\n" + newArticles[index].url
      );
    }
  }
  await page.close();
  await browser.close();
  console.log("pokemart");

  return listeArticles;
}

module.exports = Pokemart;
