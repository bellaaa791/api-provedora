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
async function scrapenpmjs(query) {
const url = 'https://www.npmjs.com/search?q=' + query
try {
const { data } = await axios.get(url)
const $ = cheerio.load(data)
const numPackages = $('h2._0007f802').text().trim()
const packages = []
$('section.ef4d7c63').each((index, element) => {
const packageName = $(element).find('h3.db7ee1ac').text().trim()
const packageDesc = $(element).find('p._8fbbd57d').text().trim()
const packageVersion = $(element).find('span._66c2abad').text().trim()
const packagePublisher = $(element).find('a.e98ba1cc').text().trim()
const packageLink = $(element).find('a').attr('href')
const fullLink = 'https://www.npmjs.com' + packageLink
packages.push({
nome: packageName,
descricao: packageDesc,
versaoDetalhes: packageVersion,
publicador: packagePublisher,
link: fullLink,
})
})

const resultado_completo = {
numeroPacotes: numPackages,
pacotes: packages,
}
return resultado_completo
} catch (error) {
return { error: `deu erro no scraper kraii: ${error.message}` }
}
}
module.exports = { scrapenpmjs }

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