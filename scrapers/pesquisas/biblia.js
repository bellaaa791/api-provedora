const axios = require('axios');
const cheerio = require('cheerio');

async function pegarImagemDoVersiculo(urlVersiculo) {
  try {
    const { data } = await axios.get(urlVersiculo);
    const $ = cheerio.load(data);

    // Seleciona a imagem que está na página do versículo
    // Pela sua descrição, parece ser a única <img> relevante, então vamos pegar a primeira que estiver dentro da página
    // Se quiser algo mais específico, pode ajustar o seletor

    const img = $('img[fetchpriority="high"]').first();
    const src = img.attr('src');
    const alt = img.attr('alt');

    if (src) {
      // O src pode ser relativo ou absoluto. Normalmente é absoluto, mas confere.
      const urlImagem = src.startsWith('http') ? src : `https://www.bibliaon.com${src}`;
      return { url: urlImagem, alt };
    }
    return null;
  } catch (err) {
    console.error('Erro ao buscar imagem do versículo:', err.message);
    return null;
  }
}

async function scrapeBibliaComImagem(query) {
  const url = `https://www.bibliaon.com/pesquisa.php?q=${encodeURIComponent(query)}`;

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const resultados = [];

    const promessas = $('.destaque.color-box').map(async (i, elem) => {
      const versiculoTexto = $(elem).find('p[id^="versiculo-"]').text().trim();
      const linkRelativo = $(elem).find('p[id^="versiculo-"] a').attr('href');
      const link = linkRelativo ? `https://www.bibliaon.com${linkRelativo}` : null;

      let imagem = null;
      if (link) {
        imagem = await pegarImagemDoVersiculo(link);
      }

      return {
        texto: versiculoTexto,
        link,
        imagem,
      };
    }).get();

    // Espera todas as requisições das imagens terminarem
    const resultadosComImagem = await Promise.all(promessas);

    return resultadosComImagem;
  } catch (error) {
    console.error('Erro ao buscar dados:', error.message);
    return [];
  }
}

// Teste a função
module.exports = { scrapeBibliaComImagem }