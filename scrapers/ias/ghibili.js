/* 
• Gerador de Imagens Ghibli (Scrape)
• Autor: SaaOfc's (Traduzido e adaptado por ChatGPT)
*/

const axios = require('axios');
const fs = require('fs');

const GeradorGhibli = async (prompt, estilo = 'Spirited Away') => {
  try {
    const estilosPermitidos = [
      'Spirited Away',
      "Howl's Castle",
      'Princess Mononoke',
      'Totoro'
    ];

    if (!estilosPermitidos.includes(estilo)) {
      throw new Error(`Estilo não encontrado. Use um dos seguintes: ${estilosPermitidos.join(', ')}`);
    }

    const resposta = await axios.post(
      'https://ghibliimagegenerator.net/api/generate-image',
      { prompt, style: estilo },
      {
        headers: {
          'content-type': 'application/json',
          'origin': 'https://ghibliimagegenerator.net',
          'referer': 'https://ghibliimagegenerator.net/generator',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/117.0 Safari/537.36'
        }
      }
    );

    if (resposta.data && resposta.data.imageData) {
      const imagemBase64 = resposta.data.imageData.split(',')[1];
      const buffer = Buffer.from(imagemBase64, 'base64');
      return buffer;
    } else {
      console.log('Erro: Nenhuma imageData encontrada na resposta');
    }
  } catch (erro) {
    console.error('Erro:', erro.message);
  }
};

module.exports = {
  GeradorGhibli
};
