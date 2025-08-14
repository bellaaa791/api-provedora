/*
Feito por tokyo

#daki infos
#daki apis
#2024

#suporte: +55 32 98507-6325

canal youtube: @134_tokyo

canal 1 whatsapp:
https://whatsapp.com/channel/0029VaYz83R6mYPV4dV55h3H

canap 2 whatsapp: 
https://whatsapp.com/channel/0029VaGdVmn4inowmCI3OU3Z




*/
const cheerio = require('cheerio')
const axios = require('axios')
async function searchPornhub(query) {
try {
const response = await axios.get(`https://www.pornhub.com/video/search?search=${encodeURIComponent(query)}`);
const html = response.data;
const $ = cheerio.load(html);
const result = [];
$('ul#videoSearchResult > li.pcVideoListItem').each(function(a, b) {
const _title = $(b).find('a').attr('title');
const _duration = $(b).find('var.duration').text().trim();
const _views = $(b).find('var.views').text().trim();
const _url = 'https://www.pornhub.com' + $(b).find('a').attr('href');
const hasil = { title: _title, duration: _duration, views: _views, url: _url };
result.push(hasil);
});
return { result };
} catch (error) {
console.error('Ocurrió un error al buscar en Pornhub:', error);
return { result: [] };
}
}
module.exports = { searchPornhub }
/*
Feito por tokyo

#daki infos
#daki apis
#2024

#suporte: +55 32 98507-6325

canal youtube: @134_tokyo

canal 1 whatsapp:
https://whatsapp.com/channel/0029VaYz83R6mYPV4dV55h3H

canap 2 whatsapp: 
https://whatsapp.com/channel/0029VaGdVmn4inowmCI3OU3Z




*/