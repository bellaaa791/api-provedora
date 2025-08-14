/* 
• Author: SaaOfc's
• Scrape Ai Puisi Generator
• Note: Bahasa bisa kembangin lagi, cek saja webnya. 
*/

const axios = require('axios')

const type = [
  'Haiku', 'Sonnet', 'Free Verse', 'Blank Verse',
  'Limerick', 'Romantic', 'Proposal', 'Love',
  'Lyric', 'Acrostic', 'Ballad', 'Epic',
  'Elegy', 'Ode', 'Pantoum', 'Narrative',
  'Cinquain', 'Villanelle', 'Sestina', 'Couplet'
]

const bahasa = ['English', 'Japanese', 'Indonesian']

const lengths = ['short', 'medium', 'long']

async function puisi({
  topic = 'cinta',
  length = 'long',
  type = 'Sonnet',
  lang = 'Indonesian'
} = {}) {
  try {
    if (!lengths.includes(length)) {
      throw `Panjang puisi ga ada. Gunakan salah satu dari: ${lengths.join(', ')}`
    }

    const url = 'https://aipoemgenerator.io'

    const getRes = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    })

    const tokenMatch = getRes.data.match(/<meta name="_token" content="(.*?)"/)
    if (!tokenMatch) throw 'token ga ada.'

    const token = tokenMatch[1]
    const cookies = getRes.headers['set-cookie'].map(c => c.split(';')[0]).join('; ')

    const form = new URLSearchParams()
    form.append('topic', topic)
    form.append('length', length)
    form.append('type', type)
    form.append('lang', lang)
    form.append('poemVersion', '1')
    form.append('_token', token)

    const postRes = await axios.post(`${url}/generate_poem`, form.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': cookies,
        'Referer': `${url}/`,
        'Origin': url,
        'X-Requested-With': 'XMLHttpRequest'
      }
    })

    return {
      status: true,
      result: postRes.data?.trim()
    }

  } catch (e) {
    return {
      status: false,
      message: 'ga ada respon',
      error: e?.message || e
    }
  }
}

// tes
/*const res = await puisi({
  topic: 'buceta molhada e pika broxa',
  type: 'Romantic',
  lang: 'portuguese',
  length: 'medium' 
})
console.log(res.result)
*/
module.exports = { puisi }