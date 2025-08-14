const axios = require('axios')
const cheerio = require('cheerio')

const commonHeaders = {
    'cache-control': 'private, max-age=0, must-revalidate, no-cache, no-store',
    'content-encoding': 'br',
    'content-type': 'application/json',
    'date': new Date().toUTCString(),
    'display': 'staticcontent_sol',
    'expires': new Date(Date.now() - 86400000).toUTCString(),
    'response': '202',
    'server': 'nginx/1.14.0 (Ubuntu)',
    'set-cookie': 'ezoictest=stable; Path=/; Domain=falatron.com; Expires=' + new Date(Date.now() + 1800000).toUTCString() + '; HttpOnly',
    'vary': 'Accept-Encoding,Origin',
    'x-ezoic-cdn': 'Bypass',
    'x-middleton-display': 'staticcontent_sol',
    'x-middleton-response': '202',
    'accept': '*/*',
    'accept-encoding': 'deflate, br, zstd',
    'accept-language': 'pt-BR,pt;q=0.6',
    'cookie': 'ezoictest=stable',
    'origin': 'https://falatron.com',
    'priority': 'u=1, i',
    'referer': 'https://falatron.com/',
    'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132", "Brave";v="132"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'sec-gpc': '1',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
    'x-requested-with': 'XMLHttpRequest'
};

async function falatron(texto) {
    try {
        const payload = {
            voz: 'Shrek',
            texto: texto
        };

        const postHeaders = {
            ...commonHeaders,
            'content-length': JSON.stringify(payload).length,
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        };

        const { data } = await axios.post('https://falatron.com/tts', payload, { headers: postHeaders });
        console.log('Resposta inicial:', data);

        const taskId = data.task_id;
        const maxAttempts = 10;
        const delayBetweenAttempts = 2000;
        const requestTimeout = 5000;

        const getHeaders = {
            ...commonHeaders,
            'cache-control': 'public, max-age=2592000',
            'date': 'Wed, 29 Jan 2025 04:47:37 UTC',
            'response': '200',
            'x-ezoic-cdn': 'Miss',
            'x-middleton-response': '200',
            'x-origin-cache-control': ''
        };

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                console.log(`Tentativa ${attempt}: Acessando https://falatron.com/tts/${taskId}...`);

                const response = await axios.get(`https://falatron.com/tts/${taskId}`, {
                    headers: getHeaders,
                    timeout: requestTimeout
                });

                if (response.data && response.data.status !== 'Pendente') {
                    console.log(`Tentativa ${attempt} bem-sucedida:`, response.data);
                    return response.data;
                } else if (response.data && response.data.status === 'Pendente') {
                    console.log(`Tentativa ${attempt}: Status ainda pendente. Tentando novamente...`);
                } else {
                    console.log(`Tentativa ${attempt}: Resposta vazia ou inválida.`);
                }
            } catch (error) {
                console.error(`Tentativa ${attempt} falhou:`, error);

                if (attempt === maxAttempts) {
                    console.error('Número máximo de tentativas atingido.');
                    return null;
                }
            }

            await new Promise(resolve => setTimeout(resolve, delayBetweenAttempts));
        }

        console.error('Número máximo de tentativas atingido sem mudança no status.');
        return null;

    } catch (error) {
        console.error('Erro:', error);
        return null;
    }
}

//falatron('Olá pessoal, como vocês estão?');