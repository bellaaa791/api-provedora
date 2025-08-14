/*
Feito por tokyo

#daki infos
#daki apis
#2024

#suporte: +55 32 98507-6325

canal youtube: @134_tokyo

canal 1 whatsapp:
https://whatsapp.com/channel/0029VaYz83R6mYPV4dV55h3H

canap 2 whatsapp: 
https://whatsapp.com/channel/0029VaGdVmn4inowmCI3OU3Z




*/
const axios = require('axios');
const cheerio = require('cheerio');

const rasparDados = async (query) => {
  try {
    const url = 'https://getstickerpack.com/stickers?query=' + query
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const pacotesFigurinhas = [];

    // Selecionar todos os elementos com a classe 'sticker-pack-cols'
    const elementosPacotes = $('.sticker-pack-cols');

    for (const elemento of elementosPacotes) {
      const pacoteElemento = $(elemento);

      // Capturar o link, imagem e título
      const link = pacoteElemento.find('a').attr('href');
      const imagemPack = pacoteElemento.find('img').attr('src');
      const titulo = pacoteElemento.find('.title').text().trim();

      // Fazer scraping da página do pacote
      const figurinhas = await rasparPacoteFigurinhas(link);

      // Adicionar os dados ao array de pacotes
      pacotesFigurinhas.push({ titulo, imagem_pack: imagemPack, link, figurinhas });
    }

//    console.log(pacotesFigurinhas);
    return pacotesFigurinhas
  } catch (erro) {
    console.error('Erro ao realizar o scraping:', erro.message);
  }
};

// Função para fazer scraping de cada pacote
const rasparPacoteFigurinhas = async (url) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const figurinhas = [];

    // Selecionar os elementos <img> na div .row
    $('.row img').each((_, elemento) => {
      const imagemMenor = $(elemento).attr('src'); // URL da imagem menor
      const imagemMaior = $(elemento).attr('data-src-large'); // URL da imagem maior
      const descricao = $(elemento).attr('alt'); // Texto alternativo

      figurinhas.push({ imagem_menor: imagemMenor, imagem_maior: imagemMaior, descricao });
    });

    return figurinhas;
  } catch (erro) {
    console.error(`Erro ao acessar o pacote em ${url}:`, erro.message);
    return [];
  }
};

module.exports = { rasparDados }
/*
Feito por tokyo

#daki infos
#daki apis
#2024

#suporte: +55 32 98507-6325

canal youtube: @134_tokyo

canal 1 whatsapp:
https://whatsapp.com/channel/0029VaYz83R6mYPV4dV55h3H

canap 2 whatsapp: 
https://whatsapp.com/channel/0029VaGdVmn4inowmCI3OU3Z




*/
