/*
tokyo && CATALYST APIS

suporte: wa.me/553285076326
canal principal no whatsapp: 
https://whatsapp.com/channel/0029VaYz83R6mYPV4dV55h3H

canal de atualização sobre a api:
https://whatsapp.com/channel/0029VanYkzWInlqY71vrov1h

tokyo && CATALYST APIS


*/


const axios = require('axios');
const cheerio = require('cheerio');

const scrapeDafont = async (query) => {
const url = `https://www.dafont.com/pt/search.php?q=${query}}`
try {
const { data } = await axios.get(url);
const $ = cheerio.load(data);
const fonts = [];
$('.lv1left').each((i, element) => {
const fontName = $(element).find('.highlight').text().trim();
const author = $(element).find('a').attr('href');
const category = $(element).next('.lv1right').text().trim();
const downloads = $(element).next().next('.lv2right').find('.light').text().trim();
const downloadLink = $(element).parent().find('.dlbox .dl').attr('href');
fonts.push({
NomeFonte: fontName,
autor: author,
categoria: category,
downloads: downloads,
linkdownload: `https:${downloadLink}`
});
});

return fonts
} catch (error) {
console.error('Erro ao fazer scraping:', error);
}
}

module.exports = { scrapeDafont };

/*
tokyo && CATALYST APIS

suporte: wa.me/553285076326
canal principal no whatsapp: 
https://whatsapp.com/channel/0029VaYz83R6mYPV4dV55h3H

canal de atualização sobre a api:
https://whatsapp.com/channel/0029VanYkzWInlqY71vrov1h

tokyo && CATALYST APIS


*/

