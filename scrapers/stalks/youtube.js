const axios = require('axios');
const cheerio = require('cheerio');


async function infoYouTube(query) {
try {

const { data: pageData } = await axios.get(`https://www.youtube.com/@${query}`);
const $ = cheerio.load(pageData);


const channelUrl = $('link[rel="canonical"]').attr('href');
if (!channelUrl) return { erro: 'Canal não encontrado' };


const { data } = await axios.get(channelUrl);
const $channel = cheerio.load(data);


const url = $channel('meta[property="og:url"]').attr('content');
const image = $channel('meta[property="og:image"]').attr('content');
const title = $channel('meta[property="og:title"]').attr('content');
const description = $channel('meta[property="og:description"]').attr('content');
const inscritos = $channel('meta[property="og:registered"]').attr('content');



const bannerMatch = data.match(/"banner":\{.*?"imageBannerViewModel":\{.*?"image":\{.*?"sources":\[\{"url":"(https:\/\/yt3\.googleusercontent\.com[^"]+)"/);
const bannerUrl = bannerMatch ? bannerMatch[1] : null;

resultado ={
nome: title || 'Nome não encontrado',
url: url || 'URL não encontrada',
imagem: image || 'Imagem não encontrada',
descricao: description || 'Descrição não encontrada',
inscritoskk: inscritos || 'Inscritos não encontrados',
banner: bannerUrl || 'Banner não encontrado',
};
return resultado
} catch (error) {



}
}

module.exports = { infoYouTube }