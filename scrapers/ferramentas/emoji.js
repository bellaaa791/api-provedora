const axios = require('axios')
const cheerio = require('cheerio')
async function buscarEmojis(query) {
try {
const url = `https://emojigraph.org/pt/search/?q=${encodeURIComponent(query)}&searchLang=pt`
const { data } = await axios.get(url, { 
headers: { 'Content-Type': 'text/html charset=UTF-8' } 
})
const $ = cheerio.load(data)
const resultados = []
const itens = $('#search__first ul.s__first__ul li')
for (const item of itens) {
const elemento = $(item)
const emoji = elemento.find('span.emoji').text().trim()
const nome = elemento.find('a').text().replace(emoji, '').trim()
const link = `https://emojigraph.org${elemento.find('a').attr('href')}`
const paginaData = await axios.get(link, {
headers: { 'Content-Type': 'text/html charset=UTF-8' }
})
const pagina$ = cheerio.load(paginaData.data)
const categorias = []
pagina$('.block__emoji').each((i, bloco) => {
const plataforma_nome = pagina$(bloco).find('h2 a').text().trim() 
const plataforma_link = `https://emojigraph.org${pagina$(bloco).find('h2 a').attr('href')}` 
const imagem_plataforma = `https://emojigraph.org${pagina$(bloco).find('img').attr('src')}` 
categorias.push({
plataforma_nome,
plataforma_link,
imagem_plataforma
})
})
const descricao = pagina$('.h2 + p').text().trim()
resultados.push({
emoji,
nome,
link,
descricao: descricao || 'Descrição não encontrada.',
categorias
})
}
return resultados
} catch (erro) {
console.error('Erro ao acessar o site:', erro.message)
return [] 
}
}
module.exports = { buscarEmojis }