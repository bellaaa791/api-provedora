const axios = require('axios');
const cheerio = require('cheerio');

async function translateText(text, lang = 'en') {
try {
const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`);
const data = await response.json();
return data[0][0][0]; 
} catch (error) {
console.error('Error translating text:', error);
return text; 
}
}


function formatKey(key) {
return key.replace(/\s+/g, '_').toLowerCase();
}


async function scrapeFlagInfo(query) {
try {

const translatedQuery = await translateText(query, 'en'); 
console.log(`Consultando sobre: ${translatedQuery}`);
const url = `https://flagpedia.net/${translatedQuery}`;
const { data } = await axios.get(url);
const $ = cheerio.load(data);
const result = {};
const flagName = $('h1').text().trim();
result.nome_bandeira = await translateText(flagName, 'pt'); 
const imageSrc = $('picture source[type="image/webp"]').attr('srcset')
const urlImagem = imageSrc.split(',').filter(src => src.includes('w1160')).pop().trim().split(' ')[0]
console.log(urlImagem);
result.imagem = `https://flagpedia.net${urlImagem}`;
const flagDescription = $('p.flag-content').text().trim();
result.descricao = await translateText(flagDescription, 'pt'); 
result.informacoes_pais = {};
const rows = $('table.table-dl tbody tr');
for (let i = 0; i < rows.length; i++) {
const key = $(rows[i]).find('th').text().trim();
const value = $(rows[i]).find('td').text().trim();

if (key && value) {
const translatedKey = await translateText(key, 'pt');
const translatedValue = await translateText(value, 'pt');
const formattedKey = formatKey(translatedKey);
result.informacoes_pais[formattedKey] = translatedValue;
}
}

return result
/*
 console.log({
status: true,
criador: "Tokyo",
resultado: result
});// Exibe tudo em um único objeto, no formato desejado
*/
} catch (error) {
console.error('Error scraping the website:', error);
}
}

module.exports = { scrapeFlagInfo }