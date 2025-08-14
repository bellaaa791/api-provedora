const axios = require('axios');
const cheerio = require('cheerio');


async function getmodsapk(query) {
    try {
        const url = 'https://getmodsapk.com/search?query=' + query;

        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        
        const $ = cheerio.load(data);
        
        const results = [];
        $('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.gap-4 a').each((index, element) => {
            const title = $(element).find('h3').text().trim();
            const link = $(element).attr('href');
            const image = $(element).find('img').attr('src');
            const size = $(element).find('.text-gray-600').last().text().trim();
            const version = $(element).find('.text-xs.text-gray-600').first().text().trim();

            results.push({ title, link, image, size, version });
        });

        for (const result of results) {
            const details = await scrapeDetails(result.link);
            result.details = details;  
        }

        return results
    } catch (error) {
        console.error('Erro ao fazer a requisição:', error.message);
    }
}

async function scrapeDetails(link) {
    try {
        const { data } = await axios.get(link, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = cheerio.load(data);
        
        const title = $('#post-title h1').text().trim();
       // const description = $('.text-gray-500').text().trim();
        const rating = $('#rating-info').text().trim();
        const downloadLink = $('a[href*="download"]').attr('href');

        return { title, rating, downloadLink };
    } catch (error) {
        console.error(`Erro ao fazer a requisição para ${link}:`, error.message);
        return null; 
    }
}

module.exports = { getmodsapk };