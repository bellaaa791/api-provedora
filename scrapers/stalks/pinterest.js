const axios = require('axios');
const cheerio = require('cheerio');

async function scrapePinterestProfile(query) {
try {
const url = `https://br.pinterest.com/${query}`;
const { data } = await axios.get(url);
const $ = cheerio.load(data);

const nome = $('[data-test-id="profile-name"] h1').text().trim();
const descricao = $('[data-test-id="main-user-description-text"]').text().trim();
const avatarUrl = $('[data-test-id="gestalt-avatar-svg"] img').attr('src');
const seguidores = $('[data-test-id="profile-followers-link"]').text().trim();
const seguindo = $('[data-test-id="follower-count"]').text().trim();

return [nome, descricao, avatarUrl, seguidores, seguindo];
} catch (error) {
console.error('Erro ao fazer o scrape:', error.message);
return []; 
}
}

module.exports = { scrapePinterestProfile }