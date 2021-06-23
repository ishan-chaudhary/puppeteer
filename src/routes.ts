import { Router } from "express";
import puppeteer from "puppeteer";

const router: Router = Router();

//Server side rendering of the front page of the react app using puppeteer
router.get("/", async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("http://localhost:3000");
  await page.waitForSelector("#task-list");
  let data = await page.content();
  await browser.close();
  return res.send(data);
});

export default router;
