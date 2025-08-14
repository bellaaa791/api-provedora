const axios = require('axios')
const cheerio = require('cheerio')
llurl = 'https://pin.it/3ytjM7vBr'
const pintorest = (url) => {
return new Promise((resolve, reject) => {
axios.get(url, {
headers: {
"user-agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.136 Mobile Safari/537.36"
}}).then((res) => {try {
const $ = cheerio.load(res.data);
const scriptContent = $('script[data-test-id="video-snippet"]').text();
const json = JSON.parse(scriptContent);
resolve({
titulo: json.name,
thumb: json.thumbnailUrl,
video: json.contentUrl
})} catch (error) {
reject(`Erro ao analisar JSON: ${error}`);
}})
});
}

module.exports = { pintorest }

