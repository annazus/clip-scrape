const chromium = require("chrome-aws-lambda");
const AWS = require("aws-sdk");

const fs = require("fs");
const { padZero, timeout, getFileNameSuffix } = require("./utils");
const clipperRaceStandingsUrl =
  "https://www.clipperroundtheworld.com/race/standings";

let fileNameSuffix;
const s3 = new AWS.S3();

const getScreenShot = async (bucketName, page, feature) => {
  const selector = `#main #${feature}`;
  await page.waitForSelector(selector);
  await page.click(selector);
  await timeout(1000);
  const content = await page
    .screenshot
    // { path: `${feature}${fileNameSuffix}.png` }
    ();
  const params = {
    Bucket: bucketName,
    Key: `${feature}${fileNameSuffix}.png`,
    Body: content,
    ContentType: "image/jpeg"
  };
  s3.putObject(params, (err, data) => {
    if (err) throw err;
    console.log("Saved Standings");
  });
  console.log(`${feature} screenshot saved.`);
};

const getStandings = async (bucketName, page) => {
  const tableHandle = await page.waitForSelector("#currentstandings");
  const content = await page.evaluate(table => table.innerHTML, tableHandle);

  const params = {
    Bucket: bucketName,
    Key: `standings${fileNameSuffix}.txt`,
    Body: content
  };
  s3.putObject(params, (err, data) => {
    if (err) throw err;
    console.log("Saved Standings");
  });
  // fs.writeFile(`standings${fileNameSuffix}.txt`, html, err => {
  //   if (err) throw err;
  //   console.log("Saved Standings");
  //   console.log(html);
  // });
};

const scrape = async bucketName => {
  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless
  });
  fileNameSuffix = getFileNameSuffix();
  console.log("File name suffix is", fileNameSuffix);
  // const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(clipperRaceStandingsUrl);

  await page.waitForSelector("body > .cookie-banner > .cookie-right > .reject");
  await page.click("body > .cookie-banner > .cookie-right > .reject");

  await page.waitForSelector("#main #fitmap");
  await page.click("#main #fitmap");

  await getScreenShot(bucketName, page, "swell");
  await getScreenShot(bucketName, page, "temp");
  await getScreenShot(bucketName, page, "wind");

  await getStandings(bucketName, page);
  await browser.close();
};

module.exports = { scrape };
