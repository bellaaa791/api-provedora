/*
Feito por tokyo

#daki infos
#daki apis
#2024

#suporte: +55 32 98507-6325

canal youtube: @134_tokyo

canal 1 whatsapp:
https://whatsapp.com/channel/0029VaYz83R6mYPV4dV55h3H

canap 2 whatsapp: 
https://whatsapp.com/channel/0029VaGdVmn4inowmCI3OU3Z




*/
const fetch = require('node-fetch');
const token = 'BQA-jtyB1-bPjrAns07PHnI_lZ1LyQ9HLekoiL2f4RZkGJPzPRG5QY0AWTx-6XFpaSgsO3Ir9m09vHdTsMJTfXjmDz-YCKFhsBRkJj7NuKd4fSZV4gF6xMurC9nIVRg90-v2xZpPOqT2WcaS7TAPyhuoMPjQ670hStIhDRSlh71wJc_77RhPR1VEtTGVBvvWp98773Z11jajylxzcBv8-3l7YpppE5wsfg5OjLXS1JLh71ndQrHkxeTphZHCqhJc2TqRDrFMiI6Re3OO7Sjyu4vEVmWmF9bL';
async function fetchWebApi(endpoint, method, body) {
const res = await fetch(`https://api.spotify.com/${endpoint}`, {
headers: {
Authorization: `Bearer ${token}`,
},
method,
body: body ? JSON.stringify(body) : undefined, 
});
return await res.json();
}

async function searchSpotify(query, type = 'track', limit = 5) {
const endpoint = `v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`;
return await fetchWebApi(endpoint, 'GET');
}

module.exports = { searchSpotify }
/*
Feito por tokyo

#daki infos
#daki apis
#2024

#suporte: +55 32 98507-6325

canal youtube: @134_tokyo

canal 1 whatsapp:
https://whatsapp.com/channel/0029VaYz83R6mYPV4dV55h3H

canap 2 whatsapp: 
https://whatsapp.com/channel/0029VaGdVmn4inowmCI3OU3Z




*/
