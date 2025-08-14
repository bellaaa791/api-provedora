const axios = require('axios');
const cheerio = require('cheerio');

const extractPostId = (url) => {
const regex = /post\/([^?]+)/; 
const match = url.match(regex);
return match ? match[1] : null; 
};


const scrapeVideo = async (url) => {
try {
const postId = extractPostId(url); 
if (!postId) {
console.log('ID do post não encontrado na URL!');
return;
}


const fullUrl = 'https://threadster.app/download/' + postId




console.log('Post ID:', postId);
const { data } = await axios.get(fullUrl);
const $ = cheerio.load(data);


const videoUrl = $('a.btn.download__item__info__actions__button').attr('href');
if (!videoUrl) {
console.log('Link do vídeo não encontrado!');
return;
}


const posterPicUrl = $('div.download__item__profile_pic img').attr('src');
const posterName = $('div.download__item__profile_pic span').text();
const videoDescription = $('div.download__item__caption__text').text().trim();
const videoData = {
videoUrl,
posterPicUrl,
posterName,
videoDescription,
postId 
};


//console.log(videoData);
return videoData;
} catch (error) {
console.error('Erro ao fazer o scraping:', error);
}
};
module.exports = { scrapeVideo };