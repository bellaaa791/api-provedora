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
const fetchGroupDetails = async (groupUrl) => {
try {
const response = await axios.get(groupUrl);
const html = response.data;
const $ = cheerio.load(html);
const description = $('.classGrupoTexto').first().find('p').text().trim();
const rules = [];
$('.grupoRegras li').each((index, element) => {
rules.push($(element).text().trim());
});
const groupLink = $('.btn-custom').attr('href');
return { description, rules, groupLink };
} catch (error) {
console.error('Error fetching group details:', error);
return { description: 'N/A', rules: [], groupLink: 'N/A' };
}
};


const getGruposkk = async (url) => {
try {
const response = await axios.get(url);
const html = response.data;
const $ = cheerio.load(html);
const grupos = [];
const promises = [];
$('.aneTemaAa85daad_D1ca43').each((index, element) => {
const link = $(element).find('a').attr('href');
const title = $(element).find('a').attr('title');
const imgSrc = $(element).find('img').attr('src');
const category = $(element).find('.aneTemaAa85daad_44981a').text().trim();
const promise = fetchGroupDetails(link).then(details => {
return {
titulo: title || 'N/A', 
imagem: imgSrc || 'N/A',  
categoria: category || 'N/A', 
descrição: details.description || 'N/A',
regras: details.rules || [],
link_grupo: details.groupLink || 'N/A'

};
});
promises.push(promise);
});
const resultados = await Promise.all(promises);
return resultados;
} catch (error) {
console.error('Error fetching data:', error);
return [];
}
};


const gpwhatsapp = async (query) => {
const url = 'https://gruposdewhatss.app/?s=' + query
return await getGruposkk(url);  
};
module.exports = { gpwhatsapp };

/*
tokyo && CATALYST APIS

suporte: wa.me/553285076326
canal principal no whatsapp: 
https://whatsapp.com/channel/0029VaYz83R6mYPV4dV55h3H

canal de atualização sobre a api:
https://whatsapp.com/channel/0029VanYkzWInlqY71vrov1h

tokyo && CATALYST APIS


*/

