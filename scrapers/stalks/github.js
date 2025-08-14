const axios = require('axios');


const getUserData = async (query) => {
try {
const userResponse = await axios.get(`https://api.github.com/users/${query}`);
const userData = userResponse.data;

const resultado = [];


resultado.push({
foto_perfil: userData.avatar_url,
nome: userData.name,
descricao: userData.bio,
localizacao: userData.location,
website: userData.blog,
email: userData.email,
seguidores: userData.followers,
seguindo: userData.following,
repositorios_publicos: userData.public_repos,
conta_criada_em: new Date(userData.created_at).toLocaleDateString(),
gists_publicos: userData.public_gists,
organizacoes: userData.organizations_url ? 'Tem Organizações' : 'Sem Organizações',
plano: userData.plan ? userData.plan.name : 'Plano Gratuito (Sem plano pago)',
ultima_atividade: new Date(userData.updated_at).toLocaleString(),
});


const reposResponse = await axios.get(userData.repos_url);
const repos = reposResponse.data;


resultado.push({
repositorios: repos.map(repo => ({
nome: repo.name,
ultimo_commit: new Date(repo.pushed_at).toLocaleString(),
estrelas: repo.stargazers_count,
forks: repo.forks_count,
linguagens: repo.language || 'Não especificado'
}))
});


return resultado
console.log(JSON.stringify(resultado, null, 2));

} catch (error) {
console.error('Erro ao buscar os dados do usuário:', error);
}
};

module.exports = { getUserData }