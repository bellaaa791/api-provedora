const axios = require('axios')
const cheerio = require('cheerio')
async function searchHentai(search) {
return new Promise((resolve, reject) => {
axios.get('https://hentai.tv/?s=' + search).then(async ({data}) => {
const $ = cheerio.load(data)
const result = {}
const res = []
result.result = res
$('div.flex > div.crsl-slde').each(function(a, b) {
const thumbnail = $(b).find('img').attr('src')
const title = $(b).find('a').text().trim()
const views = $(b).find('p').text().trim()
const url = $(b).find('a').attr('href')
const hasil = {thumbnail: thumbnail, titulo: title, views: views, url: url}
res.push(hasil)
return hasil
})
 resolve(result)
}).catch((err) => {
console.log(err)
})
})
}

module.exports = { searchHentai }
