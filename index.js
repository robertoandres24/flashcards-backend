const puppeteer = require('puppeteer');

(async () => {
  const width = 1920;
  const height = 1080;
  const browser = await puppeteer.launch({ headless: false, defaultViewport: { width, height } });
  const page = await browser.newPage();
  await page.setViewport({ width, height });

  await page.setUserAgent('UA-TEST');
  await page.goto('https://practicatest.cl/examen-teorico/clase-B');
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  // find button 'iniciar los test'
  const button = await page.waitForSelector('#id_test_dia');
  await button.click();
  // find button TEST
  const buttonTest = await page.waitForSelector('#box-list > table > tbody > tr:nth-child(1) > td.text-right > a');
  await buttonTest.scrollIntoView()
  await new Promise(r => setTimeout(r, 3000));

  await buttonTest.click();

  // wait for the url change
  await page.waitForFunction(() => {
    return window.location.href.includes('test-online');
  });

  const contentTest = await page.waitForSelector('#content-test')
  console.log("🚀 ~ file: index.js:32 ~ contentTest:", contentTest)
  await contentTest.scrollIntoView()
  await new Promise(r => setTimeout(r, 3000));

  await contentTest.evaluate(node => {
    const boxes = node.querySelectorAll('.well');
    const result = [...boxes].map(box => {
      const question = box.querySelector('.col-md-8 h4').textContent;
      const options = [...box.querySelectorAll('.col-md-8 .checklist li')].map(li => li.textContent);
      const optionCorrect = box.querySelector('.option_correct').textContent;
      const orderAnswer = box.querySelector('.order_answer').textContent;
      console.log("🚀 ~ file: index.js:43 ~ result ~ orderAnswer:", orderAnswer)
      console.log("🚀 ~ file: index.js:42 ~ result ~ optionCorrect:", optionCorrect)
      console.log("🚀 ~ file: index.js:41 ~ result ~ options:", JSON.stringify(options))
      console.log("🚀 ~ file: index.js:40 ~ result ~ question:", question)
      return { question, options, optionCorrect, orderAnswer }
    });
    console.log("🚀 ~ file: index.js:39 ~ result:", result)

  })

  // puppeteer screenshot
  await page.screenshot({ path: './example.png' });

  await browser.close();
})();