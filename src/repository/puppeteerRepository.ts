import puppeteer from "puppeteer";

const getHtml = async (url: string) : Promise<string> => {
  console.log(`[puppeteerRepository.getHtml] get html with ${url}`);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: 'networkidle2',
  });
  let bodyHTML = await page.evaluate(() => document.body.innerHTML);
  await browser.close();
  console.log(`[puppeteerRepository.getHtml] return html`);
  return bodyHTML;
}

export default {
  getHtml,
};
