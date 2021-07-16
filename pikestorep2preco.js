const puppeteer = require("puppeteer");
const comparer = require("./utils");

async function Pikastorep2preco(client, message, stableListe) {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox"],
  });

  const page = (await browser.pages())[0];
  await page.goto(
    "https://www.pikastore.fr/cartes/jeux-de-cartes/pokemon/?order=product.price.desc&page=2&q=Disponibilit%C3%A9-Precommande/Langue-Fran%C3%A7ais"
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
  console.log("pikastorep2prec");
  return listeArticles;
}

module.exports = Pikastorep2preco;
