const cheerio = require('cheerio')
const axios = require('axios')
const scrapeGnula = async (query) => {
const searchUrl = `https://gnulahd.nu/?s=${encodeURIComponent(query)}`
const results = []
try {
const { data } = await axios.get(searchUrl)
const $ = cheerio.load(data)
const posts = $('.post').toArray()
for (const element of posts) {
const titulo = $(element).find('h2 a').attr('title')?.replace('Permanent Link to ', '') || 'Título não disponível'
const publicou = $(element).find('.time span').text().trim() || 'Data não disponível'
const autor = $(element).find('.date span').text().replace('posted by ', '').trim() || 'Autor não disponível'
const imagen = $(element).find('img').attr('src') || 'Imagem não disponível'
const link = $(element).find('h2 a').attr('href') || 'Link não disponível'
const sinopse = $(element).find('.entry p').text().trim() || 'Sinopse não disponível'
let traducao_descricao = 'Tradução não disponível'
try {
const translateResponse = await axios.get(
`https://translate.googleapis.com/translate_a/single`,
{
params: {
client: "gtx",
sl: "auto",
tl: "pt",
dt: "t",
q: sinopse,
},
}
)
traducao_descricao = translateResponse.data[0]
.map((fragment) => fragment[0])
.join("") || 'Tradução não disponível'
} catch (translationError) {
console.error(`Erro ao traduzir sinopse: ${translationError.message}`)
}
results.push({
titulo,
publicou,
autor,
imagen,
link,
traducao_descricao,
})
}
} catch (error) {
console.error(`Erro ao buscar no Gnula: ${error.message}`)
}
return results
}
module.exports = { scrapeGnula }
