const axios = require('axios');
const cheerio = require('cheerio');

async function pegarLinksCategorias() {
  const url = 'https://www.piadas.net/';
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const links = [];
  $('.jokelist .related ul li a').each((i, el) => {
    const href = $(el).attr('href');
    if (href) {
      links.push(href.startsWith('http') ? href : `https://www.piadas.net${href}`);
    }
  });

  return links;
}

async function pegarPiadasDeCategoria(urlCategoria) {
  try {
    const { data } = await axios.get(urlCategoria);
    const $ = cheerio.load(data);

    const piadas = [];

    $('.listjoke').each((i, el) => {
      const titulo = $(el).find('h3').text().trim();
      const texto = $(el).find('p.joketext').text().trim();
      piadas.push({ titulo, texto });
    });

    return piadas;
  } catch (error) {
//    console.error(`Erro ao pegar piadas da categoria ${urlCategoria}:`, error.message);
    return [];
  }
}

function limparNomeCategoria(url) {
  const partes = url.split('/');
  let slug = partes.filter(Boolean).pop().replace('.html', '');
  slug = slug.toLowerCase()
             .replace(/[^\w\s-]/g, '')
             .replace(/\s+/g, '_')
             .replace(/-+/g, '_');
  return slug;
}

async function mainpiadas() {
  const categoriasUrls = await pegarLinksCategorias();
  const todasPiadasPorCategoria = {};

  for (const urlCategoria of categoriasUrls) {
    const piadas = await pegarPiadasDeCategoria(urlCategoria);
    const nomeCategoria = limparNomeCategoria(urlCategoria);
    todasPiadasPorCategoria[nomeCategoria] = piadas;
  }

  const categorias = Object.keys(todasPiadasPorCategoria);

  const resultadoFinal = {
    categorias,
    piadasPorCategoria: todasPiadasPorCategoria
  };

return resultadoFinal
}

module.exports = { mainpiadas };
