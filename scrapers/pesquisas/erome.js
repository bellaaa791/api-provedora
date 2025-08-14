const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeErome(query) {
try {
const url = 'https://www.erome.com/search?q=' + query
const { data } = await axios.get(url, {
headers: {
'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}
});

const $ = cheerio.load(data);
const results = [];

$('.album').each((index, element) => {
//<img alt="Mulata gordinha cacheada muito peituda e rabuda #8nH5kl3c" width="250" height="250" src="https://s83.erome.com/1685/r9NaNziv/thumbs/8nH5kl3c.jpeg?v=1702043161" class="album-thumbnail img-responsive active lasyload initial loaded" data-src="https://s83.erome.com/1685/r9NaNziv/thumbs/8nH5kl3c.jpeg?v=1702043161" data-was-processed="true">

const thumbnail = $(element).find('img.album-thumbnail').attr('data-src') || $(element).find('img.album-thumbnail').attr('src');


const views = $(element).find('.album-bottom-views').text().trim() || '0'
//<span class="album-images"><i class="fa fa-camera"></i>35</span>
const fotosCount = $(element).find('.album-images').text().trim();
const videosCount = $(element).find('.album-videos').text().trim() || '0'
const title = $(element).find('a.album-title').text().trim();
const link = $(element).find('a.album-link').attr('href'); // Corrigido para buscar o link correto
const user = $(element).find('.album-user').text().trim();

if (thumbnail && title && link) {
results.push({
titulo: title,
link,
thumbnail,
visualizacoes: views,
videos: videosCount,
fotos: fotosCount,
autor: user
});
}
});

//console.log(results);
return results
} catch (error) {
console.error('Erro ao buscar os dados:', error.message);
}
}

//scrapeErome();

module.exports = { scrapeErome } 
