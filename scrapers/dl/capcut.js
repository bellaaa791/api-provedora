const axios = require('axios');
const cheerio = require('cheerio'); // Cheerio é usado para manipulação do DOM, então é importante importá-lo.

async function capcut(url) {
  const BASE_URI = "https://snapsave.cc/wp-json/aio-dl/video-data";
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  };

  try {
    const { data } = await axios.get(`https://snapsave.cc/capcut-video-downloader/#url=${url}`, { headers });
    let $ = cheerio.load(data);
    let Token = $("#token").val();

    let payload = {
      "url": url,
      "token": Token,
      "hash": "aHR0cHM6Ly93d3cuY2FwY3V0LmNvbS9pZC1pZC90ZW1wbGF0ZS1kZXRhaWwvRm9yLXlvdS0vNzQxNDE2Mjk3MzU3ODU2MjgyMg==1073YWlvLWRs"
    };

    let { data: json } = await axios.post(BASE_URI, payload, { headers });
    return json;
  } catch (error) {
    console.error("Error fetching CapCut video data:", error);
    // É uma boa prática rejeitar a Promise ou relançar o erro para que quem chame a função possa tratá-lo.
    throw error; 
  }
}

module.exports = { capcut };