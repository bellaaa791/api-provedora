/*
*YTDOWNLOADER*

> type case
> ytmp3 & ytmp4 & play

case 'ytmp3': {
 if (!(await checkRegistration(m))) return;
 if (!text) return m.reply(`Silakan masuk kan link youtube nya, Contoh: ${prefix + command} https://youtube.com/watch?v=Xs0Lxif1u9E`);

 const url = text.trim();
 const format = 'mp3';

 const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

 if (!regex.test(url)) {
 return m.reply('link yang anda berikan tidak valid, silahkan masuk kan link yang benar.');
 }
 reply('✨ Tunggu sebentar');
 try {
 const response = await axios.post('http://kinchan.sytes.net/ytdl/downloader', {
 url: url,
 format: format
 });

 const { title, downloadUrl } = response.data;

 const audioResponse = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
 const audioBuffer = Buffer.from(audioResponse.data);

 await Klee.sendMessage(m.chat, {
 audio: audioBuffer,
 mimetype: 'audio/mpeg',
 ptt: false
 }, { quoted: m });

 } catch (error) {
 console.error('Error:', error);
 m.reply('Terjadi kesalahan saat mengunduh video, silahkan coba lagi.');
 }
}
break

// batas ytmp4

case 'ytmp4': {
 if (!(await checkRegistration(m))) return;
 if (!text) return m.reply(`Silakan masuk kan link youtube nya, Contoh: ${prefix + command} https://youtube.com/watch?v=Xs0Lxif1u9E`);

 const url = text.trim();
// Format video 360 480 720 1080 4k
 const format = '360';

 const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

 if (!regex.test(url)) {
 return m.reply('link yang anda berikan tidak valid, silahkan masuk kan link yang benar.');
 }
 reply('✨ Tunggu sebentar');
 try {
 const response = await axios.post('http://kinchan.sytes.net/ytdl/downloader', {
 url: url,
 format: format
 });

 const { title, downloadUrl } = response.data;

 const videoResponse = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
 const videoBuffer = Buffer.from(videoResponse.data);

 await Klee.sendMessage(m.chat, {
 video: videoBuffer,
 caption: `${title}`,
 mimetype: 'video/mp4'
 }, { quoted: m });

 } catch (error) {
 console.error('Error:', error);
 m.reply('Terjadi kesalahan saat mengunduh video, silahkan coba lagi.');
 }
}
break


// batas play

exports.fetchdata = async (url, options) => {
	try {
		options ? options : {}
		const res = await axios({
			method: "GET",
			url,
			headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36",
				'DNT': 1,
				'Upgrade-Insecure-Request': 1
			},
			...options,
			responseType: 'arraybuffer'
		})
		return res.data
	} catch (err) {
		return err
	}
}

case 'play': {
    if (!(await checkRegistration(m))) return;
    if (!text) return m.reply(`Silakan masukkan judul lagu yang ingin dicari, Contoh: ${prefix + command} senorita`);
    const { fetchdata } = require("./all/function.js")
    const yts = require('yt-search');
    const query = text.trim();
    reply('✨Tunggu Sebentar, Sedang Mencari Lagu...');

    try {
        const searchResult = await yts(query);
        if (searchResult.videos.length === 0) {
            return m.reply('Tidak ada hasil ditemukan untuk pencarian tersebut.');
        }

        const video = searchResult.videos[0];
        const url = video.url;
        const format = 'mp3';

        const response = await axios.post('http://kinchan.sytes.net/ytdl/downloader', {
            url: url,
            format: format
        });

        const { title, downloadUrl } = response.data;

        const audioResponse = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
        const audioBuffer = Buffer.from(audioResponse.data);

        await Klee.sendMessage(m.chat, {
            audio: audioBuffer,
            mimetype: 'audio/mp4',
            fileName: `${title}.mp3`,
            contextInfo: {
                isForwarded: true,
                forwardingScore: 99999,
                externalAdReply: {
                    showAdAttribution: true,
                    mediaType: 2,
                    previewType: 2,
                    mediaUrl: url,
                    title: title,
                    body: `views: ${video.views} / durasi: ${video.timestamp}`,
                    sourceUrl: url,
                    thumbnail: await fetchdata(video.thumbnail),
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: m });

    } catch (error) {
        console.error('Error:', error);
        m.reply('Terjadi kesalahan saat mengunduh video, silahkan coba lagi.');
    }
}
break
*/