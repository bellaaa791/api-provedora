const axios = require('axios');
const cheerio = require('cheerio');

async function pegarNoticiasUOL() {
  try {
    const url = 'https://www.uol.com.br/';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const noticias = [];

    $('article.sectionGrid__grid__columnOne__item.headlineSub').each((i, el) => {
      const artigo = $(el);

      const link = artigo.find('a.hyperlink').attr('href') || '';
      const titulo = artigo.find('h3.title__element.headlineSub__content__title').text().trim();

      const img = artigo.find('figure.photograph img.photograph__image').attr('src') || '';
      const imgAlt = artigo.find('figure.photograph img.photograph__image').attr('alt') || '';

      noticias.push({
        titulo,
        link,
        img,
        imgAlt,
      });
    });

    return noticias;

  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    return [];
  }
}

module.exports = { pegarNoticiasUOL }