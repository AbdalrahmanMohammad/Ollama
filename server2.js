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

const port = 1968;

app.listen(port, () => console.log(`Server running on port ${port}`));






const fetchAdditionalData = async (document) => {
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.1',
        prompt: document,
        stream: true // Set stream to true to enable streaming
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from /api/generate');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let accumulatedResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // Decode and accumulate the response
      const chunk = decoder.decode(value, { stream: true });
      accumulatedResponse += JSON.parse(chunk).response;

      console.log(JSON.parse(chunk).response);

    }
    console.log(accumulatedResponse);

    return accumulatedResponse; // Return the accumulated response
  } catch (error) {
    console.error('Error fetching additional data:', error);
    throw error; // Re-throw the error to be caught in the caller function
  }
};

fetchAdditionalData("tell me a dad joke");
