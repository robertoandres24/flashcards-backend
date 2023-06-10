const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {

  function checkOptions(options, orderAnswer, optionCorrect) {
    const correctIndexes = optionCorrect.split(',').map(Number).map(i => i - 1);
    const expectedOrder = orderAnswer.split('').map(Number).map(i => i - 1);
    const selectedOptions = expectedOrder.map(i => options[i]);
    const selectedIndexes = [];
    for (let i = 0; i < correctIndexes.length; i++) {
      const correctIndex = correctIndexes[i];
      const selectedIndex = expectedOrder.indexOf(correctIndex);
      if (selectedIndex >= 0 && selectedIndexes.indexOf(selectedIndex) < 0) {
        selectedIndexes.push(selectedIndex);
      }
    }
    return selectedIndexes;
  }

  const browser = await puppeteer.launch({ headless: false, args: ['--start-maximized'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mi-User-Agent-String-Aquí');
  await page.exposeFunction('checkOptions', checkOptions);
  await page.setViewport({ width: 1920, height: 1080 });

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

  await contentTest.scrollIntoView()
  await new Promise(r => setTimeout(r, 3000));

  const mappedQuestions = await contentTest.evaluate(node => {
    const boxes = node.querySelectorAll('.well');
    const mappedQuestionPromises = [...boxes].map(async box => {
      const question = box.querySelector('.col-md-8 h4').textContent;
      const options = [...box.querySelectorAll('.col-md-8 .checklist li')].map(li => li.textContent);
      const optionCorrect = box.querySelector('.option_correct').textContent;
      const orderAnswer = box.querySelector('.order_answer').textContent;
      const correctAnswers = await checkOptions(options, orderAnswer, optionCorrect);
      return { question, options, correctAnswers };

    });
    return Promise.all(mappedQuestionPromises);
  })
  // console.log("🚀 ~ file: index.js:66 ~ mappedQuestions ~ mappedQuestions:", JSON.stringify(mappedQuestions))
  // write the mapped questions to a file
  console.log('writing to file...');
  // write file with current date and time

  const now = new Date();
  const filename = `file_${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}_${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}.json`;

  await browser.close();

  fs.writeFile(filename, JSON.stringify(mappedQuestions), 'utf8', (err) => {
    if (err) {
      console.log(`Error writing file: ${err}`);
    } else {
      console.log('File saved');
      console.log('closing file...');
      fs.closeSync(fs.openSync(filename, 'r'));
      console.log('File closed');
    }
  });
})();