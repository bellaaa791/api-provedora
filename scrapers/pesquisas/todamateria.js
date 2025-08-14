const axios = require('axios');
const cheerio = require('cheerio');

async function buscarDetalhesDoArtigo(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Título do artigo (h1.article-title)
    const tituloDoArtigo = $('h1.article-title').text().trim();

    // Nome e cargo do autor
    const nomeDoAutor = $('.author-article--t__info__name span').text().trim();
    const cargoDoAutor = $('.author-article--t__info__job-title').text().trim();

    // Primeiro parágrafo do artigo (primeiro <p> dentro da div#article .content-wrapper)
    const primeiroParagrafo = $('#article .content-wrapper > p').first().text().trim();

    // Imagem principal do artigo (primeira imagem dentro da div#article)
    const imagemPrincipal = $('#article img').first();
    const urlImagem = imagemPrincipal.attr('src') || null;
    const textoAlternativoImagem = imagemPrincipal.attr('alt') || null;

    return {
      tituloDoArtigo,
      nomeDoAutor,
      cargoDoAutor,
      primeiroParagrafo,
      urlImagem,
      textoAlternativoImagem,
    };
  } catch (error) {
    console.error(`Erro ao acessar artigo ${url}:`, error.message);
    return null;
  }
}

async function rasparTodaMateria(consulta) {
  const url = `https://www.todamateria.com.br/?s=${encodeURIComponent(consulta)}`;

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const resultados = [];

    const itensCartao = $('.card-grid .card-item').toArray();

    for (const elemento of itensCartao) {
      const el = $(elemento);

      const titulo = el.find('.card-title b').text().trim();
      const descricao = el.find('.card-description').text().trim();
      let link = el.attr('href');
      if (link && link.startsWith('/')) {
        link = 'https://www.todamateria.com.br' + link;
      }

      // Busca detalhes do artigo na URL do resultado
      const detalhesDoArtigo = await buscarDetalhesDoArtigo(link);

      resultados.push({
        titulo,
        descricao,
        link,
        ...detalhesDoArtigo,
      });
    }

    return resultados;
  } catch (error) {
    console.error('Erro ao acessar o site:', error.message);
    return [];
  }
}

module.exports = { rasparTodaMateria };
