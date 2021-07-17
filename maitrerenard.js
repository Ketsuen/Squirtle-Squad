const puppeteer = require("puppeteer");
const comparer = require("./utils");

async function MaitreRenard(client, message, stableListe) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = (await browser.pages())[0];
  await page.setDefaultNavigationTimeout(0);
  await page.goto(
    "https://maitrerenard.shop/univers/cartes-a-collectionner/?min_price=14&max_price=100&count=50",
    { waitUntil: "load", timeout: 0 }
  );

  const listeArticles = await page.evaluate(() => {
    let listeArticles = [];
    let elements = document.querySelectorAll("ul li.product");
    for (element of elements) {
      listeArticles.push({
        name: element.querySelector("div.product-content h3").textContent,
        dispo: !element.querySelector("a").querySelector("div.out-of-stock")
          ? "dispo"
          : "pas dispo",
        url: element.querySelector("div.product-image a").href,
      });
    }

    return listeArticles;
  });
  var newArticles = await listeArticles.filter(await comparer(stableListe));
  for (let index = 0; index < newArticles.length; index++) {
    if (newArticles[index].dispo === "dispo" && stableListe.length > 0) {
      message.channel.send(
        "MAITRE RENARD\n" +
          newArticles[index].name +
          "\n" +
          newArticles[index].url
      );
    }
  }

  await page.close();
  await browser.close();
  console.log("maitrerenard" + listeArticles.length);

  return listeArticles;
}

module.exports = MaitreRenard;
