const axios = require('axios');
const cheerio = require('cheerio');
async function scrapeErome_stalks(query) {
try {
const url = `https://www.erome.com/${query}`;
const { data } = await axios.get(url);
const $ = cheerio.load(data);
const avatar = $('.col-xs-12.text-center.relative img').attr('src');
const username = $('.col-xs-12.text-center.mb-8 .username').text().trim();
const userInfo = $('.col-xs-12.user-info.text-center');
const albums = userInfo.find('span').eq(0).text().trim();
const views = userInfo.find('span').eq(1).text().trim();
const followers = userInfo.find('span').eq(2).text().trim();
const description = $('.col-xs-12.text-center.mb-8').next('p').text().trim() || 'Descrição não encontrada';
const tabs = $('#tabs a');
const allTab = tabs.eq(0).text().trim();
const postsTab = tabs.eq(1).text().trim();
const repostsTab = tabs.eq(2).text().trim();
const links = [];
$('.col-xs-12.text-center a').each((index, element) => {
const href = $(element).attr('href');
if (href) {
links.push(href);
}
});
const resultado = {
Avatar: avatar,
Usuário: username,
Álbuns: albums,
Visualizações: views,
Seguidores: followers,
Descrição: description,
Tudo: allTab,
Posts: postsTab,
Reposts: repostsTab,
Links: links.length > 0 ? links : 'Nenhum link encontrado'
};
return resultado;
} catch (error) {
return { erro: 'Erro ao fazer o scraping', detalhes: error.message };
}
}

module.exports = { scrapeErome_stalks };
