const puppeteer = require("puppeteer");
const comparer = require("./utils");

async function Cultura(client, message, stableListe) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = (await browser.pages())[0];
  await page.setDefaultNavigationTimeout(0);
  await page.waitForTimeout(5000);
  await page.goto(
    "https://www.cultura.com/jeux-video-consoles/cartes-a-jouer/cartes-pokemon.html?dir=desc&order=price&p=1",
    { waitUntil: "load", timeout: 0 }
  );
  await page.waitForSelector("#primary > ul");

  const listeArticles = await page.evaluate(() => {
    let listeArticles = [];
    let elements = document.querySelectorAll("div .category-products ul li");
    for (element of elements) {
      listeArticles.push({
        name: element.querySelector("h3").innerText,
        dispo:
          element.querySelector("small")?.innerText == "Indisponible"
            ? "pas dispo"
            : "dispo",
        url: element.querySelector("a").href,
      });
    }

    return listeArticles;
  });
  var newArticles = await listeArticles.filter(
    await comparer(stableListe.tableau)
  );
  for (let index = 0; index < newArticles.length; index++) {
    if (
      newArticles[index].dispo === "dispo" &&
      stableListe.tableau.length > 0
    ) {
      message.channel.send(
        "Pikastore\n" + newArticles[index].name + "\n" + newArticles[index].url
      );
    }
  }
  stableListe.actif = true;
  await page.close();
  await browser.close();
  console.log("Cultura" + listeArticles.length);

  return listeArticles;
}

module.exports = Cultura;