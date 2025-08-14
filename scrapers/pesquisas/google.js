const axios = require('axios');
const cheerio = require('cheerio');

async function google(query) {
    try {
        const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        const response = await axios.get(url, {
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
    }
});

        const html = response.data;
        const $ = cheerio.load(html);
        const results = [];

        $("div.tF2Cxc").each((index, element) => {
            const titulo = $(element).find("h3").text().trim();
            const link = $(element).find("a").attr("href");
            const descricao = $(element).find(".VwiC3b").text().trim();

            if (titulo && link) {
                results.push({ titulo, link, descricao });
            }
        });

        return results;
    } catch (error) {
        console.error("Error fetching search results:", error.message);
        return [];
    }
}

module.exports = { google };
