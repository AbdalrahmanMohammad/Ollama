# Large language model demo with ollama

This project demonstrates how to compare user input with pre-stored facts in the backend using sentence embeddings. The comparison is done using the `all-MiniLM-L6v2` model via the Hugging Face API, and the similarity is calculated using the cosine similarity algorithm. The most similar document is combined with the user input and sent to Ollama, which returns a response that is streamed to the user interface.

## Features

- **Sentence Embeddings:** User input is compared with pre-stored facts using embeddings generated by the `all-MiniLM-L6v2` model.
- **Cosine Similarity:** The similarity between the user input and stored facts is calculated using the cosine similarity algorithm.
- **Interactive Response:** The most similar fact is combined with the user prompt and sent to Ollama, which generates a response.
- **Streaming Response:** The response is streamed in chunks to the user with an auto-scroll feature for seamless viewing.

## Technologies Used

- **Backend:** Node.js
- **APIs:** Hugging Face Inference API, Ollama API
- **Frontend:** HTML, CSS, JavaScript

## Demo video

https://github.com/user-attachments/assets/927057ce-a52e-493e-8869-556ef458d306

