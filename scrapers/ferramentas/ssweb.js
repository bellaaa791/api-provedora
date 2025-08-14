/*
 • Fitur By Anomaki Team
 • Created : xyzan code
 • Screenshot website (scrape)
 • Jangan Hapus Wm
 • https://whatsapp.com/channel/0029Vaio4dYC1FuGr5kxfy2l
*/

const axios = require('axios');
async function ssweb(url)
{
        const h = {
                'accept': '*/*',
                'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                'content-type': 'application/json',
                'origin': 'https://imagy.app',
                'priority': 'u=1, i',
                'referer': 'https://imagy.app/',
                'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
        };
        const data = {
                url: url,
                browserWidth: 1280,
                browserHeight: 720,
                fullPage: false,
                deviceScaleFactor: 1,
                format: 'png'
        };
        try
        {
                const res =
                        await axios
                        .post('https://gcp.imagy.app/screenshot/createscreenshot',
                                data,
                                {
                                        headers: h
                                }
                        );
                cu = {
                        id: res.data
                                .id,
                        fileUrl: res
                                .data
                                .fileUrl,
                        success: true
                }
                return(cu)
              
        }
        catch (e)
        {
                return {
                        success: false,
                        error: e.message
                };
        }
}
module.exports = { ssweb }
//ssweb('https://xvideos.com')