// Fetch current SPY price using Alpha Vantage API
async function fetchCurrentPrice(symbol = 'SPY') {
    const apiKey = 'YOUR_ALPHA_VANTAGE_API_KEY';
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        const currentPrice = data['Global Quote']['05. price'];
        document.getElementById('spy-price').innerText = `$${parseFloat(currentPrice).toFixed(2)}`;
    } catch (error) {
        console.error('Error fetching SPY price:', error);
        document.getElementById('spy-price').innerText = 'Failed to load price.';
    }
}

// Fetch historical price and volume data for SPY
async function fetchPriceAndVolumeData(symbol = 'SPY') {
    const apiKey = 'YOUR_ALPHA_VANTAGE_API_KEY';
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const timeSeries = data['Time Series (Daily)'];

        // Extract price and volume information
        return Object.keys(timeSeries).map(date => {
            return {
                date: date,
                high: parseFloat(timeSeries[date]['2. high']),
                low: parseFloat(timeSeries[date]['3. low']),
                close: parseFloat(timeSeries[date]['4. close']),
                volume: parseInt(timeSeries[date]['5. volume'])
            };
        });
    } catch (error) {
        console.error('Error fetching price and volume data:', error);
        return [];
    }
}

// Calculate support and resistance levels
function calculateSupportResistance(prices) {
    const highPrices = prices.map(p => p.high);
    const lowPrices = prices.map(p => p.low);

    const resistanceLevel = Math.max(...highPrices);
    const supportLevel = Math.min(...lowPrices);

    document.getElementById('support-levels').innerText = `Support: $${supportLevel.toFixed(2)}`;
    document.getElementById('resistance-levels').innerText = `Resistance: $${resistanceLevel.toFixed(2)}`;
}

// Identify swing highs and lows
function calculateSwingHighsAndLows(prices, lookbackPeriod = 14) {
    const swingHighs = [];
    const swingLows = [];

    for (let i = lookbackPeriod; i < prices.length - lookbackPeriod; i++) {
        const currentPrice = prices[i];

        // Check if it's a swing high
        const isSwingHigh = prices.slice(i - lookbackPeriod, i).every(p => p.high < currentPrice.high) &&
                            prices.slice(i + 1, i + lookbackPeriod).every(p => p.high < currentPrice.high);

        // Check if it's a swing low
        const isSwingLow = prices.slice(i - lookbackPeriod, i).every(p => p.low > currentPrice.low) &&
                           prices.slice(i + 1, i + lookbackPeriod).every(p => p.low > currentPrice.low);

        if (isSwingHigh) {
            swingHighs.push({ date: currentPrice.date, price: currentPrice.high });
        }

        if (isSwingLow) {
            swingLows.push({ date: currentPrice.date, price: currentPrice.low });
        }
    }

    return { swingHighs, swingLows };
}

// Filter swing highs and lows based on volume spikes
function filterWithVolumeSpikes(swingHighs, swingLows, prices, volumeThresholdMultiplier = 1.5) {
    const avgVolume = prices.reduce((sum, p) => sum + p.volume, 0) / prices.length;
    const volumeThreshold = avgVolume * volumeThresholdMultiplier;

    const confirmedSupplyZones = swingHighs.filter(high => {
        const priceAtHigh = prices.find(p => p.date === high.date);
        return priceAtHigh.volume > volumeThreshold;
    });

    const confirmedDemandZones = swingLows.filter(low => {
        const priceAtLow = prices.find(p => p.date === low.date);
        return priceAtLow.volume > volumeThreshold;
    });

    return { confirmedSupplyZones, confirmedDemandZones };
}

// Display supply and demand zones in the UI
function displaySupplyDemandZones(supplyZones, demandZones) {
    const supplyText = supplyZones.map(zone => `Supply Zone: $${zone.price} on ${zone.date}`).join('<br>');
    const demandText = demandZones.map(zone => `Demand Zone: $${zone.price} on ${zone.date}`).join('<br>');

    document.getElementById('supplyZones').innerHTML = supplyText;
    document.getElementById('demandZones').innerHTML = demandText;
}

// Main function to analyze SPY data and display in the UI
async function analyzeSpyData() {
    // Fetch price and volume data
    const prices = await fetchPriceAndVolumeData('SPY');

    // Calculate support and resistance levels
    calculateSupportResistance(prices);

    // Identify swing highs and lows
    const { swingHighs, swingLows } = calculateSwingHighsAndLows(prices);

    // Confirm supply and demand zones with volume spikes
    const { confirmedSupplyZones, confirmedDemandZones } = filterWithVolumeSpikes(swingHighs, swingLows, prices);

    // Display supply and demand zones
    displaySupplyDemandZones(confirmedSupplyZones, confirmedDemandZones);
}

// Fetch the current price and analyze data on page load
fetchCurrentPrice();
analyzeSpyData();
