import axios from 'axios';

export async function teraboxDownloader(link) {
  try {
    if (!/^https:\/\/(1024)?terabox\.com\/s\//.test(link)) {
      throw new Error('❌ Link inválido! Use link do terabox.com ou 1024terabox.com');
    }

    const response = await axios.post('https://teraboxdownloader.online/api.php',
      { url: link },
      {
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://teraboxdownloader.online',
          'Referer': 'https://teraboxdownloader.online/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Accept': '*/*'
        }
      }
    );

    const data = response.data;

    if (!data?.direct_link) {
      throw new Error('❌ Nenhum link de download encontrado.');
    }

    return {
      file_name: data.file_name,
      size: data.size,
      size_bytes: data.sizebytes,
      direct_link: data.direct_link,
      thumb: data.thumb
    };

  } catch (error) {
    return { error: error.message };
  }
}