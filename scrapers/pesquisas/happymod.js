const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeData(query) {
try {
const url = `https://baixar.happymod.com/search.html?q=${query}`;
const { data } = await axios.get(url);
const $ = cheerio.load(data);
const results = [];

const promises = $('a.app.clickable').map(async (index, element) => {
const appLink = $(element).attr('href');
const appPageUrl = `https://baixar.happymod.com${appLink}`;

try {
const response = await axios.get(appPageUrl);
const $kk = cheerio.load(response.data);


const appImage = $kk('div.app-icon img').attr('src') || 'Imagem não disponível';
const appName = $kk('div.app-name h1').text().trim();
const appVersion = appName.match(/v([0-9.]+)/) ? appName.match(/v([0-9.]+)/)[0] : 'Não encontrado';
const updateDate = $kk('span.has-small-font-size time').text().trim();
const downloadLink = `https://baixar.happymod.com` + ($kk('a.wp-block-button__link').attr('href') || '');
const downloadSize = $kk('a.wp-block-button__link').text().match(/\((.*?)\)/)
? $kk('a.wp-block-button__link').text().match(/\((.*?)\)/)[1]
: 'Não especificado';

const appInfo = {};
$kk('table.has-fixed-layout tbody tr').each((index, element) => {
const key = $kk(element).find('th').text().trim();
const values = $kk(element).find('td').map((i, el) => $kk(el).text().trim()).get(); 


let value = values.join(', '); 


if (key === 'Nome do pacote') {
value = value.replace(/\s+/g, ''); 
}

appInfo[key] = value;
});




const modInfo = [];
$kk('h3.wp-title').each((index, element) => {
const modVersion = $kk(element).text().trim();
const features = $kk(element).next('ul').find('li').map((i, el) => {
return $kk(el).text().trim();
}).get().join(', ');

if (modVersion && features) {
modInfo.push({ version: modVersion, features: features });
}
});


results.push({
foto: appImage,
nome: appName,
versao: appVersion,
data_ultima_atualizacao: updateDate,
link_baixar: downloadLink,
peso_tamanho: downloadSize,
info_app: appInfo,
info_mod: modInfo
});
} catch (error) {
console.error('Erro ao acessar página do aplicativo:', error);
}
}).get();


await Promise.all(promises);
return results;
} catch (error) {
console.error('Erro ao fazer o scraping:', error);
throw error;
}
}

module.exports = { scrapeData };