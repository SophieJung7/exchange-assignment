import puppeteer from 'puppeteer';

let browser, page;

beforeEach(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  const response = await page.goto('http://localhost:3000', {
    waitUntil: 'load',
  });
  expect(response.status()).toBe(200);
  await page.waitForSelector('.company-name');
});

afterEach(async () => {
  await browser.close();
});

test('Company name appears', async () => {
  const text = await page.$eval('.company-name', (node) => node.innerText);
  expect(text).toEqual('Sophie Exchange');
});

// API
test('24h average price shows up', async () => {
  await page.waitForTimeout(1000);
  const text = await page.$eval('.avg-price', (node) => node.innerText);
  expect(text).not.toEqual('-');
});

// Websocket
test('Latest price shows up', async () => {
  const text = await page.$eval('.latest-price', (node) => node.innerText);
  expect(text).not.toEqual('-');
});

// Chart
test('Chart was generated', async () => {
  await page.waitForTimeout(1000);
  const text = await page.$eval(
    '.tv-lightweight-charts',
    (node) => node.innerText
  );
  expect(text).toEqual('\t\n\t\n\n\t\n\t');
});
