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


async function scrapePostDetails(link) {
try {
const { data } = await axios.get(link);
const $ = cheerio.load(data);

const date = $('.post-meta span').first().text().trim();
const content = $('.entry').text().trim();

const tags = [];
$('.post-tags .tag-list li a').each((index, element) => {
tags.push($(element).text().trim());
});

const images = [];
$('.entry img').each((index, element) => {
const imgSrc = $(element).attr('src');
if (imgSrc) {
images.push(imgSrc);
}
});

return { date, content, tags, images };
} catch (error) {
console.error(`Erro ao acessar a postagem: ${link}`, error);
return { date: null, content: null, tags: [], images: [] };
}
}

async function scrape(query) {
const url = `https://www.nerding.com.br/search?q=${query}`;
try {
const { data } = await axios.get(url);
const $ = cheerio.load(data);
const posts = [];

const postElements = $('.item-content');

for (let i = 0; i < postElements.length; i++) {
const element = postElements[i];

const categoria = $(element).find('.label-post-category').text().trim();
const titulo = $(element).find('.title a').text().trim();
const sumario = $(element).find('.summary').text().trim();
const link = $(element).find('.title a').attr('href');
const absoluteLink = link.startsWith('http') ? link : `https://www.nerding.com.br${link}`;

const { date, content, tags, images } = await scrapePostDetails(absoluteLink);

posts.push({
categoria,
titulo,
sumario,
link: absoluteLink,
date,
content,
tags,
images,
});
}

return posts;
} catch (error) {
console.error('Erro ao acessar a página:', error);
return [];
}
}
module.exports = { scrape };

/*
tokyo && CATALYST APIS

suporte: wa.me/553285076326
canal principal no whatsapp: 
https://whatsapp.com/channel/0029VaYz83R6mYPV4dV55h3H

canal de atualização sobre a api:
https://whatsapp.com/channel/0029VanYkzWInlqY71vrov1h

tokyo && CATALYST APIS


*/
