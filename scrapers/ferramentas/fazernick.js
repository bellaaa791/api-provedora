const axios = require('axios')
const cheerio = require('cheerio')
function styletext(texto) {

    return new Promise((resolve, reject) => {

        axios.get('http://qaz.wtf/u/convert.cgi?text='+texto)

        .then(({ data }) => {

            let $ = cheerio.load(data)

            let hasil = []

            $('table > tbody > tr').each(function (a, b) {

                hasil.push({ nome: $(b).find('td:nth-child(1) > span').text(), fonte: $(b).find('td:nth-child(2)').text().trim() })

            })

            resolve(hasil)

        })

    })

}

module.exports = { styletext }