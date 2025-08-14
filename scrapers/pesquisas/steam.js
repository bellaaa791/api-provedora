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
const axios = require("axios")
const cheerio = require("cheerio")
const steamR = async (query) => {
try {
const url = "https://store.steampowered.com/search/?term=" + query
const { data } = await axios.get(url)
const $ = cheerio.load(data)
const results = []
const fetchDetails = async (link) => {
try {
const { data } = await axios.get(link)
const $ = cheerio.load(data)

const foto = $(".responsive_page_header_img img").attr("src") || "Não encontrado"
const desenvolvedor = $(".dev_row:contains('Developer') .summary a").text().trim() || "Não encontrado"
const publicou = $(".dev_row:contains('Publisher') .summary a").text().trim() || "Não encontrado"
const descrição = $(".game_description_snippet").text().trim() || "Não encontrado"

const avaliacoes_recentes = $("#userReviews .user_reviews_summary_row:first-child .summary.column span.game_review_summary")
.text()
.trim() || "Não encontrado"
const avaliacoes_total = $("#userReviews .user_reviews_summary_row:last-child .summary.column span.game_review_summary")
.text()
.trim() || "Não encontrado"

// Traduzindo a descrição usando a API do Google Translate
let traducao_descricao = "Não encontrado"
if (descrição !== "Não encontrado") {
const translateResponse = await axios.get(
`https://translate.googleapis.com/translate_a/single`,
{
params: {
client: "gtx",
sl: "auto",
tl: "pt",
dt: "t",
q: descrição,
},
}
)

// Concatenar todos os fragmentos de tradução retornados
traducao_descricao = translateResponse.data[0]
.map((fragment) => fragment[0])
.join("") || "Tradução não disponível"
}

return {
foto,
desenvolvedor,
publicou,
descrição,
traducao_descricao,
avaliacoes_recentes,
avaliacoes_total,
}
} catch (error) {
console.error(`Erro ao buscar detalhes do link ${link}:`, error.message)
return {
foto: "https://zero-two.info/uploads/images/file-1732147783354-487845809.jpg",
desenvolvedor: "Não encontrado",
publicou: "Não encontrado",
descrição: "Não encontrado",
traducao_descricao: "Não encontrado",
avaliacoes_recentes: "Não encontrado",
avaliacoes_total: "Não encontrado",
}
}
}

// Selecionando os resultados da busca inicial
const gameElements = $(".search_result_row").toArray() // Converte para array
const games = await Promise.all(
gameElements.map(async (element) => {
const titulo = $(element).find(".title").text().trim() || "Não encontrado"
const link = $(element).attr("href") || "Não encontrado"
const data = $(element).find(".search_released").text().trim() || "Não encontrado"
const preço = $(element).find(".discount_final_price").text().trim() || "Não encontrado"
const preço_original = $(element).find(".discount_original_price").text().trim() || "Não encontrado"
const desconto = $(element).find(".discount_pct").text().trim() || "Não encontrado"

// Adicionando as informações iniciais
const game = {
titulo,
data,
preço,
preço_original,
desconto,
}

// Buscando informações adicionais (se o link não for "Não encontrado")
if (link !== "Não encontrado") {
const details = await fetchDetails(link)
Object.assign(game, details)
}

return game
})
)

results.push(...games)

// Exibindo os resultados
//console.log(results)
return results // Retorna os resultados caso queira usar em outro local
} catch (error) {
console.error("Erro ao buscar os dados:", error.message)
throw error // Lança o erro para tratamento externo, se necessário
}
}

module.exports = { steamR }
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
