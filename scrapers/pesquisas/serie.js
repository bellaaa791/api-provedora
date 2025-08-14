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

// URL do site que será raspado

async function scrapeTMDb(query) {
    try {
    const url = 'https://www.themoviedb.org/search?language=pt-BR&query=' + query
    
        // Faz a requisição à URL
        const { data } = await axios.get(url);

        // Carrega o HTML com Cheerio
        const $ = cheerio.load(data);

        // Array para armazenar os resultados
        const results = [];

        // Seleciona todos os elementos com a classe .card.v4.tight
        $('.card.v4.tight').each((i, element) => {
            const titleElement = $(element).find('.details .title a h2').first();
            const title = titleElement.clone().children().remove().end().text().trim(); // Remove o conteúdo do span no título
            const originalTitle = titleElement.find('.title').text().trim().replace(/[()]/g, ''); // Pega o texto do span do título original
            const releaseDate = $(element).find('.details .title .release_date').text().trim();
            const overview = $(element).find('.details .overview p').text().trim();
            const image = $(element).find('.poster img').attr('src');
            const link = 'https://www.themoviedb.org' + $(element).find('.poster a').attr('href');

            // Adiciona os dados ao array
            results.push({
                title,
                originalTitle,
                releaseDate,
                overview,
                image,
                link,
            });
        });

        // Exibe os resultados
        return results
//        console.log(results);
    } catch (error) {
        console.error('Erro ao raspar dados:', error.message);
    }
}

module.exports = { scrapeTMDb }
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
