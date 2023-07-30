// controllers/openAIController.js
const axios = require('axios');
require('dotenv').config();

exports.generateText = async (req, res) => {
  try {
    const { prompt, temperature, maxTokens, tags } = req.body;

    const data = {
      prompt,
      temperature,
      max_tokens: maxTokens,
      stop: tags,
    };

    const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_KEY}`,
      },
    });

    res.json({ text: response.data.choices[0].text });
  } catch (error) {
    console.error('Error al generar el texto:', error.message);
    res.status(500).json({ error: 'Error al generar el texto' });
  }
};
