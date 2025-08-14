const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeXvideosFull(query) {
const searchUrl = `https://www.xvideos.com/?k=${encodeURIComponent(query)}`;

try {
// Passo 1: pegar a lista de vídeos
const { data: searchHtml } = await axios.get(searchUrl, {
headers: {
'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/90.0.0.0 Safari/537.36'
}
});
const $search = cheerio.load(searchHtml);

// Array para armazenar todos os resultados
const resultados = [];

// Itera sobre cada vídeo encontrado na busca
const videos = $search('.thumb-block');

for (let i = 0; i < videos.length; i++) {
const el = videos[i];
const titleEl = $search(el).find('.thumb-under .title a');
const metadataEl = $search(el).find('.thumb-under .metadata');
const imgEl = $search(el).find('.thumb img');

const titulo = titleEl.text().trim();
const urlVideoRel = titleEl.attr('href');
const urlVideo = 'https://www.xvideos.com' + urlVideoRel;
const thumbnail = imgEl.attr('src');
const duracao = $search(el).find('.thumb-under .title .duration').text().trim();

const uploader = metadataEl.find('.name').text().trim() || null;

// Extrair views (pode ter variações, tentamos limpar)
let views = null;
const metadataText = metadataEl.text();
const viewsMatch = metadataText.match(/([\d,.]+[MK]?)(?=\s*Visualizações)/i);
if (viewsMatch) {
views = viewsMatch[1];
}

// Passo 2: acessar a página do vídeo para pegar o MP4
let videoMp4 = null;

try {
const { data: videoHtml } = await axios.get(urlVideo, {
headers: {
'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/90.0.0.0 Safari/537.36'
}
});
const $video = cheerio.load(videoHtml);

const jsonLd = $video('script[type="application/ld+json"]').html();

if (jsonLd) {
const info = JSON.parse(jsonLd);
videoMp4 = info.contentUrl || null;
}
} catch (e) {
console.error(`Erro ao acessar página do vídeo: ${urlVideo}`, e.message);
}

resultados.push({
titulo,
duracao,
url: urlVideo,
thumbnail,
uploader,
views,
videoMp4,
});
}

//console.log(resultados);
return resultados;

} catch (error) {
console.error('Erro na busca:', error);
}
}

// Teste o scraper com a busca "Lesbicas"
//scrapeXvideosFull('Brasil');
module.exports = { scrapeXvideosFull }