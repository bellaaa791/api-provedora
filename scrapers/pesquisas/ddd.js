const axios = require('axios')
const cheerio = require('cheerio')
async function scrapeDDD(query) {
try {
const { data } = await axios.get(`https://www.ddi-ddd.com.br/Codigos-Telefone-Brasil/DDD${query}/`)
const $ = cheerio.load(data)
const results = []
$('tr').each((index, element) => {
if (index === 0) return
const columns = $(element).find('td')
if (columns.length > 0) {
const ddd = $(columns[0]).text().trim() 
const cidade = $(columns[1]).text().trim() 
const estado = $(columns[2]).text().trim() 
const uf = $(columns[3]).text().trim() 
const isIrrelevant =
ddd.includes('Todos codigos DDD') || 
ddd.includes('Todos códigos DDD') || 
ddd.includes('operadoras do Brasil') || 
cidade.includes('Acre (AC)') 
if (!isIrrelevant && ddd && cidade && estado && uf) {
results.push({ ddd, cidade, estado, uf })
}
}
})
return results
} catch (error) {
return [] 
}
}
module.exports = { scrapeDDD }