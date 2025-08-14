const axios = require('axios');
const cheerio = require('cheerio');

async function scrapePoderHoje() {
  try {
    const url = 'https://www.poder360.com.br/poder-hoje/';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const noticias = [];

    // Cada notícia está dentro do <li> dentro da lista .archive-list__list
    $('.archive-list__list > li').each((_, el) => {
      const noticia = {};

      const container = $(el).find('.archive-list__text--poder-hoje > h2');

      // Horário - dentro de <span class="archive-list__date archive-list__date--color">
      noticia.horario = container.find('span.archive-list__date').text().trim();

      // Tag especial, ex: Opinião, dentro de span.box-queue__special-tag
      noticia.tagEspecial = container.find('span.box-queue__special-tag').text().trim() || null;

      // Autor - link com classe fw-bold (se existir)
      noticia.autor = container.find('a.fw-bold').text().trim() || null;

      // Título e link da notícia - o último <a> dentro do container (não autor)
      // Pode ter dois <a>: autor e título, então pegar o último <a>
      const links = container.find('a');
      if (links.length) {
        const tituloLink = links.last();
        noticia.titulo = tituloLink.text().trim();
        noticia.link = tituloLink.attr('href');
      } else {
        noticia.titulo = null;
        noticia.link = null;
      }

      noticias.push(noticia);
    });

    return(noticias);
  } catch (error) {
    console.error('Erro ao buscar notícias:', error.message);
  }
}

module.exports = { scrapePoderHoje } 
