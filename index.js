const { scrape } = require("./src");

exports.handler = async (event, context, callback) => {
  console.log("Starting Clip Scrape");
  console.log("Received event:", JSON.stringify(event, null, 2));

  await scrape(process.env.BUCKET_NAME);
  callback(null, "Finished");
};
