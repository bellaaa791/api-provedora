const axios = require('axios');

async function scrapeNGL(usuario, mensagem, quantidade, delay) {
    console.log("Iniciando scraper...");

    const deviceId = () => {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const part1 = Array.from({ length: 8 }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
        const part2 = Array.from({ length: 4 }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
        const part3 = Array.from({ length: 4 }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
        const part4 = Array.from({ length: 4 }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
        const part5 = Array.from({ length: 12 }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
        return `${part1}-${part2}-${part3}-${part4}-${part5}`;
    };

    for (let i = 0; i < quantidade; i++) {
        console.log(`Preparando para enviar mensagem ${i + 1}...`);

        const headers = {
            'Host': 'ngl.link',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': '*/*',
            'X-Requested-With': 'XMLHttpRequest',
            'Referer': `https://ngl.link/${usuario.split('/').pop()}`, // Apenas o nome de usuário
        };

        const data = new URLSearchParams({
            username: usuario.split('/').pop(), // Apenas o nome de usuário
            question: mensagem, // Mensagem recebida como parâmetro
            deviceId: deviceId(),
            gameSlug: '',
            referrer: '',
        });

        console.log(`Dados a serem enviados: ${data.toString()}`); // Log dos dados que estão sendo enviados

        try {
            const response = await axios.post('https://ngl.link/api/submit', data, { headers });
            console.log(`Resposta da API: ${JSON.stringify(response.data)}`); // Log da resposta da API
            if (response.status === 200) {
                console.log(`[+] Mensagem ${i + 1} enviada com sucesso!`);
            } else {
                console.log(`[-] Erro ao enviar mensagem ${i + 1}: Not Send`);
            }
        } catch (error) {
            console.error(`[-] Erro ao enviar mensagem ${i + 1}: ${error.response ? error.response.status : error.message}`);
        }

        // Atraso entre solicitações
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    console.log("Scraper concluído.");
}

// Exportação da função
module.exports = { scrapeNGL };
