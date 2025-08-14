const axios = require('axios')
const cheerio = require('cheerio')

const limpar = (texto) => texto.replace(/\s+/g, ' ').trim()

function removerhtml(str) {
    return str.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

function textoemdata(texto) {
    const meses = {
        'janeiro': '01',
        'fevereiro': '02',
        'março': '03',
        'abril': '04',
        'maio': '05',
        'junho': '06',
        'julho': '07',
        'agosto': '08',
        'setembro': '09',
        'outubro': '10',
        'novembro': '11',
        'dezembro': '12'
    }

    const regex = /(\d{2}) de (\w+) de (\d{4}) às (\d{2}):(\d{2}):(\d{2})/
    const match = texto.match(regex)

    if (match) {
        const dia = match[1]
        const mes = meses[match[2].toLowerCase()]
        const ano = match[3]
        const hora = match[4]
        const minuto = match[5]
        const segundo = match[6]

        return new Date(`${ano}-${mes}-${dia}T${hora}:${minuto}:${segundo}`)
    }

    return null
}

function diferenca(data) {
    const agora = new Date()
    const diffMs = agora - data

    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffMeses = Math.floor(diffDias / 30)
    const diffAnos = Math.floor(diffMeses / 12)
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60))

    return {
        dias: diffDias.toString(),
        meses: diffMeses.toString(),
        anos: diffAnos.toString(),
        horas: diffHoras.toString()
    }
}

function guilda(texto) {
    const nomeMatch = texto.match(/^(.*?)(?= 🔢| 👤|$)/)
    const nivelMatch = texto.match(/🔢 Nível: (\d+)/)
    const membrosMatch = texto.match(/👤 Membros: (\d+)/)

    return {
        nome: nomeMatch ? limpar(nomeMatch[1]) : null,
        nivel: nivelMatch ? nivelMatch[1] : null,
        membros: membrosMatch ? membrosMatch[1] : null
    }
}

function nivelexp(texto) {
    const nivelMatch = texto.match(/^(\d+)/)
    const expMatch = texto.match(/Exp:\s?([\d\.\,]+)/)

    return {
        level: nivelMatch ? nivelMatch[1] : null,
        exp: expMatch ? expMatch[1] : null
    }
}

async function buscarPerfilFreeFire(url) {
const perfilUrl = `https://www.freefiremania.com.br/perfil/${url}.html`
    
    try {
        const response = await axios.get(perfilUrl)
   
        const html = response.data
        const $ = cheerio.load(html)

        const textoAntiguidade = $('p')
            .filter((i, el) => {
                return $(el).text().includes('Por fim, a conta Free Fire do jogador')
            })
            .first()
            .html() || null

        const dataCriacaoTexto = limpar(
            $('li.list-group-item.bg-dark.text-white strong:contains("📅 Conta criada em:")')
            .parent().text().replace('📅 Conta criada em:', '')
        )

        const dataObj = textoemdata(dataCriacaoTexto)
        const dataDiff = dataObj ? diferenca(dataObj) : null

        const guildaTexto = limpar(
            $('li.list-group-item.bg-dark.text-white strong:contains("👥 Guilda:")')
            .parent().html()
            .replace(/<br\s*\/?>/gi, ' ')
            .replace(/<[^>]*>/g, '')
            .replace('👥 Guilda:', '')
        )

        const guildaObj = guilda(guildaTexto)

        const nivelTexto = limpar(
            $('li.list-group-item.bg-dark.text-white strong:contains("🏷️ Level:")')
            .parent().text().replace('🏷️ Level:', '')
        )

        const nivelObj = nivelexp(nivelTexto)

        const curtidasTexto = limpar(
            $('li.list-group-item.bg-dark.text-white strong:contains("❤️ Likes:")')
            .parent().text().replace('❤️ Likes:', '')
        )
        const curtidasNumero = (curtidasTexto.match(/[\d\.\,]+/) || [null])[0]

        const dados = {
            nome: limpar(
                $('li.list-group-item.bg-dark.text-white strong:contains("👤 Nick:")')
                .parent().text().replace('👤 Nick:', '')
            ),

            id: limpar(
                $('li.list-group-item.bg-dark.text-white strong:contains("🆔 ID:")')
                .parent().text().replace('🆔 ID:', '')
            ),

            data_criacao: {
                data_original: dataCriacaoTexto,
                ...dataDiff
            },

            ultimo_login: limpar(
                $('li.list-group-item.bg-dark.text-white strong:contains("🕒 Último login em:")')
                .parent().text().replace('🕒 Último login em:', '')
            ),

            nivel: nivelObj,

            curtidas: curtidasNumero,

            guilda: guildaObj,

            bio: limpar(
                $('li.list-group-item.bg-dark.text-white strong:contains("✍️ Bio:")')
                .next('span').text()
            ),

            versao_jogo: limpar(
                $('li.list-group-item.bg-dark.text-white strong:contains("🎮 Versão do jogo:")')
                .parent().text().replace('🎮 Versão do jogo:', '')
            ),

            passe_booyah: limpar(
                $('li.list-group-item.bg-dark.text-white strong:contains("⭐️ Passe Booyah:")')
                .parent().text().replace('⭐️ Passe Booyah:', '')
            ),

            frase_antiguidade: textoAntiguidade ? removerhtml(textoAntiguidade) : null
        }
return dados
        //console.log(JSON.stringify([dados], null, 2))
    } catch (error) {
        console.error(`Erro ao buscar dados: ${error}`)
    }
}

// Chamada da função
module.exports = { buscarPerfilFreeFire }
