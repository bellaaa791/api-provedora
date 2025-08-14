/* 
• Gerador de Imagens Realistas com IA
• Autor original: SaaOfc's (traduzido e adaptado por ChatGPT)
*/

const axios = require('axios');
const FormData = require('form-data');

const mapaEstilos = {
  fotorealista: 'photorealistic style image',
  cinematográfico: 'cinematic style image',
  hiperrealista: 'hyperrealistic style image',
  retrato: 'portrait style image'
};

const mapaResolucao = {
  '512x512': { largura: 512, altura: 512 },
  '768x768': { largura: 768, altura: 768 },
  '1024x1024': { largura: 1024, altura: 1024 },
  '1920x1080': { largura: 1920, altura: 1080 }
};

const GerarImagemRealista = async ({ prompt, estilo = 'fotorealista', resolucao = '768x768', seed = null }) => {
  const estiloSelecionado = mapaEstilos[estilo.toLowerCase()];
  const resolucaoSelecionada = mapaResolucao[resolucao];

  if (!estiloSelecionado || !resolucaoSelecionada) {
    return { sucesso: false, erro: 'Estilo ou resolução inválida.' };
  }

  const promptCompleto = `${estiloSelecionado}: ${prompt}`;
  const form = new FormData();
  form.append('action', 'generate_realistic_ai_image');
  form.append('prompt', promptCompleto);
  form.append('seed', (seed || Math.floor(Math.random() * 100000)).toString());
  form.append('width', resolucaoSelecionada.largura.toString());
  form.append('height', resolucaoSelecionada.altura.toString());

  try {
    const res = await axios.post('https://realisticaiimagegenerator.com/wp-admin/admin-ajax.php', form, {
      headers: {
        ...form.getHeaders(),
        'origin': 'https://realisticaiimagegenerator.com',
        'referer': 'https://realisticaiimagegenerator.com/',
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64)',
        'accept': '*/*'
      }
    });

    const json = res.data;
    if (json?.success && json.data?.imageUrl) {
       url = json.data.imageUrl
             return url


      
    } else {
      return {
        sucesso: false,
        erro: 'Nenhum resultado retornado pela API.'
      };
    }
  } catch (e) {
    return {
      sucesso: false,
      erro: e.message
    };
  }
};

module.exports = {
  GerarImagemRealista
};
