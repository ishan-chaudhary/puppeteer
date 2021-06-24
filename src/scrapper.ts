import { launch, Browser, Page } from "puppeteer";

interface IScrapper {
  initialize({}:{ headless: boolean }): Promise<void>;
}

class Scrapper implements IScrapper {
  private URL: string;
  private browser: Browser | null = null;
  page: Page | null = null;

  constructor(URL: string) {
    this.URL = URL;
  }

  public async initialize(options: any) {
    this.browser = await launch(options);
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1280, height: 800 })
    await this.page.goto(this.URL,{waitUntil: 'networkidle2'});
  }
}

export default Scrapper;
