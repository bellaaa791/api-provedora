const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeG1() {
  try {
    const url = 'https://g1.globo.com/';
    const { data } = await axios.get(url);

    const $ = cheerio.load(data);

    const noticias = [];

    $('.feed-post-body').each((i, el) => {
      const noticia = {};

      // Título
      noticia.titulo = $(el).find('h2 > a.feed-post-link > p').text().trim();

      // Link
      noticia.link = $(el).find('h2 > a.feed-post-link').attr('href');

      // Resumo (testa se existe antes)
      const resumoEl = $(el).find('.feed-post-body-resumo > p');
      noticia.resumo = resumoEl.length ? resumoEl.text().trim() : '';

      // Imagem
      noticia.imagem = $(el).find('.feed-media-wrapper img').attr('src') || '';

      // Data/hora - pegar só o primeiro texto dentro do container (evita duplicação)
      const dataHoraEl = $(el).find('.feed-post-datetime').first();
      noticia.dataHora = dataHoraEl.text().trim();

      // Região
      const regiaoEl = $(el).find('.feed-post-metadata-section');
      noticia.regiao = regiaoEl.length ? regiaoEl.text().trim() : '';

      noticias.push(noticia);
    });

return noticias
  } catch (error) {
    console.error('Erro ao buscar notícias:', error.message);
  }
}

module.exports = { scrapeG1 }
