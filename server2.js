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

const port = 1409;

app.listen(port, () => console.log(`Server running on port ${port}`));

const documents = [
  "endeavorpal is a software development company that develop digital products and it is located in nablus, palestine",
  "Water boils at 100 degrees Celsius at standard atmospheric pressure.",
  "Honey never spoils and archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still edible.",
  "Mount Everest is the tallest mountain in the world, standing at 29,032 feet above sea level.",
  "Octopuses have three hearts and blue blood, and they can change color to blend in with their surroundings.",
  "Albert Einstein developed the theory of relativity, which revolutionized our understanding of space, time, and gravity.",
  "Bananas are berries, but strawberries are not; botanically, strawberries are aggregate fruits.",
  "The Amazon Rainforest produces more than 20% of the world's oxygen supply.",
  "Light travels at a speed of approximately 299,792 kilometers per second in a vacuum.",
  "Venus is the hottest planet in our solar system with surface temperatures over 450 degrees Celsius, even hotter than Mercury, the closest planet to the Sun."
];

const hf = new HfInference('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');

const computeSimilarity = async (inputText) => {
  try {
    const generateEmbeddings = await hf.featureExtraction({
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      inputs: [inputText, ...documents]
    });

    if (generateEmbeddings.length !== documents.length + 1) {
      throw new Error('Mismatch in number of embeddings generated');
    }

    const inputEmbedding = generateEmbeddings[0];
    const documentEmbeddings = generateEmbeddings.slice(1);

    const cosineSimilarity = (a, b) => {
      const dotProduct = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
      const magnitudeA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
      const magnitudeB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
      return dotProduct / (magnitudeA * magnitudeB);
    };

    let biggestSimilarity = -Infinity;
    let mostSimilarDoc = "";

    const similarities = documents.map((document, index) => {
      const similarity = cosineSimilarity(inputEmbedding, documentEmbeddings[index]);
      if (similarity > biggestSimilarity) {
        biggestSimilarity = similarity;
        mostSimilarDoc = document;
      }
      return {
        document,
        similarity: (similarity * 100).toFixed(2)
      };
    });

    return {
      similarities,
      mostSimilarDocument: {
        document: mostSimilarDoc,
        similarity: (biggestSimilarity * 100).toFixed(2)
      }
    };
  } catch (error) {
    console.error('Error computing similarity:', error);
    throw error;
  }
};


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
        stream: false
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from /api/generate');
    }

    const data = await response.json();
    return data.response; // Return only the `response` field
  } catch (error) {
    console.error('Error fetching additional data:', error);
    throw error; // Re-throw the error to be caught in the caller function
  }
};



app.post('/similarity', async (req, res) => {
  try {
    const { inputText } = req.body;
    if (!inputText) {
      return res.status(400).json({ error: 'Input text is required' });
    }

    // Compute the similarity
    const result = await computeSimilarity(inputText);

    console.log(result);

    const mostSimilarDoc = result.mostSimilarDocument.document;

    console.log(mostSimilarDoc);

    let prompt = `
    Provide a brief explanation about ${inputText}. Here is a relevant fact:${mostSimilarDoc}
    but don't refer to that i gave you the fact, pretend that you're are giving it to me yourself.
    and speak as i just didn't privde you with any fact at all, and consider the fact i provided you as an absolute fact`;

    // Fetch additional data from /api/generate
    const additionalData = await fetchAdditionalData(mostSimilarDoc);

    console.log("done");

    // Combine the results
    const combinedResult = {
      ...result,
      additionalData // Add the response from /api/generate to the result
    };

    // Send the combined result back to the user
    return res.json(combinedResult);

  } catch (error) {
    console.error('Error in POST /similarity:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
