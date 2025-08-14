const axios = require('axios');
const cheerio = require('cheerio');

async function getCharacterData(name = null) {
    try {
        const url = 'https://genshin.gg/star-rail/character-stats/';
        const { data } = await axios.get(url);
        if (!data) throw new Error('Não foi possível obter os dados da página.');

        const $ = cheerio.load(data);
        const characters = [];

        $('.rt-tr').each((index, element) => {
            const characterName = $(element).find('.character-name').text().trim();
            if (characterName) {
                characters.push({
                    nome: characterName,
                    hp: $(element).find('div').eq(1).text(),
                    ataque: $(element).find('div').eq(2).text(),
                    defesa: $(element).find('div').eq(3).text(),
                    speed: $(element).find('div').eq(4).text(),
                    taunt: $(element).find('div').eq(5).text(),
                    imagem: $(element).find('img.character-icon').attr('src') || 'Imagem não encontrada'
                });
            }
        });

        if (name) {
            const characterData = characters.find(c => c.name.toLowerCase() === name.toLowerCase());
            if (!characterData) throw new Error('Personagem não encontrado.');
            return characterData;
        }

        return characters.map(c => c.name);
    } catch (error) {
        throw new Error(`Erro ao buscar os dados: ${error.message}`);
    }
}

module.exports = { getCharacterData };
