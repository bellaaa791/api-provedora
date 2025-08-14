/* [ PLAY, PLAY VIDEO, YTMP4, YTMP3 ]
* Thanks To Caliph Karna sudah menciptakan ytdl sekeren ini https://whatsapp.com/channel/0029VajR9El2f3EO6OKcsa3L
* Dibuat oleh https://whatsapp.com/channel/0029Vafqv9YCnA7wYTSDOI3F
*/

const fetch = require('node-fetch');
const yts = require('yt-search');

/*
function formats(views) {
    if (views >= 1000000) {
        return (views / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (views >= 1000) {
        return (views / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return views.toString();
}

async function ytmp4(query) {
  try {
    const apiUrl = `https://ytdl-api.caliphdev.com/download/video?url=${encodeURIComponent(query)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.status) throw new Error("Failed to retrieve video data");

    const { videoDetails, downloadUrl } = data;
    const { title, description, ownerChannelName, lengthSeconds, video_url, cover } = videoDetails;

    const durationSeconds = parseInt(lengthSeconds);
    const formattedDuration = formatDuration(durationSeconds);

    return {
      title,
      thumb: cover,
      date: videoDetails.publishDate,
      duration: formattedDuration,
      channel: ownerChannelName,
      videoUrl: downloadUrl,
      description,
      videoLink: video_url,
    };
  } catch (error) {
    throw error;
  }
}

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = minutes % 60;
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}:${String(formattedMinutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  }
  return `${formattedMinutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

var handler = async (m, { conn, command, text, usedPrefix }) => {
    if (!text) {
        return m.reply(`Contoh : ${usedPrefix+command} masukkan pencarian atau link`);
    }

    m.reply("Loading");

    try {
        if (command === 'play') {
            let search = await yts(text);
            let video = search.videos[0];

            if (!video) {
                return m.reply('No video found for your query.');
            }

            let videoId = video.videoId;
            let videoTitle = video.title;
            let videoViews = video.views;
            let thumbnail = video.thumbnail;
            let fviews = formats(videoViews);

            let response = await fetch(`https://ytdl-api.caliphdev.com/download/video?url=https://youtube.com/watch?v=${videoId}`);
            let data = await response.json();

            if (!data.status || !data.downloadUrl) {
                return m.reply('Failed to get download link.');
            }

            let downloadUrl = data.downloadUrl;

            await conn.sendMessage(m.chat, {
                audio: { url: downloadUrl },
                mimetype: 'audio/mpeg',
                fileName: `${videoTitle}.mp3`,
                contextInfo: {
                    externalAdReply: {
                        title: videoTitle,
                        body: `• Views: ${fviews}`,
                        thumbnailUrl: thumbnail,
                        mediaType: 1,
                        renderLargerThumbnail: true,
                    },
                },
            }, { quoted: m });

        } else if (command === 'yta' || command === 'ytmp3') {
            const response = await fetch(`https://ytdl-api.caliphdev.com/download/audio?url=${text}`);
            const data = await response.json();

            if (!data.status || !data.downloadUrl) {
                return m.reply('Failed to retrieve audio from the provided URL.');
            }

            const { videoDetails, downloadUrl } = data;
            const { title, viewCount, thumbnail, videoId } = videoDetails;

            const audioStream = await fetch(downloadUrl);
            const buffer = Buffer.from(await audioStream.arrayBuffer());

            await conn.sendMessage(m.chat, {
                audio: buffer,
                mimetype: 'audio/mpeg',
                fileName: `${title}.mp3`
            }, { quoted: m });

        } else if (command === 'ytv' || command === 'ytmp4') {
            const videoData = await ytmp4(text);
            const { title, description, channel, duration, thumb, videoUrl } = videoData;

            const caption = `*乂 Y T M P 4 - D O W N L O A D E R*\n\n` +
                            `   ◦ Title : ${title}\n` +
                            `   ◦ Author : ${channel}\n` +
                            `   ◦ Duration : ${duration}\n` +
                            `   ◦ Description : ${description || ""}`;

            const message = {
                mimetype: "video/mp4",
                fileName: `${title}.mp4`,
                caption,
                video: { url: videoUrl },
            };

            await conn.sendMessage(m.chat, message, { quoted: m });
        } else if (command === 'playvid' || command === 'playvideo') {
            let search = await yts(text);
            let video = search.videos[0];

            if (!video) throw new Error('No video found for the query');

            let { title, views, author, videoId, duration, thumbnail } = video;
            let videoUrl = `https://youtube.com/watch?v=${videoId}`;

            let formattedDuration = formatDuration(duration);
            let formattedViews = formats(views);

            let caption = `*乂 P L A Y - V I D E O*\n\n` +
                          `   ◦ Title : ${title}\n` +
                          `   ◦ Views : ${formattedViews}`

            let response = await fetch(`https://ytdl-api.caliphdev.com/download/video?url=${videoUrl}`);
            let json = await response.json();

            if (!json.status) throw new Error('Failed to fetch video details');

            let { downloadUrl } = json;
return downloadUrl

        } else {
            m.reply('Terjadi kesalahan');
        }

    } catch (e) {
        console.error('Error:', e);
        m.reply(eror);
    }
};

*/




const fetchAudio = async (text) => {
    try {
        const response = await fetch(`https://ytdl-api.caliphdev.com/download/audio?url=${text}`);
        const data = await response.json();

        if (!data.status || !data.downloadUrl) {
            console.log('Failed to retrieve audio from the provided URL.');
            return;
        }

        const { videoDetails, downloadUrl } = data;
        const { title, viewCount, thumbnail, videoId } = videoDetails;

        const audioStream = await fetch(downloadUrl);
        const buffer = Buffer.from(await audioStream.arrayBuffer());

        console.log(buffer);
        return buffer;
    } catch (error) {
        console.error('Error fetching audio:', error);
    }
};





