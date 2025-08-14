/* 
• Scrape Spotify DL
• Source: https://whatsapp.com/channel/0029VakezCJDp2Q68C61RH2C
*/
 
const axios = require('axios')
 
function msToMinutes(ms) {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
 
 async function spotifyDownload(url) {
  if (!url) throw new Error('Link-nya mana, senpai?')
 
  const metaResponse = await axios.post('https://spotiydownloader.com/api/metainfo', { url }, {
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'https://spotiydownloader.com',
      'Referer': 'https://spotiydownloader.com/id',
      'User-Agent': 'Mozilla/5.0'
    }
  })
 
  const meta = metaResponse.data
  if (!meta || !meta.success || !meta.id)
    throw new Error('Gomen senpai! Aku gagal mengambil info lagunya')
 
  const dlResponse = await axios.post('https://spotiydownloader.com/api/download', { id: meta.id }, {
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'https://spotiydownloader.com',
      'Referer': 'https://spotiydownloader.com/id',
      'User-Agent': 'Mozilla/5.0'
    }
  })
 
  const result = dlResponse.data
  if (!result || !result.success || !result.link)
    throw new Error('Yabai! Gagal dapetin link-nya senpai!')
 
  return {
    artist: meta.artists || meta.artist || 'Unknown',
    title: meta.title || 'Unknown',
    duration: meta.duration_ms ? msToMinutes(meta.duration_ms) : 'Unknown',
    image: meta.cover || null,
    download: result.link
  }
}
 module.exports = { spotifyDownload }