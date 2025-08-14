
 const { chromium } = require('playwright');

async function searchApp(query) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const searchUrl = `https://gamedva.com/?s=${encodeURIComponent(query)}`;
  await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

  const results = await page.$$eval('article.ap-post.ap-lay-c', articles => {
    return articles.map(article => {
      const link = article.querySelector('a')?.href;
      const img = article.querySelector('div.meta-image img')?.src;
      const name = article.querySelector('p.entry-title')?.innerText.trim();

      return { name, link, img };
    });
  });

  const finalResults = [];

  for (const item of results) {
    const detailPage = await browser.newPage();
    await detailPage.goto(item.link, { waitUntil: 'domcontentloaded' });

    // Download Link
    const downloadLink = await detailPage.$eval(
      'div.wp-block-buttons.aligncenter.download a.progr',
      el => el.href
    ).catch(() => null);

    // Table Details
    const tableData = await detailPage.$$eval('figure.wp-block-table.is-style-stripes table tbody tr', rows => {
      const details = {};
      rows.forEach(row => {
        const key = row.querySelector('td strong')?.innerText.trim();
        const valueTd = row.querySelectorAll('td')[1];

        if (key && valueTd) {
          const link = valueTd.querySelector('a')?.href;
          const text = valueTd.innerText.trim();

          details[key] = link ? { text, link } : text;
        }
      });
      return details;
    });

    finalResults.push({
      ...item,
      downloadLink,
      details: tableData
    });

    await detailPage.close();
  }

  await browser.close();
  return finalResults;
}

module.exports = { searchApp };
