const puppeteer = require("puppeteer");
const comparer = require("./utils");

async function Keytwo(client, message, stableListe) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = (await browser.pages())[0];
  await page.setDefaultNavigationTimeout(0);

  await page.goto("https://www.keytwo.be/?page=2", {
    waitUntil: "load",
    timeout: 0,
  });

  const listeArticles = await page.evaluate(() => {
    let listeArticles = [];
    let elements = document.querySelectorAll(
      '[data-hook="product-list-grid-item"]'
    );
    for (element of elements) {
      listeArticles.push({
        name: element.querySelector("h3").textContent,
        dispo:
          element.querySelector("button span").textContent ==
          "Ajouter au panier"
            ? "dispo"
            : "pas dispo",
        url: element.querySelector("a").href,
      });
    }

    return listeArticles;
  });
  var newArticles = await listeArticles.filter(await comparer(stableListe));
  for (let index = 0; index < newArticles.length; index++) {
    if (newArticles[index].dispo === "dispo") {
      message.channel.send(
        "KEYTWO\n" + newArticles[index].name + "\n" + newArticles[index].url
      );
    }
  }

  await page.close();
  await browser.close();
  console.log("keytwo" + listeArticles.length);
  return listeArticles;
}

module.exports = Keytwo;
