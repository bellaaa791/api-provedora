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
const https = require('https')
const cheerio = require('cheerio')

const receitakk = async (query) => {
const agent = new https.Agent({
rejectUnauthorized: false 
})
const url = `https://www.piracanjuba.com.br/receitas/busca/${query}`
try {
const response = await axios.get(url, { httpsAgent: agent })
const $ = cheerio.load(response.data)
const receitas = []
$('a.card-recipe').each((i, el) => {
const link = $(el).attr('href')
const fullLink = link.startsWith('http') ? link : `https://www.piracanjuba.com.br${link}`
receitas.push({
link: fullLink,
})
})

const receitaDetalhadaPromises = receitas.map(async (receita) => {
try {
const response = await axios.get(receita.link, { httpsAgent: agent })
const $ = cheerio.load(response.data)

const imagem = $('figure img').attr('src')
const ingredientes = []
$('h3:contains("Ingredientes")').next().find('ol li').each((i, el) => {
ingredientes.push($(el).text().trim())
})

const modoDePreparo = []
$('h3:contains("Modo de preparo")').next().find('ol li').each((i, el) => {
modoDePreparo.push($(el).text().trim())
})

receita.imagem = imagem
receita.ingredientes = ingredientes
receita.modoDePreparo = modoDePreparo

return receita
} catch (error) {
console.error(`Erro ao buscar detalhes da receita: ${receita.link}`, error)
}
})

const resultados = await Promise.all(receitaDetalhadaPromises)
return resultados
//console.log(resultados)

} catch (error) {
console.error('Erro ao buscar dados principais: ', error)
}
}

module.exports = { receitakk }
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
