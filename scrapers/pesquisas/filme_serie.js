const axios = require('axios');
const cheerio = require('cheerio');

async function fetchData(query) {
try {
const url = 'https://lendafilmes.com/index.php?s=' + query;
console.log('Iniciando...');

const response = await axios.get(url);
const html = response.data;
const $ = cheerio.load(html);

const items = [];


const elements = $('#capas_pequenas .capa_larga');
for (let i = 0; i < elements.length; i++) {
const el = elements[i];
const titulo = $(el).find('h3 a').text().trim();
const link = $(el).find('h3 a').attr('href');
const imageUrl = $(el).find('a img').attr('src');

const details = $(el).find('.info_capa p').text().trim();


const genero = details.match(/Gênero:\s*(.*)/)?.[1]?.split(',')[0]?.trim() || 'N/A';
const dublada = details.match(/Dublada.*?(Legendada|Dual Áudio)?/)?.[0]?.trim() || 'N/A';
const qualidade = details.match(/Qualidade:\s*(.*)/)?.[1]?.trim() || 'N/A';
const formato = details.match(/Formato:\s*(.*)/)?.[1]?.trim() || 'N/A';
const data = details.match(/\d{2}\/\d{2}\/\d{4}/)?.[0] || 'N/A';

try {

const detailResponse = await axios.get(link);
const detailHtml = detailResponse.data;
const $g = cheerio.load(detailHtml);


const sinopseDiv = $g('#sinopse');
const sinopse = sinopseDiv.find('p').text().trim();


items.push({
titulo,
link,
imageUrl,
genero,
dublada,
qualidade,
formato,
data,
sinopse,
});
} catch (innerError) {
console.error(`Erro ao buscar detalhes em ${link}:`, innerError.message);
}
}

return items; 
} catch (error) {
console.error('Erro:', error.message);
return []; 
}
}

module.exports = { fetchData }