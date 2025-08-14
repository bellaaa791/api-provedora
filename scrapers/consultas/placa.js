const axios = require('axios');

const url = 'https://ws.carcheckbrasil.com.br/consultar/pegarDadosVeiculo';

const headers = {
  'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36 OPR/90.0.0.0',
  'Accept': 'application/json, text/plain, */*',
  'Content-Type': 'application/json',
  'sec-ch-ua-platform': '"Android"',
  'authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ7XCJjbGllbnRlXCI6e1widGVsZWZvbmVcIjpcIig0NikgOSA5OTc0LTIyNTNcIixcInRpcG9QZXNzb2FcIjpcIkZJU0lDQVwiLFwiZG9jdW1lbnRvXCI6XCIwODMuNTQ4LjQyOS03NVwiLFwibm9tZVwiOlwiY2FybG9zIGVkdWFyZG9cIixcImNsaWVudGVUaXBvSW5kZWZpbmlkb1wiOlwiTlwiLFwiaWRcIjoyMDIyODg3LFwiZGF0YU5hc2NpbWVudG9cIjpcIkp1bCA3LCAyMDAxIDEyOjAwOjAwIEFNXCIsXCJpZEVuZGVyZWNvQ2xpZW50ZVwiOjIwMjI4ODcsXCJkYXRhQ2FkYXN0cm9cIjpcIk1hciAxOCwgMjAyMyAxMDoyNzozMyBQTVwiLFwiY2xpZW50ZUFudGlnb1wiOmZhbHNlfSxcImlkQ2xpZW50ZVwiOjIwMjI4ODcsXCJlbmRlcmVjb1wiOntcImNpZGFkZVwiOlwiUXVlZGFzIGRvIGlndWHDp3VcIixcImVzdGFkb1wiOlwiUFJcIixcImNvbXBsZW1lbnRvXCI6XCJjYXNhXCIsXCJlbmRlcmVjb1wiOlwicnVhIGphY2FzXCIsXCJudW1lcm9cIjpcIjg3NlwiLFwiYmFpcnJvXCI6XCJCb20gUGFzdG9yXCIsXCJpZFwiOjIwMjI4ODcsXCJjZXBcIjpcIjg1LjQ2MC0wMDBcIn0sXCJub21lXCI6XCJjYXJsb3MgZWR1YXJkb1wiLFwiaWRcIjoyMDIyOTAyLFwiZW1haWxcIjpcImNhZHV6YW5jaGV0dGFAZ21haWwuY29tXCIsXCJzdGF0dXNcIjpcIkFUSVZPXCIsXCJlbWFpbFZlcmlmaWNhZG9cIjp0cnVlLFwidmFsaWRhY2FvQXBwbGVcIjpmYWxzZX0iLCJleHAiOjE3NTA0MTQwNjl9.TlJBSULqqieOR65a8VFyG4lK2lKtF5gc6Q618HZ7zus',
  'sec-ch-ua': '"Chromium";v="137", "OperaMobile";v="90", ";Not A Brand";v="99", "Opera";v="121"',
  'sec-ch-ua-mobile': '?1',
  'origin': 'https://carcheckbrasil.com.br',
  'sec-fetch-site': 'same-site',
  'sec-fetch-mode': 'cors',
  'sec-fetch-dest': 'empty',
  'referer': 'https://carcheckbrasil.com.br/',
  'accept-language': 'pt-BR,pt;q=0.9,en-us;q=0.8,en;q=0.7',
  'priority': 'u=1, i'
};

async function pegarDadosVeiculo(parametro) {
  try {
    const payload = { parametro };
    const response = await axios.post(url, payload, { headers });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Erro na requisição: ${JSON.stringify(error.response.data)}`);
    }
    throw new Error(`Erro: ${error.message}`);
  }
}

module.exports = { pegarDadosVeiculo }
