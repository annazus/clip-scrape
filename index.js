const { scrape } = require("./src");

exports.handler = async (event, context, callback) => {
  console.log("Starting Clip Scrape");
  console.log("Received event:", JSON.stringify(event, null, 2));

  await scrape(process.env.BUCKET_NAME);
  callback(null, "Finished");
};
// (async () => {
//   await scrape();
// })();
// const chromium = require("chrome-aws-lambda");
// const clipperRaceStandingsUrl =
//   "https://www.clipperroundtheworld.com/race/standings";

// exports.handler = async (event, context) => {
//   let result = null;
//   let browser = null;

//   try {
//     browser = await chromium.puppeteer.launch({
//       args: chromium.args,
//       defaultViewport: chromium.defaultViewport,
//       executablePath: await chromium.executablePath,
//       headless: chromium.headless
//     });

//     let page = await browser.newPage();

//     await page.goto(clipperRaceStandingsUrl);

//     result = await page.title();
//     console.log(result);
//   } catch (error) {
//     return context.fail(error);
//   } finally {
//     if (browser !== null) {
//       await browser.close();
//     }
//   }

//   return context.succeed(result);
// };
