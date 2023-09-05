const quoteElement = document.getElementById('quote');
const newQuoteButton = document.getElementById('new-quote-btn');
const tweetButton = document.getElementById('tweet-button');
const saveButton = document.getElementById('save-button');

async function fetchAuthorInfo(authorName) {
  try {
    const response = await fetch(`https://random-quote-now.onrender.com/fetch-author-info?authorName=${encodeURIComponent(authorName)}`);
    const data = await response.json();
    
    // Handle the retrieved author information
    const authorInfo = data.extract;

    // Extracted data may contain HTML tags; you can sanitize or format it as needed
    document.getElementById('author-bio').innerHTML = authorInfo || 'No information available.';
  } catch (error) {
    console.error('Error fetching author info:', error);
    document.getElementById('author-bio').textContent = 'Could not fetch author information.';
  }
}


// Function to display saved quotes
function displaySavedQuotes(savedQuotes) {
  const quoteList = document.getElementById('quote-list');
  quoteList.innerHTML = ''; // Clear the previous list

  savedQuotes.forEach((quote, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${index + 1}. ${quote}`;
    quoteList.appendChild(listItem);
  });
}

// Event listener for the "Save Quote" button
saveButton.addEventListener('click', () => {
  const quoteText = quoteElement.textContent;
  saveQuote(quoteText);
});

// Function to save a quote to local storage
function saveQuote(quote) {
  // Retrieve existing saved quotes or initialize an empty array
  const savedQuotes = JSON.parse(localStorage.getItem('savedQuotes')) || [];
  // Add the new quote to the array
  savedQuotes.push(quote);
  // Save the updated array back to local storage
  localStorage.setItem('savedQuotes', JSON.stringify(savedQuotes));
  // Update the displayed list of saved quotes (optional)
  displaySavedQuotes(savedQuotes);
}

tweetButton.addEventListener('click', () => {
  // Quote text that you want to tweet
  const quoteText = document.getElementById('quote').textContent;
  // Create a tweet URL with the pre-composed text
  const tweetURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(quoteText)}`;
  // Open a new browser window or tab with the tweet URL
  window.open(tweetURL, '_blank');
});

// Function to fetch the API key from the server
async function fetchApiKey() {
  try {
    const response = await fetch('/get-api-key');
    const data = await response.json();
    const apiKey = data.apiKey;
    // Use the retrieved API key for your API requests
    // console.log('API Key:', apiKey);
    // Perform your API requests with apiKey
  } catch (error) {
    console.error('Error fetching API key:', error);
  }
}
// Call the function to fetch the API key when needed
fetchApiKey();

// Function to fetch a random background image
async function fetchRandomImage() {
    try {
      // Fetch the API key from your server
      const apiKeyResponse = await fetch('/get-api-key');
      const apiKeyData = await apiKeyResponse.json();
      const apiKey = apiKeyData.apiKey;

      const response = await fetch(`https://api.unsplash.com/photos/random/?client_id=${apiKey}`);
      const data = await response.json();
      const imageUrl = data.urls.regular;
      document.body.style.backgroundImage = `url(${imageUrl})`;
    } catch (error) {
      console.error('Error fetching random image:', error);
    }
  }
  
  const fetchRandomQuote = async () => {
    try {
      const response = await fetch('/random-quote');
      const data = await response.json();
      const quote = `${data.content} - ${data.author}`;
      quoteElement.textContent = quote;
      
      // Set the tweet button's data-text attribute to the quote text
      tweetButton.setAttribute('data-text', quote);
      // Refresh the tweet button
      if (twttr.widgets) {
        twttr.widgets.load();
      }

      // Set the author name
      document.getElementById('author-name').textContent = data.author;
        
      // Call the function to fetch author information
      fetchAuthorInfo(data.author);

      fetchRandomImage();
    
    } catch (error) {
      console.error('Error fetching quote:', error);
      quoteElement.textContent = 'Could not fetch a quote.';
    }
  };
  
  newQuoteButton.addEventListener('click', fetchRandomQuote);
    
  // Initial fetch
  fetchRandomQuote();