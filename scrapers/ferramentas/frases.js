const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeFrasesLinks() {
  const url = 'https://www.frasesdobem.com.br/';
  const links = [];

  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    $('.listas-home').each((_, element) => {
      const link = $(element).find('a').first().attr('href');
      if (link && !links.includes(link)) {
        links.push(link);
      }
    });

    return links;
  } catch (error) {
    console.error('Erro ao fazer scraping dos links:', error.message);
    return [];
  }
}

async function scrapeFrasesPorCategoria(url) {
  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    const frases = [];

    $('.card').each((_, element) => {
      const frase = $(element).find('[itemprop="text"]').text().trim();
      const imagem = $(element).find('img').attr('src') || null;
      const autor = $(element).find('footer').text().trim() || null;

      if (frase) {
        frases.push({ frase, imagem, autor });
      }
    });

    return frases;
  } catch (error) {
    console.error(`Erro ao acessar página da categoria ${url}:`, error.message);
    return [];
  }
}

function limparNomeCategoria(link) {
  const partes = link.split('/');
  let slug = partes.filter(Boolean).pop(); // Última parte da URL
  slug = slug.toLowerCase()
             .replace(/[^\w\s-]/g, '') // remove caracteres especiais
             .replace(/\s+/g, '_')     // espaço vira _
             .replace(/-+/g, '_');     // hífen múltiplo vira _
  return slug;
}

async function mainfrases() {
  const links = await scrapeFrasesLinks();
  const resultado = {};

  for (const link of links) {
    const categoria = limparNomeCategoria(link);
    const frases = await scrapeFrasesPorCategoria(link);
    resultado[categoria] = frases;
  }

  const categorias = Object.keys(resultado);

  const finalResultado = {
    categorias,
    frasesPorCategoria: resultado
  };

return finalResultado
}

module.exports = { mainfrases };
