const axios = require('axios')
const cheerio = require('cheerio')

const scrapeMercadoLivre = async (query) => {
try {
const url = "https://lista.mercadolivre.com.br/" + query
const { data } = await axios.get(url, {
headers: {
"User-Agent":
"Mozilla/5.0 (Windows NT 10.0 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
},
})

const $ = cheerio.load(data)
const products = []

const promises = $(".poly-card__content").map(async (index, element) => {
const title = $(element).find(".poly-component__title a").text().trim()
const link = $(element).find(".poly-component__title a").attr("href")
const priceWhole = $(element)
.find(".andes-money-amount__fraction")
.first()
.text()
.trim()
const priceCents = $(element)
.find(".andes-money-amount__cents")
.first()
.text()
.trim()
const price = priceCents
? `${priceWhole},${priceCents}`
: priceWhole || "Preço não disponível"
const shipping = $(element)
.find(".poly-component__shipping")
.text()
.trim() || "Frete não disponível"
const brand = $(element).find(".poly-component__brand").text().trim()

if (title && link) {
const imageUrl = await scrapeProductImage(link)
products.push({
titulo: title,
link: link,
preco: price,
entrega: shipping,
marca: brand,
imagem: imageUrl,
})
}
})

await Promise.all(promises)
return products
console.log(products)
} catch (error) {
console.error("Erro ao realizar o scraping:", error.message)
throw new Error("Erro ao buscar dados no Mercado Livre.")
}
}

const scrapeProductImage = async (link) => {
try {
const { data } = await axios.get(link, {
headers: {
"User-Agent":
"Mozilla/5.0 (Windows NT 10.0 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
},
})
const $ = cheerio.load(data)
const imageUrl = $("meta[name='twitter:image']").attr("content")
return imageUrl || "Imagem não disponível"
} catch (error) {
console.error("Erro ao pegar imagem do produto:", error.message)
return "Imagem não disponível"
}
}

module.exports = { scrapeMercadoLivre }
