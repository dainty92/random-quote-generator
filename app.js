require('dotenv').config();
const express = require('express');
const axios = require('axios');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

// Enable CORS in your server
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    next();
});

app.use(express.static('public'));

// Define a route to retrieve the API key
app.get('/get-api-key', (req, res) => {
    // Retrieve the API key from the environment variable
    const apiKey = process.env.API_KEY;
  
    // Check if the API key exists
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not found' });
    }
  
    // Send the API key as a response
    res.json({ apiKey });
});

// Define a route to fetch author information from Wikipedia
app.get('/fetch-author-info', async (req, res) => {
    try {
        const authorName = req.query.authorName;

        // Make a request to Wikipedia API
        const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&titles=${encodeURIComponent(authorName)}`);
        const data = await response.json();

        // Extract the relevant information
        const authorInfo = extractAuthorInfo(data);

        // Send the author information as JSON response
        res.json(authorInfo);
    } catch (error) {
        console.error('Error fetching author info:', error);
        res.status(500).json({ error: 'Could not fetch author info' });
    }
});

// Extract relevant author information from Wikipedia API response
function extractAuthorInfo(apiResponse) {
    try {
        const pages = apiResponse.query.pages;
        const firstPageId = Object.keys(pages)[0];
        const pageData = pages[firstPageId];
        const { title, extract } = pageData;
        return { title, extract };
    } catch (error) {
        console.error('Error extracting author info:', error);
        return { title: 'Author Not Found', extract: 'No information available.' };
    }
}

app.get('/random-quote', async (req, res) => {
  try {
    const response = await axios.get('https://api.quotable.io/random');
    const quote = response.data;
    res.json(quote);
  } catch (error) {
    console.error('Error fetching quote:', error);
    res.status(500).json({ error: 'Could not fetch a quote' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on https://random-quote-now.onrender.com`);
});
