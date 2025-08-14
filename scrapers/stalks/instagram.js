const axios = require('axios')
const cheerio = require('cheerio')

async function stalkige(query) {
  try {
    const response = await axios.get(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${query}`, {
      headers: {
        "accept": "*/*",
        "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        "sec-ch-prefers-color-scheme": "dark",
        "sec-ch-ua": "\"Not-A.Brand\";v=\"99\", \"Chromium\";v=\"124\"",
        "sec-ch-ua-full-version-list": "\"Not-A.Brand\";v=\"99.0.0.0\", \"Chromium\";v=\"124.0.6327.4\"",
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-model": "\"Mi 13\"",
        "sec-ch-ua-platform": "\"Android\"",
        "sec-ch-ua-platform-version": "\"11.0.0\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-asbd-id": "129477",
        "x-csrftoken": "Dq_NMYhpSUOdjtI2N_wP0k",
        "x-ig-app-id": "1217981644879628",
        "x-ig-www-claim": "0",
        "x-requested-with": "XMLHttpRequest",
        "x-web-session-id": "c8ix4l:scimsm:a3ht1s"
      },
      referrer: `https://www.instagram.com/${query}/`,
      referrerPolicy: "strict-origin-when-cross-origin",
    });
    return response.data
  } catch (e) {
    return "Erro ao extrair dados"
  }
}
module.exports = { stalkige } 