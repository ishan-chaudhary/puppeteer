import Scrapper from "./scrapper";
import fs from "fs";
import { Page } from "puppeteer";
const Sprinklr = new Scrapper("https://www.sprinklr.com/");

const getAllLogos = async (page: Page) => {
  await page.waitForSelector(".css-1rqngeq");
  await page.screenshot({ path: "sprinklr3.png" });
  let imageTags = await page.$$eval(
    ".gatsby-image-wrapper picture img",
    (images) => {
      return images.map((image) => {
        return "http:" + image.getAttribute("src");
      });
    }
  );
  if (imageTags) {
    fs.writeFile(
      "sprinklrPartners.json",
      JSON.stringify(imageTags),
      function (err) {
        if (err) {
          console.log(err);
        } else {
          console.info("Scrapped Logos");
        }
      }
    );
  }
};

const getFounderImage = async (page: Page) => {
  await page.waitForSelector(".css-hslo1v");
  await page.hover(
    "#gatsby-focus-wrapper>div:nth-of-type(1)>div>div>div:nth-of-type(1)>div:nth-of-type(5)>div"
  );
  await page.waitForSelector(".css-zlc80m");
  let hoverLinks: Array<string | null> = [];
  hoverLinks = await page.$$eval(".css-zlc80m", (links) => {
    return links.map((link) => {
      return link.getAttribute("href");
    });
  });
  await page.goto("http://sprinklr.com" + hoverLinks[1]);
  await page.waitForSelector(".person-image-container img");
  let founderImage = await page.$eval(".person-image-container img", (img) => {
    return img.getAttribute("src");
  });
  console.log("Founder Image Link:", founderImage);
};

const startSraping = async () => {
  await Sprinklr.initialize({ headless: false, defaultViewport: null });
  const { page } = Sprinklr;
  if (page) {
    await getAllLogos(page);
    await getFounderImage(page);
  }
};

startSraping();
