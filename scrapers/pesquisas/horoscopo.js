const axios = require('axios');
const cheerio = require('cheerio');
const signImages = {
'Áries': 'https://i.ibb.co/LQnrBQ1/5694d0b0d206.jpg',
'Touro': 'https://i.ibb.co/VqMNKvq/4c37cdba270f.jpg',
'Gêmeos': 'https://i.ibb.co/KDKR5zD/09b44479df77.jpg',
'Câncer': 'https://i.ibb.co/cb7QLtM/7f83c9ae0449.jpg',
'Leão': 'https://i.ibb.co/xzDj4LS/21fddb5dbdaf.jpg',
'Virgem': 'https://i.ibb.co/qnGsvMk/ed9e11e16e6b.jpg',
'Libra': 'https://i.ibb.co/t49DTTP/b46f092c8b48.jpg',
'Escorpião': 'https://i.ibb.co/Y0wGvy5/72801436aa7d.jpg',
'Sagitário': 'https://i.ibb.co/0QkC4kh/4b9263f5e428.jpg',
'Capricórnio': 'https://i.ibb.co/g6YN2Yf/8afcdc2b49ff.jpg',
'Aquário': 'https://i.ibb.co/fQTqSsF/58ab8a83ed41.jpg',
'Peixes': 'https://i.ibb.co/BP0wLmt/a22fd8ddb775.jpg',
'áries': 'https://i.ibb.co/LQnrBQ1/5694d0b0d206.jpg',
'touro': 'https://i.ibb.co/VqMNKvq/4c37cdba270f.jpg',
'gêmeos': 'https://i.ibb.co/KDKR5zD/09b44479df77.jpg',
'câncer': 'https://i.ibb.co/cb7QLtM/7f83c9ae0449.jpg',
'leão': 'https://i.ibb.co/xzDj4LS/21fddb5dbdaf.jpg',
'virgem': 'https://i.ibb.co/qnGsvMk/ed9e11e16e6b.jpg',
'libra': 'https://i.ibb.co/t49DTTP/b46f092c8b48.jpg',
'escorpião': 'https://i.ibb.co/Y0wGvy5/72801436aa7d.jpg',
'sagitário': 'https://i.ibb.co/0QkC4kh/4b9263f5e428.jpg',
'capricórnio': 'https://i.ibb.co/g6YN2Yf/8afcdc2b49ff.jpg',
'aquário': 'https://i.ibb.co/fQTqSsF/58ab8a83ed41.jpg',
'peixes': 'https://i.ibb.co/BP0wLmt/a22fd8ddb775.jpg',
};


async function horoscopoSearch(nome) {
try {
const url = `https://www.terra.com.br/vida-e-estilo/horoscopo/signos/${nome}/`;
const { data } = await axios.get(url);
const $ = cheerio.load(data);
const horoscopeData = [];
const title = $('.horoscope--content__embed--title.color-touro').first().text();
const date = $('.horoscope--content__embed--subtitle').first().text();
const dailyHoroscopeText = $('.horoscope--content__embed').first().find('p').first().text();
const imageUrl = signImages[nome] || null;
const monthlyHoroscopeText = $('.horoscope--content__embed').eq(2).find('p').first().text();
const annualHoroscopeText = $('.horoscope--content__embed').eq(3).find('p').first().text();
const weeklyHoroscopeText = $('.horoscope--content__embed').eq(1).find('p').first().text();
    
horoscopeData.push({
titulo: title.trim(),
data: date.trim(),
daily_HoroscopeText: dailyHoroscopeText.trim(),
monthly_HoroscopeText: monthlyHoroscopeText.trim(),
annual_HoroscopeText: annualHoroscopeText.trim(),
weeklyHoroscopeText: weeklyHoroscopeText.trim(),
imageUrl: imageUrl,
      
});

//console.log(horoscopeData);
return horoscopeData; // Retornando os dados, se necessário

} catch (error) {
console.error('Erro ao buscar o horóscopo:', error.message);
}
}
module.exports = {  horoscopoSearch }

