const axios = require('axios');
const cheerio = require('cheerio');


//const url = 'https://www.wattpad.com/user/_amorist_';

async function scrapeProfilewattpad(query) {
const url = 'https://www.wattpad.com/user/' + query


try {

const { data } = await axios.get(url);

const $ = cheerio.load(data);


const profileData = {
usuario: {
nome: $('p#alias').text().trim(),
avatar: $('div.avatar img').attr('src'),
descricao: $('div.description pre').text().trim(),
localizacao: $('li.location .user-meta-info-content').text().trim(),
dataCriacaoConta: $('li.date .user-meta-info-content')
.text()
.replace('Entrou', '')
.trim(),
},
estatisticas: {
numeroObras: $('div[data-id="profile-works"] p:first-child').text().trim(),
numeroListasLeitura: $('div[data-id="profile-lists"] p:first-child').text().trim(),
numeroSeguidores: $('div.on-followers .followers-count').text().trim(),
numeroSeguindo: $('a.num-following')
.text()
.replace(/[^\d]/g, '') 
.trim(),
},
historias: [],
};


$('div.discover-module-stories-large.on-discover-module-item').each((i, element) => {
const story = {
titulo: $(element).find('a.title').text().trim(),
url: $(element).find('a.title').attr('href'),
imagemCapa: $(element).find('img').attr('src'),
leituras: $(element).find('.read-count').text().trim(),
votos: $(element).find('.vote-count').text().trim(),
partes: $(element).find('.part-count').text().trim(),
descricao: $(element).find('.description').text().trim(),
tags: [],
};


$(element).find('.tag-items a').each((i, tagElement) => {
story.tags.push($(tagElement).text().trim());
});

profileData.historias.push(story);
});

return profileData;
} catch (error) {
return { error: `Erro ao fazer scraping: ${error.message}` };
}
}

module.exports = { scrapeProfilewattpad };
