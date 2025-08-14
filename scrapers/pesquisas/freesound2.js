const axios = require('axios');
const cheerio = require('cheerio');

async function freeSoundSearch(keys) {
    try {
        const response = await axios.get('https://freesound.org/search/?q=' + keys);
        const $ = cheerio.load(response.data);
        const sounds = [];

        $('.bw-player').each((index, element) => {
            const sound = {
                soundId: $(element).data('sound-id'),
                title: $(element).data('title'),
                mp3: $(element).data('mp3'),
                ogg: $(element).data('ogg'),
                duration: $(element).data('duration'),
                samplerate: $(element).data('samplerate'),
                numComments: $(element).data('num-comments'),
                numDownloads: $(element).data('num-downloads'),
                favorite: $(element).data('favorite'),
                creator: $(element).closest('.row').find('a').last().text().trim(),
                link: 'https://freesound.org' + $(element).closest('.row').find('h5 a.bw-link--black').attr('href')
            };

            sounds.push(sound);
        });

        console.log("Resultados encontrados:", sounds); // Exibe os resultados no console
        return sounds;
    } catch (error) {
        console.error("Erro ao buscar sons:", error.message);
        return [];
    }
}

// Chamando a função para testar
freeSoundSearch("piano")
    .then(console.log)
    .catch(console.error);
    