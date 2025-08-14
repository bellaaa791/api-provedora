
const axios = require('axios')
const cheerio = require('cheerio')

async function lyrics(q) {
    const BASE_SEARCH = `https://solr.sscdn.co/letras/m1/?q=${encodeURIComponent(q)}&wt=json&callback=LetrasSug`;

    try {
        const response = await axios.get(BASE_SEARCH);
        if (typeof response.data === 'string') {
            const start = response.data.indexOf('(');
            const end = response.data.lastIndexOf(')');

            if (start !== -1 && end !== -1 && start < end) {
                const jsonString = response.data.slice(start + 1, end);
                const jsonData = JSON.parse(jsonString);
                const resultados = await Promise.all(jsonData.response.docs.map(async (doc) => {
                    const baseUrl = 'https://www.letras.mus.br/';
                    const artist = doc.dns || '';
                    const songUrl = doc.url || doc.urlal || '';
                    const link = `${baseUrl}${artist}/${songUrl}/`;

                    const songResponse = await axios.get(link);
                    const $ = cheerio.load(songResponse.data);
                    const imgSet = $('.thumbnail img').attr('srcset');
                    const imgget = imgSet ? imgSet.split(', ')[1].split(' ')[0] : null;
                    const lyrics = $('.lyric-original p').map((i, el) => $(el).html().replace(/<br\/?>/g, '\n')).get().join('\n\n');

                    return { ...doc, link, imgget, lyrics };
                }));

                if (resultados.length === 0) {
                    return { status: false, error: 'Nenhum resultado encontrado.' };
                }

    //            console.log({ resultados })

                return { resultados };
            }
        }
    } catch {
        return { status: false };
    }
}

// lyrics('linda morena')

module.exports = {
    lyrics
}