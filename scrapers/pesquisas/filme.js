const axios = require('axios')
const cheerio = require('cheerio')
async function infofilme(query) {
const url = `https://www.adorocinema.com/pesquisar/?q=${query}`
try {
const response = await axios.get(url)
const $ = cheerio.load(response.data)
const searchResults = []
const searchResultsCount = $('div.search-entity-summary').text().trim()
//console.log(`Resultados encontrados: ${searchResultsCount}`)
$('ul li.mdl').each((index, element) => {
const $element = $(element)
const imagem = $element.find('figure.thumbnail img').attr('data-src') || 'Imagem não encontrada'
const nome = $element.find('h2.meta-title span.meta-title-link').text().trim() || 'Nome não encontrado'
const lançamento = $element.find('div.meta-body-item.meta-body-info span.date').text().trim() || 'Data de lançamento não encontrada'
const diretor = $element.find('div.meta-body-item.meta-body-direction span.dark-grey-link').text().trim() || 'Diretor não encontrado'
const sinopse = $element.find('div.synopsis').text().trim() || 'Sinopse não encontrada'
searchResults.push({
imagem,
nome,
lançamento,
diretor,
sinopse
})
})
return searchResults 
} catch (error) {
console.error(error)
return [] 
}
}

module.exports = { infofilme }