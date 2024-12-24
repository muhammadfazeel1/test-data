const puppeteer = require('puppeteer-core');
const express = require('express');
const fs = require('fs'); 
const app = express();

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
    <html lang="en">
    <body>
      <h1>Enter Web App 1 URL</h1>
      <form action="/start" method="POST">
        <input type="text" id="url" name="url" value="https://devgsportal.neom.com/pages/profile/edit" required><br><br>
        <button type="submit">Start Automation</button>
      </form>
    </body>
    </html>
  `);
});

app.post('/start', async (req, res) => {
  const { url } = req.body;

  if (!url || !url.startsWith('http')) {
    res.send('<h2 style="color:red;">A valid URL is required</h2><a href="/">Go back</a>');
    return;
  }

  let browser;
  try {
    console.log(`Connecting to existing Chrome browser...`);
    browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });

    const pages = await browser.pages();
    const page = pages.find(p => p.url().includes('devgsportal.neom.com')) || pages[0];

    let maxRetries = 3;
    for (let i = 0; i < maxRetries; i++) {
      try {
        console.log(`Opening URL (attempt ${i + 1}): ${url}`);
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
        console.log('Page loaded successfully');
        break;
      } catch (error) {
        if (i === maxRetries - 1) throw error; 
        console.log(`Retrying navigation (${i + 1}/${maxRetries}) due to:`, error.message);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    const pageContent = await page.content();
    fs.writeFileSync('page-content.html', pageContent, 'utf8');
    console.log('Page content saved.');

    const userData = await page.evaluate(() => ({
      name: document.querySelector('input[name="name"]')?.value || '',
      nationality: document.querySelector('#nationality-select')?.value || 'Saudi Arabia',
      countryCode: document.querySelector('#country-code-select')?.value || '966',
      idNumber: document.querySelector('input[name="idNumber"]')?.value || '',
      mobileNo: document.querySelector('input[name="mobileNo"]')?.value || ''
    }));

    console.log('Extracted Data:', userData);

    // === Open Web App 2 and Paste Data === //
    const page2 = await browser.newPage();
    await page2.goto('https://stg-gsportal.neom.com/pages/profile/edit', { waitUntil: 'networkidle0' });

    console.log('Opened Web App 2 to paste data...');

    // ** 1. Populate Name **
    if (userData.name) {
      console.log('Setting Name:', userData.name);
      await page2.waitForSelector('input[name="name"]', { timeout: 10000 });
      await page2.type('input[name="name"]', userData.name, { delay: 100 });
    }

    // ** 2. Handle Nationality Dropdown **
    if (userData.nationality) {
      try {
        console.log('Setting Nationality:', userData.nationality);
        await page2.click('#nationality-select'); // Click the input field
        await page2.type('#nationality-select', userData.nationality, { delay: 100 });
        await page2.waitForSelector('li[role="option"]', { timeout: 10000 });
        await page2.evaluate((value) => {
          const options = Array.from(document.querySelectorAll('li[role="option"]'));
          const optionToSelect = options.find(option => option.textContent.includes(value));
          if (optionToSelect) optionToSelect.click();
        }, userData.nationality);
      } catch (error) {
        console.log('Error selecting nationality:', error.message);
      }
    }

    // ** 3. Handle Country Code Dropdown **
    if (userData.countryCode) {
      try {
        console.log('Setting Country Code:', userData.countryCode);
        await page2.click('#country-code-select'); 
        await page2.type('#country-code-select', userData.countryCode, { delay: 100 });
        await page2.waitForSelector('li[role="option"]', { timeout: 10000 });
        await page2.evaluate((value) => {
          const options = Array.from(document.querySelectorAll('li[role="option"]'));
          const optionToSelect = options.find(option => option.textContent.includes(value));
          if (optionToSelect) optionToSelect.click();
        }, userData.countryCode);
      } catch (error) {
        console.log('Error selecting country code:', error.message);
      }
    }

    // ** 4. Populate Mobile Number **
    if (userData.mobileNo) {
      console.log('Setting Mobile Number:', userData.mobileNo);
      await page2.waitForSelector('input[name="mobileNo"]', { timeout: 10000 });
      await page2.type('input[name="mobileNo"]', userData.mobileNo, { delay: 100 });
    }

    // ** 5. Populate ID Number (If Available) **
    if (userData.idNumber) {
      const idFieldExists = await page2.$('input[name="idNumber"]');
      if (idFieldExists) {
        console.log('Setting ID Number:', userData.idNumber);
        await page2.waitForSelector('input[name="idNumber"]', { timeout: 10000 });
        await page2.type('input[name="idNumber"]', userData.idNumber, { delay: 100 });
      } else {
        console.log('ID Number field not found, skipping.');
      }
    }

    console.log('Data pasted successfully into Web App 2');
    res.send('<h2 style="color:green;">Automation complete! Data pasted successfully into Web App 2</h2><a href="/">Go back</a>');

  } catch (error) {
    console.error('Error:', error);
    res.send(`<h2 style="color:red;">An error occurred: ${error.message}</h2><a href="/">Go back</a>`);
  } finally {
    if (browser) {
      await browser.disconnect();
    }
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
