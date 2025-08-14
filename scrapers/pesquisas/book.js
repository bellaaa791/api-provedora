const axios = require('axios')
const cheerio = require('cheerio')
const scrapeGoodreads = async (query) => {
const searchUrl = `https://www.goodreads.com/search?q=${encodeURIComponent(query)}`
try {
const { data } = await axios.get(searchUrl)
const $ = cheerio.load(data)
const livros = []
//console.log("Requisição bem-sucedida, processando dados...")
const bookPromises = $('.tableList tr').map(async (index, element) => {
const título = $(element).find('.bookTitle').text().trim()
const autor = $(element).find('.authorName').text().trim()
const infoAvaliação = $(element).find('.greyText.smallText.uitext').html()
const avaliaçãoMédia = infoAvaliação ? (infoAvaliação.match(/(\d+\.\d+)/) ? infoAvaliação.match(/(\d+\.\d+)/)[0] : 'N/A') : 'N/A'
const numAvaliações = infoAvaliação ? (infoAvaliação.match(/(\d+(,\d{3})*) ratings/) ? infoAvaliação.match(/(\d+(,\d{3})*) ratings/)[0] : 'N/A') : 'N/A'
const link = 'https://www.goodreads.com' + $(element).find('.bookTitle').attr('href')
const detalhesLivro = await scrapeBookDetails(link)
return {
título,
autor,
avaliaçãoMédia,
numAvaliações,
descrição: detalhesLivro.descrição,
citaçãoAutor: detalhesLivro.citaçãoAutor,
anoPublicação: detalhesLivro.anoPublicação,
numEdições: detalhesLivro.numEdições,
gêneros: detalhesLivro.gêneros,
urlImagem: detalhesLivro.urlImagem
}
}).get() 
const resolvedBooks = await Promise.all(bookPromises)
livros.push(...resolvedBooks)
return livros 
} catch (error) {
console.error('Erro ao fazer a requisição:', error)
}
}
const scrapeBookDetails = async (bookUrl) => {
try {
const { data } = await axios.get(bookUrl)
const $ = cheerio.load(data)
const descrição = $('#description span').last().text().trim() || $('#description').text().trim() || 'Descrição não disponível'
const citaçãoAutor = $('.TruncatedContent__text').text().trim() || 'Citação do autor não disponível'
const anoPublicaçãoMatch = $('.row').filter((i, el) => $(el).text().includes('Published')).text().match(/Published\s+(\d{4})/)
const anoPublicação = anoPublicaçãoMatch ? anoPublicaçãoMatch[1] : 'Ano de publicação não disponível'
const numEdiçõesMatch = $('.greyText').filter((i, el) => $(el).text().includes('editions')).text().match(/(\d+(,\d{3})*) editions/)
const numEdições = numEdiçõesMatch ? numEdiçõesMatch[0] : 'Número de edições não disponível'
const gêneros = []
$('div[data-testid="genresList"] .Button__labelItem').each((i, el) => {
gêneros.push($(el).text().trim())
})
const urlImagem = $('meta[property="og:image"]').attr('content') || 'Imagem não disponível'
return {
descrição,
citaçãoAutor,
anoPublicação,
numEdições,
gêneros,
urlImagem
}
} catch (error) {
console.error('Erro ao fazer a requisição do livro:', error)
return {
descrição: 'Descrição não disponível',
citaçãoAutor: 'Citação do autor não disponível',
anoPublicação: 'Ano de publicação não disponível',
numEdições: 'Número de edições não disponível',
gêneros: [],
urlImagem: 'Imagem não disponível'
}
}
}
module.exports = { scrapeGoodreads }