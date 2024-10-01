// Replace with your Alpha Vantage API key
const apiKey = 'YOUR_ALPHA_VANTAGE_API_KEY';

// Function to fetch current SPY price
async function fetchCurrentPrice() {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=SPY&apikey=${apiKey}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        const price = data['Global Quote']['05. price'];
        document.getElementById('price').innerText = `$${parseFloat(price).toFixed(2)}`;
    } catch (error) {
        console.error('Error fetching current price:', error);
        document.getElementById('price').innerText = 'Error fetching price';
    }
}

// Function to fetch support and resistance levels (dummy data for now)
function fetchSupportResistanceLevels() {
    // These levels would be based on technical analysis, which you can compute or fetch from another API.
    const supportLevel = 420.00;
    const resistanceLevel = 450.00;

    document.getElementById('supportLevel').innerText = `$${supportLevel.toFixed(2)}`;
    document.getElementById('resistanceLevel').innerText = `$${resistanceLevel.toFixed(2)}`;
}

// Function to fetch supply and demand levels (dummy data for now)
function fetchSupplyDemandLevels() {
    // Supply and demand levels can also be calculated based on volume data or fetched from an API.
    const supplyLevel = 440.00;
    const demandLevel = 430.00;

    document.getElementById('supplyLevel').innerText = `$${supplyLevel.toFixed(2)}`;
    document.getElementById('demandLevel').innerText = `$${demandLevel.toFixed(2)}`;
}

// Call functions to fetch data and display on the page
fetchCurrentPrice();
fetchSupportResistanceLevels();
fetchSupplyDemandLevels();
