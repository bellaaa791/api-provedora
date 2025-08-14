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
const axios = require('axios');
const cheerio = require('cheerio');


const baseUrl = 'https://www.seaart.ai';
async function getLinks(query) {
try {
const { data } = await axios.get(`https://www.seaart.ai/pt/search/${query}`);
const $ = cheerio.load(data);
const links = [];

$('a[href^="/explore/detail/"]').each((index, element) => {
const href = $(element).attr('href');
if (href) {
links.push(baseUrl + href);
}
});

return links;

} catch (error) {
console.error('Erro ao buscar links:', error.message);
return [];
}
}


async function getImageFromLink(link) {
try {
const { data } = await axios.get(link);
const $ = cheerio.load(data);

console.log(`Processando link: ${link}`);


const imageUrl = $('meta[property="og:image"]').attr('content') || $('img').attr('src');

const description = $('meta[property="og:description"]').attr('content') || $('h1').text();

if (imageUrl) {
return { imageUrl, description };
} else {
console.log('Imagem não encontrada para o link:', link);
return null;
}
} catch (error) {
console.error('Erro ao buscar imagem:', error.message);
return null;
}
}


async function main(query) {
const links = await getLinks(query);

if (links.length > 0) {
console.log(`Foram encontrados ${links.length} links. Buscando imagens...`);

const images = [];
for (const link of links) {
const imageData = await getImageFromLink(link);
if (imageData) {
images.push(imageData);
}
}


console.log(images);
} else {
console.log('Nenhum link encontrado.');
}
}

// Exporta as funções
module.exports = { getLinks, getImageFromLink, main };
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
