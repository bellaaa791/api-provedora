const axios = require('axios');
const cheerio = require('cheerio');

async function pegarNoticiasEstadao() {
try {
const url = 'https://www.estadao.com.br/';
const { data } = await axios.get(url);
const $ = cheerio.load(data);

const noticias = [];

// Seleciona o container principal da manchete-dia-a-dia
$('div.styles__Tag-sc-1kqcjew-0.styles__TagStyled-sc-1kqcjew-1.dEOAIa.eGqAHu.col-12.col-xl-8').each((i, el) => {
const container = $(el);

// Título principal e link
const linkPrincipal = container.find('div.manchete-dia-a-dia-block-container a').attr('href') || '';
const tituloPrincipal = container.find('h2.headline b').text().trim();
const subheadline = container.find('p.subheadline').text().trim();

// Lista de notícias relacionadas (bullets)
const relacionadas = [];
container.find('ul.bullets li.bullet').each((i, el) => {
const bullet = $(el);
const link = bullet.find('a').attr('href') || '';
const titulo = bullet.find('a').attr('title') || bullet.find('a').text().trim();
relacionadas.push({ titulo, link });
});

noticias.push({
tituloPrincipal,
linkPrincipal,
subheadline,
relacionadas,
});
});

return noticias;

} catch (error) {
console.error('Erro ao pegar notícias do Estadão:', error);
return [];
}
}

module.exports = { pegarNoticiasEstadao }
