const { HfInference } = require('@huggingface/inference');
const { config } = require('dotenv');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

config({ path: '.env.local' });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('website'));

const port = 1060;

app.listen(port, () => console.log(`Server running on port ${port}`));




app.post('/fetch-data', async (req, res) => {
  const { document } = req.body;
  
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.1',
        prompt: document,
        stream: true // Enable streaming
      }),
    });

    if (!response.ok) {
      res.status(response.status).send('Failed to get response from /api/generate');
      return;
    }

console.log("teeest");

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    res.setHeader('Content-Type', 'text/plain');

    // Stream data to client
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value, { stream: true }));
      

      const chunk = decoder.decode(value, { stream: true });

      console.log(JSON.parse(chunk).response);
    }

    res.end();
  } catch (error) {
    console.error('Error fetching additional data:', error);
    res.status(500).send('Error fetching additional data');
  }
});

