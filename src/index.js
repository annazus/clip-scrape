const puppeteer = require("puppeteer");
const fs = require("fs");
const { padZero, timeout, getFileNameSuffix } = require("./utils");
const clipperRaceStandingsUrl =
  "https://www.clipperroundtheworld.com/race/standings";

const fileNameSuffix = getFileNameSuffix();

const getScreenShot = async (page, feature) => {
  const selector = `#main #${feature}`;
  await page.waitForSelector(selector);
  await page.click(selector);
  await timeout(1000);
  await page.screenshot({ path: `${feature}${fileNameSuffix}.png` });
  console.log(`${feature} screenshot saved.`);
};

const getStandings = async page => {
  const tableHandle = await page.waitForSelector("#currentstandings");
  const html = await page.evaluate(table => table.innerHTML, tableHandle);

  fs.writeFile(`standings${fileNameSuffix}.txt`, html, err => {
    if (err) throw err;
    console.log("Saved Standings");
  });
};
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(clipperRaceStandingsUrl);

  await page.waitForSelector("body > .cookie-banner > .cookie-right > .reject");
  await page.click("body > .cookie-banner > .cookie-right > .reject");

  await page.waitForSelector("#main #fitmap");
  await page.click("#main #fitmap");

  await getScreenShot(page, "swell");
  await getScreenShot(page, "temp");
  await getScreenShot(page, "wind");

  await getStandings(page);
  await browser.close();
})();
