const axios = require('axios');
const cheerio = require('cheerio');

async function stalkttk(query) { // query precisa ter @, não esqueça!
  try {
    const response = await axios.get(`https://www.tiktok.com/${query}`);
    const $ = cheerio.load(response.data);
    const scriptTag = $("script#__UNIVERSAL_DATA_FOR_REHYDRATION__")
      .html();
    const jsonDataMatch = scriptTag.match(/{.*}/);
    if (jsonDataMatch) {
      const jsonData = JSON.parse(jsonDataMatch[0]);
      const userInfo = jsonData["__DEFAULT_SCOPE__"]["webapp.user-detail"]["userInfo"];
      return userInfo;
    } else {
      return "Perfil não encontrado";
    }
  } catch (error) {
    console.log(error)
    return "Erro ao extrair dados"
  }
}

module.exports = { stalkttk };