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
const pensador = async (query) => {
const url = `https://www.pensador.com/${query}/`;
const phrasesArray = [];
try {
const response = await axios.get(url);
const $ = cheerio.load(response.data);
const phrasesList = $('#phrasesList');
const phrases = phrasesList.find('.thought-card');
phrases.each((index, phrase) => {
const frase = $(phrase).find('.frase').text();
const autor = $(phrase).find('.author-name').text();
const nota = $(phrase).find('.thought-note').text();
const imagem = $(phrase).attr('data-src');
phrasesArray.push({
frase: frase,
autor: autor,
nota: nota,
imagem: imagem

});
});
return phrasesArray;
} catch (error) {
console.error(error);
throw new Error('Erro ao processar a requisição.');
}
};
module.exports = { pensador };
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