import fetch from 'node-fetch';
import axios from 'axios';

const fetchJson = async (url, options) => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (err) {
        throw err;
    }
};

async function cpf(cpf) {
    const result = await fetchJson(`https://scooberchks.shop/api/api.php?cpf=${cpf.replace(/\s+/g, '')}`);
    return result;
}

async function cnpj(cnpj) {
    const result = await fetchJson(`https://publica.cnpj.ws/cnpj/${cnpj.replace(/\s+/g, '')}`);
    return result;
}

async function cep(cep) {
    const result = await fetchJson(`https://viacep.com.br/ws/${cep.replace(/\s+/g, '')}/json/`);
    return result;
}

async function ip(ip) {
    const result = await fetchJson(`http://ip-api.com/json/${ip}?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query`);
    return result;
}

async function placa(placa) {
    const result = await fetchJson(`http://br1.bronxyshost.com:4105/api/consultas/placa_completa?query=${placa}&token=oxz9q2HSp6ZDfDH29vgpAM8Yd-Hg4g9DyjMuKwhfSkRcmkZYPQqFPPCcMx0hknCO`);
    return {
        resultado: result.resultado
    };
}

async function telefone(telefone) {
    const result = await fetchJson(`http://br1.bronxyshost.com:4105/api/consultas/telefone_completo_v2?query=${telefone}&token=oxz9q2HSp6ZDfDH29vgpAM8Yd-Hg4g9DyjMuKwhfSkRcmkZYPQqFPPCcMx0hknCO`);
    const serasa = result.resultado.serasa || [];
    return {
        resultado: serasa.map(({ dadoscpf: d }) => ({
            nome: d.nome,
            cpf: d.cpf,
            mae: d.nome_mae,
            pai: d.nome_pai,
            nascimento: d.nasc,
            orgao_emissor: d.orgao_emissor,
            renda: d.renda,
            rg: d.rg,
            sexo: d.sexo,
            so: d.so,
            titulo_eleitor: d.titulo_eleitor,
            uf_emissao: d.uf_emissao,
        }))
    };
}

async function nome(nome) {
    try {
        const response = await fetchJson(`http://br1.bronxyshost.com:4105/api/consultas/nome_completo_v2?query=${nome}&token=oxz9q2HSp6ZDfDH29vgpAM8Yd-Hg4g9DyjMuKwhfSkRcmkZYPQqFPPCcMx0hknCO`);
        if (!Array.isArray(response.resultado)) {
            throw new Error("Resposta inválida da API");
        }
        return {
            resultado: response.resultado.map(({ dadoscpf: d }) => ({
                nome: d.nome || "",
                cpf: d.cpf || "",
                mae: d.nome_mae || "",
                pai: d.nome_pai || "",
                nascimento: d.nasc || "",
                sexo: d.sexo || "",
            }))
        };
    } catch (error) {
        console.error("Erro na consulta por nome:", error.message);
        return { resultado: [] };
    }
}

export { cpf, cnpj, cep, ip, telefone, placa, nome };
