/*
Feito por tokyo

#daki infos
#daki apis
#2024

#suporte: +55 32 98507-6325

canal youtube: @134_tokyo

canal 1 whatsapp:
https://whatsapp.com/channel/0029VaYz83R6mYPV4dV55h3H

canap 2 whatsapp: 
https://whatsapp.com/channel/0029VaGdVmn4inowmCI3OU3Z




*/
const axios = require('axios');
const cheerio = require('cheerio');


async function scrapeWallpapers2(query) {
try {

const url = `https://www.besthdwallpaper.com/search?q=${query}`

const { data } = await axios.get(url);
const $ = cheerio.load(data);

const wallpapers = [];


$('#WallpapersMasonry .grid-item').each((index, element) => {
const titulo = $(element).find('.info p').attr('title'); // Título do wallpaper
const link = $(element).find('a').attr('href'); // Link para a página do wallpaper
const imagem = $(element).find('picture img').attr('src'); // URL da imagem

wallpapers.push({
titulo,
link: `https://www.besthdwallpaper.com${link}`,
imagem,
});
});

return wallpapers
//console.log('Wallpapers encontrados:', wallpapers);
} catch (error) {
console.error('Erro ao fazer o scraping:', error.message);
}
}

module.exports = { scrapeWallpapers2 }
/*
Feito por tokyo

#daki infos
#daki apis
#2024

#suporte: +55 32 98507-6325

canal youtube: @134_tokyo

canal 1 whatsapp:
https://whatsapp.com/channel/0029VaYz83R6mYPV4dV55h3H

canap 2 whatsapp: 
https://whatsapp.com/channel/0029VaGdVmn4inowmCI3OU3Z




*/

