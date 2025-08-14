const axios = require('axios');
const cheerio = require('cheerio');



async function scrapeSnapchatProfile(query) {
try {
const url = 'https://www.snapchat.com/add/' + query



const { data } = await axios.get(url);


const $ = cheerio.load(data);

const nome = $('meta[property="twitter:title"]').attr('content'); 
const avatar = $('meta[property="twitter:image"]').attr('content'); 
const descricao = $('meta[name="description"]').attr('content'); 
const posts = [];
$('.StoryTile_highlightWrapper__GR5Ys').each((_, element) => {
const foto = $(element).find('img.ImageTile_tileMedia__5vXqC').attr('src'); 
const nomePost = $(element).find('h6 span.StoryTile_storyTitle__yo0_I').text(); 

if (foto && nomePost) {
posts.push({ foto, nome: nomePost });
}
});


return {
nome,
descricao,
avatar,
posts,
};
} catch (error) {
console.error('Erro ao fazer o scrape:', error.message);
return null;
}
}


module.exports = { scrapeSnapchatProfile }