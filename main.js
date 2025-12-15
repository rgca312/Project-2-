// Giphy API Configuration
const API_KEY = 'OUoYh9hbaHQDAIIr5C8157tU8AuqneD6'; // Replace with your actual API key
const API_URL = 'https://api.giphy.com/v1/gifs/search';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsContainer = document.getElementById('resultsContainer');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorMessage = document.getElementById('errorMessage');

// State
let currentSearch = '';

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Handle Search
async function handleSearch() {
    const query = searchInput.value.trim();
    
    if (!query) {
        showError('Please enter a search term');
        return;
    }
    
    if (query === currentSearch) {
        return; // Don't search the same thing twice
    }
    
    currentSearch = query;
    
    // Show loading, hide error
    showLoading();
    hideError();
    clearResults();
    
    try {
        const gifs = await searchGifs(query);
        displayResults(gifs);
    } catch (error) {
        showError('Failed to fetch GIFs. Please try again.');
        console.error('Error:', error);
    } finally {
        hideLoading();
    }
}

// Search GIFs using Giphy API
async function searchGifs(query) {
    const params = new URLSearchParams({
        api_key: API_KEY,
        q: query,
        limit: 24,
        rating: 'g'
    });
    
    const response = await fetch(`${API_URL}?${params}`);
    
    if (!response.ok) {
        throw new Error('API request failed');
    }
    
    const data = await response.json();
    return data.data;
}

// Display Results
function displayResults(gifs) {
    if (gifs.length === 0) {
        showError('No GIFs found. Try a different search term.');
        return;
    }
    
    resultsContainer.innerHTML = '';
    
    gifs.forEach(gif => {
        const card = createGifCard(gif);
        resultsContainer.appendChild(card);
    });
}

// Create GIF Card
function createGifCard(gif) {
    const card = document.createElement('div');
    card.className = 'gif-card';
    
    const img = document.createElement('img');
    img.src = gif.images.fixed_height.url;
    img.alt = gif.title || 'GIF';
    img.loading = 'lazy';
    
    const title = document.createElement('div');
    title.className = 'gif-title';
    title.textContent = gif.title || 'Untitled GIF';
    
    card.appendChild(img);
    card.appendChild(title);
    
    // Click to open in new tab
    card.addEventListener('click', () => {
        window.open(gif.url, '_blank');
    });
    
    return card;
}

// UI Helper Functions
function showLoading() {
    loadingIndicator.classList.remove('hidden');
}

function hideLoading() {
    loadingIndicator.classList.add('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function clearResults() {
    resultsContainer.innerHTML = '';
}

// Load trending GIFs on page load
async function loadTrendingGifs() {
    try {
        const response = await fetch(
            `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=24&rating=g`
        );
        
        if (response.ok) {
            const data = await response.json();
            displayResults(data.data);
        }
    } catch (error) {
        console.error('Error loading trending GIFs:', error);
    }
}

// Initialize: Load trending GIFs
loadTrendingGifs();