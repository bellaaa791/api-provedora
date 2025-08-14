const axios = require('axios')
const cheerio = require('cheerio')
async function scrapeRule34(query) {
try {
const baseUrl = 'https://rule34.xxx/index.php?page=post&s=list&tags=' + query
searchUrl = baseUrl
const { data } = await axios.get(searchUrl)
const $ = cheerio.load(data)
const postLinks = []
$('span.thumb > a').each((index, element) => {
const partialLink = $(element).attr('href')
if (partialLink) {
const fullLink = `${baseUrl}${partialLink}`
postLinks.push(fullLink)
}
})
const imageLinks = []
for (const postLink of postLinks) {
const imageUrl = await scrapeImageFromPost(postLink)
if (imageUrl) {
imageLinks.push(imageUrl)
}
}
return imageLinks
} catch (error) {
console.error('Erro ao fazer scraping:', error.message)
}
}
async function scrapeImageFromPost(postUrl) {
try {
const { data } = await axios.get(postUrl)
const $ = cheerio.load(data)
const imageLink = $('a[href*="/images/"]').attr('href')
return imageLink ? `${imageLink}` : null 
} catch (error) {
console.error(`Erro ao acessar o post ${postUrl}:`, error.message)
return null
}
}
module.exports = { scrapeRule34 }