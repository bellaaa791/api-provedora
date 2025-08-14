const axios = require('axios');
const cheerio = require('cheerio');


async function fetchData_pornhub(query) {
const url = 'https://pt.pornhub.com/model/' + query;

try {
const { data } = await axios.get(url);
const $ = cheerio.load(data);
const coverImage = $('#coverPictureDefault').attr('src');
const avatarImage = $('#getAvatar').attr('src');
const name = $('h1[itemprop="name"]').text().trim();
const ranking = $('.infoBox .big').eq(0).text().trim();
const weeklyRanking = $('.infoBox .big').eq(1).text().trim();
const monthlyRanking = $('.infoBox .big').eq(2).text().trim();
const videoViews = $('.tooltipTrig[data-title*="Visualizações do vídeo"]').find('.big').text().trim();
const subscribers = $('.tooltipTrig[data-title*="Inscritos"]').find('.big').text().trim();
const bio = $('section.aboutMeSection').text().trim();
const socialLinks = [];


const isVerified = $('.verifiedPornstar').length > 0 ? 'Sim' : 'Não';


$('ul.socialList li a').each((i, element) => {
const socialLink = $(element).attr('href');
socialLinks.push(socialLink);
});


return({

Nome: name,
Verificada: isVerified,
Avatar: coverImage,
Foto: avatarImage,
Ranking_Geral: ranking,
Ranking_Semanal: weeklyRanking,
Ranking_Mensal: monthlyRanking,
Visualizações_do_vídeo: videoViews,
Inscritos: subscribers,
Bio: bio,
Redes_sociais: socialLinks.join(', ')
})

//return result
//console.log(result);

} catch (error) {
console.error('Erro ao buscar dados:', error);
}
}

module.exports = { fetchData_pornhub };
