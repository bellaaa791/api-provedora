/* 
• Scrape Ai Code Generator
• Source: https://whatsapp.com/channel/0029VakezCJDp2Q68C61RH2C
*/

const axios = require('axios')

const supportedLanguages = [
  'JavaScript', 'C#', 'C++', 'Java', 'Ruby', 'Go', 'Python', 'Custom', 'nodeJs'
]

const supportedModels = [
  'gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo',
  'claude-3-opus', 'claude-3-5-sonnet'
]

async function generateCode(prompt, language = 'JavaScript', model = 'gpt-4o-mini') {
  if (!supportedLanguages.includes(language)) {
    return {
      status: false,
      error: `Bahasa ga ada. Gunakan salah satu: ${supportedLanguages.join(', ')}`
    }
  }

  if (!supportedModels.includes(model)) {
    return {
      status: false,
      error: `Model AI ga ada. Pilih salah satu: ${supportedModels.join(', ')}`
    }
  }

  const finalPrompt = language === 'Custom'
    ? prompt
    : `Tulis kode dalam bahasa ${language} untuk: ${prompt}`

  try {
    const response = await axios.post(
      'https://best-ai-code-generator.toolzflow.app/api/chat/public',
      {
        chatSettings: {
          model: model,
          temperature: 0.3,
          contextLength: 16385,
          includeProfileContext: false,
          includeWorkspaceInstructions: false,
          includeExampleMessages: false
        },
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that writes code in requested language.'
          },
          {
            role: 'user',
            content: finalPrompt
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'code_response',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                code: { type: 'string', description: 'Generated code' }
              },
              required: ['code']
            }
          }
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://best-ai-code-generator.toolzflow.app',
          'Referer': 'https://best-ai-code-generator.toolzflow.app/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
          'Accept': '*/*'
        }
      }
    )

    const rawCode = response.data?.code || ''
    const formattedCode = rawCode
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\"/g, '"')

    return {
      status: true,
      code: formattedCode.trim() || 'error'
    }
  } catch (e) {
    return {
      status: false,
      error: `Request gagal: ${e.message}`
    }
  }
}

// tes
//generateCode('crie uma função que gera nuneros de 0 a 1000 e se a pessoa digitar o número que a função escolher ela ganha ', 'nodeJs', 'claude-3-5-sonnet')
  //.then(res => console.log(res.code))
module.exports = { generateCode }