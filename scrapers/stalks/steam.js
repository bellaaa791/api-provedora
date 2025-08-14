const axios = require('axios');
const cheerio = require('cheerio');

async function steamStalk(teks) {
    try {
        const { data } = await axios.get('https://steamcommunity.com/id/' + teks);
        const $ = cheerio.load(data);

        const dadosPerfil = {
            usuario: $('.actual_persona_name').text().trim() || undefined,
            nome: $('.header_real_name bdi').text().trim() || undefined,
            localizacao: $('.header_real_name').contents().last().text().trim() || undefined,
            foto_perfil: $('.playerAvatar img').attr('src') || undefined,
            nivel: $('.friendPlayerLevelNum').text().trim() || undefined,
            distintivos: {
                total: parseInt($('.profile_count_link_total').first().text().trim(), 10) || undefined,
                infoDistintivos: []
            },
            jogos: parseInt($('.profile_count_link_total').eq(1).text().trim(), 10) || undefined,
            capturas: parseInt($('.profile_count_link_total').eq(3).text().trim(), 10) || undefined,
            videos: parseInt($('.profile_count_link_total').eq(4).text().trim(), 10) || undefined,
            avaliacoes: parseInt($('.profile_count_link_total').eq(5).text().trim(), 10) || undefined,
            amigos: parseInt($('.profile_count_link_total').eq(6).text().trim(), 10) || undefined,
            conquistas: {
                total: parseInt($('.showcase_stat').first().text().trim(), 10) || undefined,
                taxaMediaConclusao: parseInt($('.showcase_stat').eq(1).text().trim().replace('%', '').trim()) || undefined
            },
            jogos_recentes: [],
            comentarios: []
        };

        $('.profile_header_badge').each((index, element) => {
            const nomeDistintivo = $(element).find('.favorite_badge_description .name').text().trim() || undefined;
            const xpDistintivo = $(element).find('.favorite_badge_description .xp').text().trim() || undefined;
            const imagemDistintivo = $(element).find('.badge_icon').attr('src') || undefined;
            dadosPerfil.distintivos.infoDistintivos.push({
                nome: nomeDistintivo,
                xp: xpDistintivo,
                imagem: imagemDistintivo
            });
        });

        $('.recent_game').each((index, element) => {
            const nomeJogo = $(element).find('.game_name a').text().trim() || undefined;
            const textoUltimaJogada = $(element).find('.game_info_details').text().trim() || undefined;
            const horasUltimaJogada = parseFloat(textoUltimaJogada.split(' ')[0]) || undefined;
            dadosPerfil.jogos_recentes.push({
                nomeJogo: nomeJogo,
                ultimaJogada: horasUltimaJogada
            });
        });

        $('.commentthread_comment').each((index, element) => {
            const autorComentario = $(element).find('.commentthread_comment_author a').text().trim() || undefined;
            const textoComentario = $(element).find('.commentthread_comment_text').text().trim() || undefined;
            const timestampComentario = $(element).find('.commentthread_comment_timestamp').attr('title') || undefined;
            dadosPerfil.comentarios.push({
                autor: autorComentario,
                texto: textoComentario,
                timestamp: timestampComentario
            });
        });

        // Verifica se há dados ausentes no perfil e adiciona uma mensagem se não houver dados
        for (const chave in dadosPerfil) {
            if (dadosPerfil[chave] === undefined) {
                dadosPerfil[chave] = "Não Possui Dados";
            }
        }

        console.log(dadosPerfil);
        return dadosPerfil;
        //return JSON.stringify(dadosPerfil, null, 2);

    } catch (error) {
        return error.message;
    }
}

//Exemplo:
//return steamStalk("Dwight");

module.exports = { steamStalk };

