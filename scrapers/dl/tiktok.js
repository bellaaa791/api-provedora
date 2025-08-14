const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');

const tiksave = {
  getData: async (url) => {
    const apiUrl = 'https://tiksave.io/api/ajaxSearch';
    const data = qs.stringify({
      q: url,
      lang: 'id',
    });

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': '*/*',
        'User-Agent': 'MyApp/1.0',
        'Referer': 'https://tiksave.io/en',
        'X-Requested-With': 'XMLHttpRequest',
      },
    };

    try {
      const response = await axios.post(apiUrl, data, config);
      const html = response.data.data;
      const $ = cheerio.load(html);
      const downloadLinks = [];

      // Extraindo links de download
      $('.dl-action a').each((index, element) => {
        const link = $(element).attr('href');
        const label = $(element).text().trim();
        downloadLinks.push({ label, link });
        console.log("Todos os resultados:", downloadLinks);
        
      });

      return downloadLinks;
    } catch (error) {
      console.error('Error while fetching TikTok data:', error);
      return []; // Retorna um array vazio caso ocorra erro
    }
  },
};

// Alterar sendLinksToApi para retornar o resultado ao invés de enviar a resposta diretamente
const sendLinksToApi = async (url, linkIndex) => {
  if (!url || !url.includes('tiktok.com')) {
    throw new Error('URL inválida. Apenas URLs do TikTok são permitidas.');
  }

  try {
    const downloadLinks = await tiksave.getData(url);

    if (downloadLinks.length === 0) {
      throw new Error('Nenhum link encontrado.');
    }

    // Verificar se o índice de link é válido
    if (linkIndex <= 0 || linkIndex > downloadLinks.length) {
      throw new Error('Índice de link inválido.');
    }

    return {
      link: downloadLinks[linkIndex - 1].link,
      label: downloadLinks[linkIndex - 1].label
    };
  } catch (error) {
    throw error;  // Passa o erro para a função de chamada
  }
};


// Exemplo de uso dentro de uma rota Express
// app.get('/getTikTokLinks', (req, res) => {
//   const { url } = req.query;
//   sendLinksToApi(url, res);
// });

module.exports = { sendLinksToApi };
