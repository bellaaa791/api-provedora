const axios = require('axios');
const cheerio = require('cheerio');

async function memezeira(query) {
const BASE_URL = 'https://www.myinstants.com';
const BASE_SEARCH = `${BASE_URL}/pt/search/?name=${encodeURIComponent(query)}`;

try {
const resultado = await axios.get(BASE_SEARCH);
const $ = cheerio.load(resultado.data);
const results = [];

$('button.small-button[onclick^="play"]').each((i, button) => {
const $button = $(button);
const soundUrl = $button.attr('onclick').match(/play\('([^']+)/)[1];
const link = $button.nextAll('a.instant-link.link-secondary');
results.push({
title: link.text(),
soundUrl: `${BASE_URL}${soundUrl}`,
pageUrl: `${BASE_URL}${link.attr('href')}`
});
});

if (results.length === 0) {
return { status: true, mensagem: 'Nenhum resultado encontrado.' };
}
return { status: true, resultado: results };
} catch (error) {
if (error.response && error.response.status === 404) {
return { status: false, mensagem: 'Nenhum resultado encontrado. (Erro 404)' };
}

return { status: false, mensagem: 'Ocorreu um erro ao buscar os dados.', detalhe: error.message };
}
}

module.exports = {
memezeira
};
