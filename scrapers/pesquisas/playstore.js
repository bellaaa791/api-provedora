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

const axios = require('axios')
const cheerio = require('cheerio')

const PlaystoreSearch = async (nome) => {
const url = `https://play.google.com/store/search?q=${nome}`
try {
const response = await axios.get(url)
const $ = cheerio.load(response.data)
const apps = []
$('.XUIuZ').each((index, element) => {
const app = {
nome: $(element).find('.vWM94c').text(),
desenvolvedor: $(element).find('.LbQbAe').text(),
avaliacao: $(element).find('.TT9eCd').text(),
reviews: $(element).find('.g1rdde').eq(0).text(),
downloads: $(element).find('.g1rdde').eq(1).text(),
classificacao: $(element).find('.g1rdde').eq(2).text(),
url: url

};
apps.push(app)
});
return apps
} catch (error) {
console.error(error);
}
}

module.exports = { PlaystoreSearch }

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
