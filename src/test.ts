import puppeteer from "puppeteer";

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();
    await page.goto("http://localhost:3000");

    const signInTest = async () => {
      await page.tracing.start({ path: 'trace.json' });
      await page.waitForSelector("#sign-in-button");
      let signInButton = await page.$("#sign-in-button");
      if (signInButton) {
        signInButton.click();
      } else {
        throw new Error("Sign In button not found");
      }
      await page.waitForSelector("form");
      await page.type('input[placeholder="Email"]', "ishan@123", {
        delay: 100,
      });
      await page.type('input[placeholder="Password"]', "123", { delay: 100 });
      let submitButton = await page.$("button");
      if (submitButton) {
        submitButton.click();
      } else {
        throw new Error("No submit button found");
      }
      await page.waitForSelector('input[placeholder="title"]');
      let token = await page.evaluate(() => localStorage.getItem("token"));
      if (token) {
        console.info("Sign in test passed succesfully");
      } else {
        console.error("Sign in test failed");
      }
      await page.tracing.stop();
    };
    await signInTest();

    const taskCreationTest = async () => {
      await page.waitForSelector("#task-list");
      let beforeTaskList = await page.$$("#task-list a");
      await page.type('input[placeholder="title"]', "New Task");
      await page.keyboard.press("Enter");
      await page.waitForTimeout(1000);
      let afterTaskList = await page.$$("#task-list a");
      if (afterTaskList.length - beforeTaskList.length === 1) {
        console.info("Task Creation Test Passed");
      } else {
        console.error("Task Creation Test Failed");
      }
      taskDeletionTest();
    };

    taskCreationTest();

    const taskDeletionTest = async () => {
      await page.waitForSelector("#task-list");
      let deleteBtn = await page.$(".bg-red-500");
      if (deleteBtn) {
        deleteBtn.click();
      } else {
        throw new Error("No delete button found");
      }
      await page.waitForTimeout(1000);
      console.info("Task Deletion Test Passed");
    };
  } catch (err) {
    console.log(err);
  }
})();
